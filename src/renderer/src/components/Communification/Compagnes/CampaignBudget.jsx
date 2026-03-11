import React, { useState } from 'react';
import {
    AttachMoney,
    ArrowBack,
    Add,
    Delete,
    Edit,
    Warning,
    CheckCircle,
    Receipt,
    TrendingDown,
    TrendingUp
} from "@mui/icons-material";

const CampaignBudget = ({ campagne, onBack, onUpdate, budgetGlobal }) => {
    const [depenses, setDepenses] = useState(campagne.depenses_reelles || []);
    const [newDepense, setNewDepense] = useState({ poste: '', montant: '', date: new Date().toISOString().split('T')[0] });
    const [isAdding, setIsAdding] = useState(false);

    const totalDepenses = depenses.reduce((sum, d) => sum + d.montant, 0);
    const budgetRestant = campagne.budgetAlloue - totalDepenses;
    const pourcentageUtilise = (totalDepenses / campagne.budgetAlloue) * 100;

    const handleAddDepense = () => {
        if (newDepense.poste && newDepense.montant) {
            const updatedDepenses = [...depenses, { ...newDepense, montant: Number(newDepense.montant) }];
            setDepenses(updatedDepenses);
            onUpdate({ ...campagne, depenses_reelles: updatedDepenses });
            setNewDepense({ poste: '', montant: '', date: new Date().toISOString().split('T')[0] });
            setIsAdding(false);
        }
    };

    const handleDeleteDepense = (index) => {
        const updatedDepenses = depenses.filter((_, i) => i !== index);
        setDepenses(updatedDepenses);
        onUpdate({ ...campagne, depenses_reelles: updatedDepenses });
    };

    return (
        <div className='bg-gray-200 p-4'>
            <div className="bg-white rounded-lg shadow-md p-6">
                {/* Header */}
                <div className="flex items-center gap-4 pb-6 border-b mb-6">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowBack />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Budget - {campagne.nom}</h2>
                        <p className="text-gray-500">Suivi des dépenses</p>
                    </div>
                </div>

                {/* Résumé budget */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-600 mb-1">Budget alloué</p>
                        <p className="text-2xl font-bold text-blue-600">{campagne.budgetAlloue.toLocaleString()} FCFA</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                        <p className="text-sm text-orange-600 mb-1">Dépensé</p>
                        <p className="text-2xl font-bold text-orange-600">{totalDepenses.toLocaleString()} FCFA</p>
                    </div>
                    <div className={`${budgetRestant >= 0 ? 'bg-green-50' : 'bg-red-50'} rounded-lg p-4`}>
                        <p className={`text-sm ${budgetRestant >= 0 ? 'text-green-600' : 'text-red-600'} mb-1`}>Restant</p>
                        <p className={`text-2xl font-bold ${budgetRestant >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {budgetRestant.toLocaleString()} FCFA
                            {budgetRestant < 0 && ' (dépassement)'}
                        </p>
                    </div>
                </div>

                {/* Barre de progression */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Progression du budget</span>
                        <span className={`text-sm font-medium ${pourcentageUtilise > 100 ? 'text-red-600' : 'text-green-600'
                            }`}>
                            {pourcentageUtilise.toFixed(1)}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className={`rounded-full h-4 ${pourcentageUtilise > 100 ? 'bg-red-500' : 'bg-blue-500'
                                }`}
                            style={{ width: `${Math.min(pourcentageUtilise, 100)}%` }}
                        />
                    </div>
                </div>

                {/* Alertes */}
                {pourcentageUtilise > 80 && (
                    <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${pourcentageUtilise > 100 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                        {pourcentageUtilise > 100 ? (
                            <>
                                <Warning />
                                <span>Dépassement de budget ! Réduisez les dépenses ou augmentez le budget.</span>
                            </>
                        ) : (
                            <>
                                <TrendingUp />
                                <span>Attention : vous avez utilisé {pourcentageUtilise.toFixed(1)}% du budget.</span>
                            </>
                        )}
                    </div>
                )}

                {/* Liste des dépenses */}
                <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <Receipt className="text-blue-600" />
                    Dépenses détaillées
                </h3>

                <div className="space-y-3 mb-6">
                    {depenses.map((depense, index) => (
                        <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:shadow-md transition-shadow">
                            <div>
                                <p className="font-medium text-gray-800">{depense.poste}</p>
                                <p className="text-sm text-gray-500">{new Date(depense.date).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-bold text-red-500">{depense.montant.toLocaleString()} FCFA</span>
                                <button
                                    onClick={() => handleDeleteDepense(index)}
                                    className="text-red-500 hover:text-red-700">
                                    <Delete fontSize="small" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Formulaire d'ajout */}
                {isAdding ? (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-medium text-gray-700 mb-3">Nouvelle dépense</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
                            <input
                                type="text"
                                placeholder="Libellé"
                                value={newDepense.poste}
                                onChange={(e) => setNewDepense({ ...newDepense, poste: e.target.value })}
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
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsAdding(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100">
                                Annuler
                            </button>
                            <button
                                onClick={handleAddDepense}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                Ajouter
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
                        <Add /> Ajouter une dépense
                    </button>
                )}

                {/* Comparaison avec budget global */}
                {budgetGlobal && (
                    <div className="mt-6 pt-6 border-t">
                        <h4 className="font-medium text-gray-700 mb-3">Impact sur le budget global</h4>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Budget global du projet</span>
                            <span className="font-bold">{budgetGlobal.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-sm text-gray-600">Total campagnes</span>
                            <span className="font-bold">{campagne.cout.toLocaleString()} FCFA</span>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-sm">
                            <span className="text-gray-600">Reste pour autres campagnes</span>
                            <span className="font-bold text-green-600">
                                {(budgetGlobal - campagne.cout).toLocaleString()} FCFA
                            </span>
                        </div>
                    </div>
                )}
            </div>
       </div>
    );
};

export default CampaignBudget;