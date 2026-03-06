import React, { useState } from 'react';
import {
    Receipt,
    Add,
    Warning
} from "@mui/icons-material";

const ExpensesTracker = ({
    budgetConfig = {},
    phases = [],
    onAddDepense,
    formatMontant
}) => {

    const [showAddForm, setShowAddForm] = useState(false);
    const [filterPhase, setFilterPhase] = useState('all');
    const [filterDate, setFilterDate] = useState('');

    const [newDepense, setNewDepense] = useState({
        libelle: '',
        montant: '',
        phaseId: '',
        date: new Date().toISOString().split('T')[0],
        type: 'normal',
        description: '',
        fournisseur: '',
        reference: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!newDepense.libelle ||
            !newDepense.montant ||
            !newDepense.phaseId) return;

        onAddDepense?.({
            ...newDepense,
            montant: Number(newDepense.montant)
        });

        setNewDepense({
            libelle: '',
            montant: '',
            phaseId: '',
            date: new Date().toISOString().split('T')[0],
            type: 'normal',
            description: '',
            fournisseur: '',
            reference: ''
        });

        setShowAddForm(false);
    };

    const depenses = budgetConfig.depenses || [];

    const filteredDepenses = depenses
        .filter(d => {
            if (filterPhase !== 'all' && d.phaseId !== Number(filterPhase)) return false;
            if (filterDate && d.date !== filterDate) return false;
            return true;
        })
        .sort((a, b) => new Date(b.date) - new Date(a.date));

    const stats = {
        total: filteredDepenses.reduce((acc, d) => acc + Number(d.montant || 0), 0),
        count: filteredDepenses.length
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 m-8">

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2">
                    <Receipt className="text-blue-600" />
                    Suivi des dépenses
                </h2>

                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <Add /> Nouvelle dépense
                </button>
            </div>

            {/* ===== Formulaire ===== */}
            {showAddForm && (
                <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6 space-y-4">

                    <div className="grid md:grid-cols-2 gap-4">

                        <input
                            placeholder="Libellé *"
                            value={newDepense.libelle}
                            onChange={e =>
                                setNewDepense(p => ({ ...p, libelle: e.target.value }))
                            }
                            className="p-2 border rounded-lg"
                            required
                        />

                        <input
                            type="number"
                            placeholder="Montant *"
                            value={newDepense.montant}
                            onChange={e =>
                                setNewDepense(p => ({ ...p, montant: e.target.value }))
                            }
                            className="p-2 border rounded-lg"
                            required
                        />

                        <select
                            value={newDepense.phaseId}
                            onChange={e =>
                                setNewDepense(p => ({ ...p, phaseId: e.target.value }))
                            }
                            className="p-2 border rounded-lg"
                            required
                        >
                            <option value="">Phase</option>
                            {phases.map(phase => (
                                <option key={phase.id} value={phase.id}>
                                    {phase.title}
                                </option>
                            ))}
                        </select>

                        <input
                            type="date"
                            value={newDepense.date}
                            onChange={e =>
                                setNewDepense(p => ({ ...p, date: e.target.value }))
                            }
                            className="p-2 border rounded-lg"
                        />

                    </div>

                    <textarea
                        placeholder="Description"
                        value={newDepense.description}
                        onChange={e =>
                            setNewDepense(p => ({ ...p, description: e.target.value }))
                        }
                        className="w-full p-2 border rounded-lg"
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
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                        >
                            Enregistrer
                        </button>
                    </div>

                </form>
            )}

            {/* ===== Liste ===== */}
            {filteredDepenses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Receipt className="text-gray-400 text-5xl mx-auto mb-3" />
                    <p className="text-gray-500">Aucune dépense enregistrée</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredDepenses.map(depense => {

                        const phase = phases.find(p =>
                            p.id === Number(depense.phaseId)
                        );

                        return (
                            <div
                                key={depense.id}
                                className="border rounded-lg p-4 hover:shadow-md transition"
                            >
                                <h4 className="font-bold">{depense.libelle}</h4>

                                <p className="text-sm text-gray-500">
                                    {phase?.title} •
                                    {new Date(depense.date).toLocaleDateString('fr-FR')}
                                </p>

                                <p className="text-xl font-bold text-red-500 mt-2">
                                    {formatMontant?.(depense.montant) || depense.montant}
                                </p>

                                {depense.description && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {depense.description}
                                    </p>
                                )}

                                {depense.type === 'reserve' && (
                                    <span className="text-xs bg-yellow-100 px-2 py-1 rounded-full mt-2 inline-block">
                                        Réserve
                                    </span>
                                )}

                                {budgetConfig.repartition?.[depense.phaseId] &&
                                    depense.montant >
                                    (budgetConfig.repartition[depense.phaseId] || 0) && (
                                        <p className="text-red-500 text-xs flex items-center gap-1 mt-2">
                                            <Warning fontSize="small" />
                                            Dépassement phase
                                        </p>
                                    )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ExpensesTracker;