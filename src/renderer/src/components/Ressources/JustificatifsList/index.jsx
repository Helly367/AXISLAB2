import React, { useState } from 'react';
import {
    Description,
    Add,
    Delete,
    Download,
    Visibility,
    AttachFile,
    Image,
    PictureAsPdf
} from "@mui/icons-material";

const JustificatifsList = ({ budgetConfig, phases, onAddJustificatif, formatMontant }) => {
    const [selectedDepense, setSelectedDepense] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newJustificatif, setNewJustificatif] = useState({
        nom: '',
        type: 'pdf',
        fichier: null,
        description: ''
    });

    // Récupérer toutes les dépenses avec justificatifs
    const depensesAvecJustificatifs = budgetConfig.depenses.filter(d => d.justificatifs?.length > 0);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewJustificatif({
                ...newJustificatif,
                nom: file.name,
                type: file.type.includes('pdf') ? 'pdf' :
                    file.type.includes('image') ? 'image' : 'document',
                fichier: file
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedDepense || !newJustificatif.nom) return;

        const justificatif = {
            id: Date.now(),
            ...newJustificatif,
            date: new Date().toISOString().split('T')[0],
            url: URL.createObjectURL(newJustificatif.fichier) // Simulé
        };

        onAddJustificatif(selectedDepense, justificatif);
        setNewJustificatif({ nom: '', type: 'pdf', fichier: null, description: '' });
        setShowAddForm(false);
    };

    const getIcone = (type) => {
        switch (type) {
            case 'pdf': return <PictureAsPdf className="text-red-500" />;
            case 'image': return <Image className="text-blue-500" />;
            default: return <Description className="text-gray-500" />;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                <Description className="text-blue-600" />
                Justificatifs de dépenses
            </h2>

            {depensesAvecJustificatifs.length > 0 ? (
                <div className="space-y-6">
                    {depensesAvecJustificatifs.map((depense) => {
                        const phase = phases.find(p => p.id === depense.phaseId);

                        return (
                            <div key={depense.id} className="border rounded-lg p-4">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800">{depense.libelle}</h3>
                                        <p className="text-sm text-gray-500">
                                            {phase?.title} • {formatMontant(depense.montant)} • {new Date(depense.date).toLocaleDateString('fr-FR')}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedDepense(depense.id);
                                            setShowAddForm(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm">
                                        <Add fontSize="small" /> Ajouter
                                    </button>
                                </div>

                                {/* Liste des justificatifs */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {depense.justificatifs.map((justif) => (
                                        <div key={justif.id} className="bg-gray-50 rounded-lg p-3 flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                {getIcone(justif.type)}
                                                <div>
                                                    <p className="font-medium text-gray-700">{justif.nom}</p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(justif.date).toLocaleDateString('fr-FR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                                                    <Visibility fontSize="small" />
                                                </button>
                                                <button className="p-1 text-green-600 hover:bg-green-100 rounded">
                                                    <Download fontSize="small" />
                                                </button>
                                                <button className="p-1 text-red-600 hover:bg-red-100 rounded">
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
                    <p className="text-sm text-gray-400 mt-1">
                        Les justificatifs apparaîtront ici après l'ajout de dépenses
                    </p>
                </div>
            )}

            {/* Modal d'ajout de justificatif */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Ajouter un justificatif</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fichier
                                </label>
                                <input
                                    type="file"
                                    onChange={handleFileChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={newJustificatif.description}
                                    onChange={(e) => setNewJustificatif({ ...newJustificatif, description: e.target.value })}
                                    className="w-full p-2 border border-gray-300 rounded-lg"
                                    rows="3"
                                    placeholder="Description du justificatif..."
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddForm(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
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