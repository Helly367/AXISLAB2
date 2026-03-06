import React, { useState } from 'react';
import {
    ArrowBack, Add, Delete, Warning,
    CheckCircle, Timeline, AttachMoney
} from "@mui/icons-material";

const PhaseBudgetDetail = ({
    phase,
    budgetConfig,
    onBack,
    onUpdateBudget,
    formatMontant
}) => {

    const [newDepense, setNewDepense] = useState({
        libelle: '',
        montant: '',
        date: new Date().toISOString().split('T')[0],
        type: 'normal'
    });

    const depensesPhase = (budgetConfig.depenses || [])
        .filter(d => d.phaseId === phase.id);

    const budgetPhase = budgetConfig.repartition?.[phase.id] || 0;

    const totalDepensePhase = depensesPhase.reduce(
        (acc, d) => acc + (Number(d.montant) || 0),
        0
    );

    const restePhase = budgetPhase - totalDepensePhase;

    const pourcentagePhase = budgetPhase > 0
        ? (totalDepensePhase / budgetPhase) * 100
        : 0;

    /* ===============================
       HANDLERS
    =============================== */

    const handleAddDepense = () => {

        if (!newDepense.libelle || !newDepense.montant) return;

        const depense = {
            ...newDepense,
            id: Date.now(),
            phaseId: phase.id,
            montant: Number(newDepense.montant)
        };

        onUpdateBudget({
            ...budgetConfig,
            depenses: [...(budgetConfig.depenses || []), depense]
        });

        setNewDepense({
            libelle: '',
            montant: '',
            date: new Date().toISOString().split('T')[0],
            type: 'normal'
        });
    };

    const handleDeleteDepense = (id) => {

        if (!window.confirm("Supprimer cette dépense ?")) return;

        onUpdateBudget({
            ...budgetConfig,
            depenses: (budgetConfig.depenses || [])
                .filter(d => d.id !== id)
        });
    };

    /* ===============================
       UI LOGIC
    =============================== */

    const statutColor =
        restePhase < 0 ? 'red'
            : pourcentagePhase >= 90 ? 'orange'
                : 'green';

    const statutMessage =
        restePhase < 0 ? 'Dépassement de budget'
            : pourcentagePhase >= 100 ? 'Budget épuisé'
                : pourcentagePhase >= 90 ? 'Budget presque épuisé'
                    : 'Dans les limites';

    const sortedDepenses = [...depensesPhase].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
    );

    /* =============================== */

    return (
        <div className="bg-white rounded-lg shadow-md p-6">

            {/* Header */}
            <div className="flex items-center gap-4 pb-6 border-b mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowBack />
                </button>

                <div>
                    <h2 className="text-3xl font-bold">{phase.title}</h2>
                    <p className="text-gray-500">Gestion budget détaillée</p>
                </div>
            </div>

            {/* Résumé */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">

                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600">Budget alloué</p>
                    <p className="text-2xl font-bold text-blue-700">
                        {formatMontant(budgetPhase)}
                    </p>
                </div>

                <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-orange-600">Dépensé</p>
                    <p className="text-2xl font-bold text-orange-700">
                        {formatMontant(totalDepensePhase)}
                    </p>
                </div>

                <div className={`${restePhase < 0 ? 'bg-red-50' : 'bg-green-50'} p-4 rounded-lg`}>
                    <p className={`text-sm ${restePhase < 0 ? 'text-red-600' : 'text-green-600'}`}>
                        Reste
                    </p>

                    <p className={`text-2xl font-bold ${restePhase < 0 ? 'text-red-700' : 'text-green-700'}`}>
                        {formatMontant(Math.abs(restePhase))}
                        {restePhase < 0 && " (dépassement)"}
                    </p>
                </div>

            </div>

            {/* Progression */}
            <div className="mb-8">

                <div className="flex justify-between mb-2">
                    <span className="font-medium">Progression</span>

                    <span className={`font-bold ${statutColor === 'red' ? 'text-red-600'
                        : statutColor === 'orange' ? 'text-orange-600'
                            : 'text-green-600'
                        }`}>
                        {pourcentagePhase.toFixed(1)}%
                    </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className={`h-4 rounded-full ${statutColor === 'red' ? 'bg-red-500'
                            : statutColor === 'orange' ? 'bg-orange-500'
                                : 'bg-green-500'
                            }`}
                        style={{
                            width: `${Math.min(pourcentagePhase, 100)}%`
                        }}
                    />
                </div>

                <div className="flex items-center gap-2 mt-2 text-sm">
                    {restePhase < 0
                        ? <Warning className="text-red-500" />
                        : <CheckCircle className="text-green-500" />}

                    <span className={
                        statutColor === 'red' ? 'text-red-600'
                            : statutColor === 'orange' ? 'text-orange-600'
                                : 'text-green-600'
                    }>
                        {statutMessage}
                    </span>
                </div>
            </div>

            {/* Ajouter dépense */}
            <div className="bg-gray-50 p-4 rounded-lg mb-8">

                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Add className="text-blue-600" />
                    Ajouter une dépense
                </h3>

                <div className="grid md:grid-cols-4 gap-3">

                    <input
                        type="text"
                        placeholder="Libellé"
                        value={newDepense.libelle}
                        onChange={e =>
                            setNewDepense({
                                ...newDepense,
                                libelle: e.target.value
                            })
                        }
                        className="p-2 border rounded-lg"
                    />

                    <input
                        type="number"
                        placeholder="Montant"
                        value={newDepense.montant}
                        onChange={e =>
                            setNewDepense({
                                ...newDepense,
                                montant: e.target.value
                            })
                        }
                        className="p-2 border rounded-lg"
                    />

                    <input
                        type="date"
                        value={newDepense.date}
                        onChange={e =>
                            setNewDepense({
                                ...newDepense,
                                date: e.target.value
                            })
                        }
                        className="p-2 border rounded-lg"
                    />

                    <button
                        onClick={handleAddDepense}
                        className="bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        Ajouter
                    </button>

                </div>
            </div>

            {/* Historique */}
            <div>

                <h3 className="font-bold mb-4 flex items-center gap-2">
                    <Timeline className="text-blue-600" />
                    Historique des dépenses
                </h3>

                {sortedDepenses.length > 0 ? (
                    <div className="space-y-3">

                        {sortedDepenses.map(depense => (
                            <div
                                key={depense.id}
                                className="flex justify-between p-3 border rounded-lg hover:shadow-md">

                                <div>
                                    <p className="font-medium">{depense.libelle}</p>

                                    <p className="text-sm text-gray-500">
                                        {new Date(depense.date).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">

                                    <span className="font-bold text-red-500">
                                        {formatMontant(depense.montant)}
                                    </span>

                                    <button
                                        onClick={() => handleDeleteDepense(depense.id)}
                                        className="text-gray-400 hover:text-red-500">
                                        <Delete />
                                    </button>

                                </div>

                            </div>
                        ))}

                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <AttachMoney className="text-gray-400 text-4xl mx-auto mb-2" />
                        <p className="text-gray-500">
                            Aucune dépense pour cette phase
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};

export default PhaseBudgetDetail;