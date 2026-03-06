import React, { useState } from 'react';
import {
    Description,
    Add,
    Delete,
    Download,
    Visibility,
    Image,
    PictureAsPdf
} from "@mui/icons-material";

const JustificatifsList = ({
    budgetConfig = {},
    phases = [],
    onAddJustificatif,
    formatMontant
}) => {

    const [selectedDepense, setSelectedDepense] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);

    const [newJustificatif, setNewJustificatif] = useState({
        nom: '',
        type: 'pdf',
        fichier: null,
        description: ''
    });

    const depensesAvecJustificatifs =
        budgetConfig.depenses?.filter(d => d.justificatifs?.length > 0) || [];

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setNewJustificatif(prev => ({
            ...prev,
            nom: file.name,
            type: file.type.includes('pdf')
                ? 'pdf'
                : file.type.includes('image')
                    ? 'image'
                    : 'document',
            fichier: file
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedDepense || !newJustificatif.fichier) return;

        const justificatif = {
            id: Date.now(),
            nom: newJustificatif.nom,
            type: newJustificatif.type,
            description: newJustificatif.description,
            date: new Date().toISOString().split('T')[0],
            url: URL.createObjectURL(newJustificatif.fichier)
        };

        onAddJustificatif?.(selectedDepense, justificatif);

        setNewJustificatif({
            nom: '',
            type: 'pdf',
            fichier: null,
            description: ''
        });

        setShowAddForm(false);
    };

    const getIcone = (type) => {
        if (type === 'pdf') return <PictureAsPdf className="text-red-500" />;
        if (type === 'image') return <Image className="text-blue-500" />;
        return <Description className="text-gray-500" />;
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">

            <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                <Description className="text-blue-600" />
                Justificatifs de dépenses
            </h2>

            {depensesAvecJustificatifs.length > 0 ? (
                <div className="space-y-6">

                    {depensesAvecJustificatifs.map(depense => {

                        const phase = phases.find(p => p.id === depense.phaseId);

                        return (
                            <div key={depense.id} className="border rounded-lg p-4">

                                <div className="flex justify-between items-start mb-4">

                                    <div>
                                        <h3 className="font-bold">{depense.libelle}</h3>

                                        <p className="text-sm text-gray-500">
                                            {phase?.title} • {formatMontant?.(depense.montant) || depense.montant}
                                            • {new Date(depense.date).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => {
                                            setSelectedDepense(depense.id);
                                            setShowAddForm(true);
                                        }}
                                        className="text-blue-600 text-sm flex items-center gap-1 hover:text-blue-800"
                                    >
                                        <Add fontSize="small" /> Ajouter
                                    </button>

                                </div>

                                {/* Justificatifs */}
                                <div className="grid md:grid-cols-2 gap-3">

                                    {depense.justificatifs.map(justif => (
                                        <div
                                            key={justif.id}
                                            className="bg-gray-50 rounded-lg p-3 flex justify-between items-center group"
                                        >
                                            <div className="flex items-center gap-3">
                                                {getIcone(justif.type)}

                                                <div>
                                                    <p className="font-medium">{justif.nom}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(justif.date).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">

                                                <button className="p-1 hover:bg-blue-100 rounded">
                                                    <Visibility fontSize="small" />
                                                </button>

                                                <button className="p-1 hover:bg-green-100 rounded">
                                                    <Download fontSize="small" />
                                                </button>

                                                <button className="p-1 hover:bg-red-100 rounded">
                                                    <Delete fontSize="small" />
                                                </button>

                                            </div>
                                        </div>
                                    ))}

                                </div>
                            </div>
                        );
                    })}

                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Description className="text-gray-400 text-5xl mx-auto mb-3" />
                    <p className="text-gray-500">Aucun justificatif</p>
                    <p className="text-sm text-gray-400">
                        Les justificatifs apparaîtront après l'ajout de dépenses
                    </p>
                </div>
            )}

            {/* Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

                    <div className="bg-white rounded-lg p-6 max-w-md w-full">

                        <h3 className="text-xl font-bold mb-4">
                            Ajouter un justificatif
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            <input
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className="w-full p-2 border rounded-lg"
                                required
                            />

                            <textarea
                                value={newJustificatif.description}
                                onChange={e =>
                                    setNewJustificatif(prev => ({
                                        ...prev,
                                        description: e.target.value
                                    }))
                                }
                                className="w-full p-2 border rounded-lg"
                                rows={3}
                                placeholder="Description..."
                            />

                            <div className="flex justify-end gap-3">

                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 border rounded-lg"
                                >
                                    Annuler
                                </button>

                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                                >
                                    Ajouter
                                </button>

                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JustificatifsList;