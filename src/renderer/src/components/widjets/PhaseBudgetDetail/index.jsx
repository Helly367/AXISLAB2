import React, { useState } from 'react';
import {
    ArrowBack, Add, Delete, Warning,
    CheckCircle, Timeline, AttachMoney
} from "@mui/icons-material";

const PhaseBudgetDetail = ({ phase, budgetConfig, onBack, onUpdateBudget, formatMontant }) => {
    const [newDepense, setNewDepense] = useState({
        libelle: '',
        montant: '',
        date: new Date().toISOString().split('T')[0],
        type: 'normal'
    });

    const budgetPhase = budgetConfig.repartition[phase.id] || 0;
    const depensesPhase = budgetConfig.depenses.filter(d => d.phaseId === phase.id);
    const totalDepensePhase = depensesPhase.reduce((acc, d) => acc + d.montant, 0);
    const restePhase = budgetPhase - totalDepensePhase;
    const pourcentagePhase = budgetPhase > 0 ? (totalDepensePhase / budgetPhase) * 100 : 0;

    const handleAddDepense = () => {
        if (!newDepense.libelle || !newDepense.montant) return;

        const depense = {
            ...newDepense,
            id: Date.now(),
            phaseId: phase.id,
            montant: Number(newDepense.montant)
        };

        const updatedDepenses = [...budgetConfig.depenses, depense];
        onUpdateBudget({
            ...budgetConfig,
            depenses: updatedDepenses
        });

        setNewDepense({
            libelle: '',
            montant: '',
            date: new Date().toISOString().split('T')[0],
            type: 'normal'
        });
    };

    const handleDeleteDepense = (id) => {
        if (window.confirm('Supprimer cette dépense ?')) {
            const updatedDepenses = budgetConfig.depenses.filter(d => d.id !== id);
            onUpdateBudget({
                ...budgetConfig,
                depenses: updatedDepenses
            });
        }
    };

    const statutColor = restePhase < 0 ? 'red' : pourcentagePhase >= 90 ? 'orange' : 'green';
    const statutMessage = restePhase < 0 ? 'Dépassement de budget' :
        pourcentagePhase >= 100 ? 'Budget épuisé' :
            pourcentagePhase >= 90 ? 'Budget presque épuisé' :
                'Dans les limites';

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header avec retour */}
            <div className="flex items-center gap-4 pb-6 border-b-2 border-gray-200 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowBack />
                </button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">{phase.title}</h2>
                    <p className="text-gray-500">Gestion du budget détaillée</p>
                </div>
            </div>

            {/* Résumé de la phase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 mb-1">Budget alloué</p>
                    <p className="text-2xl font-bold text-blue-700">{formatMontant(budgetPhase)}</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4">
                    <p className="text-sm text-orange-600 mb-1">Dépensé</p>
                    <p className="text-2xl font-bold text-orange-700">{formatMontant(totalDepensePhase)}</p>
                </div>
                <div className={`${restePhase < 0 ? 'bg-red-50' : 'bg-green-50'} rounded-lg p-4`}>
                    <p className={`text-sm ${restePhase < 0 ? 'text-red-600' : 'text-green-600'} mb-1`}>Reste</p>
                    <p className={`text-2xl font-bold ${restePhase < 0 ? 'text-red-700' : 'text-green-700'}`}>
                        {formatMontant(Math.abs(restePhase))}
                        {restePhase < 0 && ' (dépassement)'}
                    </p>
                </div>
            </div>

            {/* Barre de progression */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Progression</span>
                    <span className={`font-bold ${statutColor === 'red' ? 'text-red-600' :
                        statutColor === 'orange' ? 'text-orange-600' : 'text-green-600'
                        }`}>
                        {pourcentagePhase.toFixed(1)}%
                    </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className={`rounded-full h-4 ${statutColor === 'red' ? 'bg-red-500' :
                            statutColor === 'orange' ? 'bg-orange-500' : 'bg-green-500'
                            }`}
                        style={{ width: `${Math.min(pourcentagePhase, 100)}%` }}
                    ></div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                    {restePhase < 0 ? (
                        <Warning className="text-red-500" />
                    ) : (
                        <CheckCircle className="text-green-500" />
                    )}
                    <span className={`text-sm ${statutColor === 'red' ? 'text-red-600' :
                        statutColor === 'orange' ? 'text-orange-600' : 'text-green-600'
                        }`}>
                        {statutMessage}
                    </span>
                </div>
            </div>

            {/* Formulaire d'ajout de dépense */}
            <div className="bg-gray-50 rounded-lg p-4 mb-8">
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Add className="text-blue-600" />
                    Ajouter une dépense
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                        type="text"
                        placeholder="Libellé"
                        value={newDepense.libelle}
                        onChange={(e) => setNewDepense({ ...newDepense, libelle: e.target.value })}
                        className="p-2 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="number"
                        placeholder="Montant"
                        value={newDepense.montant}
                        onChange={(e) => setNewDepense({ ...newDepense, montant: e.target.value })}
                        className="p-2 border border-gray-300 rounded-lg"
                    />
                    <input
                        type="date"
                        value={newDepense.date}
                        onChange={(e) => setNewDepense({ ...newDepense, date: e.target.value })}
                        className="p-2 border border-gray-300 rounded-lg"
                    />
                    <button
                        onClick={handleAddDepense}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Ajouter
                    </button>
                </div>
            </div>

            {/* Liste des dépenses */}
            <div>
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Timeline className="text-blue-600" />
                    Historique des dépenses
                </h3>

                {depensesPhase.length > 0 ? (
                    <div className="space-y-3">
                        {depensesPhase.sort((a, b) => new Date(b.date) - new Date(a.date)).map((depense) => (
                            <div key={depense.id} className="flex justify-between items-center p-3 border rounded-lg hover:shadow-md transition-shadow">
                                <div>
                                    <p className="font-medium text-gray-800">{depense.libelle}</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(depense.date).toLocaleDateString('fr-FR')}
                                        {depense.type === 'reserve' && (
                                            <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                                                Réserve
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-red-500">
                                        {formatMontant(depense.montant)}
                                    </span>
                                    <button
                                        onClick={() => handleDeleteDepense(depense.id)}
                                        className="text-gray-400 hover:text-red-500 transition-colors">
                                        <Delete />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <AttachMoney className="text-gray-400 text-4xl mx-auto mb-2" />
                        <p className="text-gray-500">Aucune dépense pour cette phase</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PhaseBudgetDetail;