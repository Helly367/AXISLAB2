import React, { useState, useEffect } from 'react';
import {
    AttachMoney,
    Savings,
    Business,
    Timeline,
    PieChart,
    Edit,
    Save,
    Warning,
    CheckCircle,
    Refresh
} from "@mui/icons-material";
import ModalConfigBudget from './ModalConfigBudget';
import PhaseBudgetDetail from './PhaseBudgetDetail';

const BudgetManager = ({ phases, onUpdateBudget }) => {
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [budgetConfig, setBudgetConfig] = useState({
        type: 'interne', // 'interne' ou 'investissement'
        montantTotal: 0,
        devise: 'EUR',
        repartition: {}, // { phaseId: montant }
        depenses: [], // Historique des dépenses
        reserve: 0 // Réserve pour imprévus (5-10%)
    });

    const [selectedPhase, setSelectedPhase] = useState(null);
    const [showPhaseDetail, setShowPhaseDetail] = useState(false);

    // Calculs automatiques
    const calculateStats = () => {
        const totalBudget = budgetConfig.montantTotal;
        const totalDepenses = budgetConfig.depenses.reduce((acc, d) => acc + d.montant, 0);
        const reserveUtilisee = budgetConfig.depenses
            .filter(d => d.type === 'reserve')
            .reduce((acc, d) => acc + d.montant, 0);

        return {
            totalBudget,
            totalDepenses,
            reserveUtilisee,
            reste: totalBudget - totalDepenses,
            reserveRestante: budgetConfig.reserve - reserveUtilisee,
            pourcentageUtilise: totalBudget > 0 ? (totalDepenses / totalBudget) * 100 : 0
        };
    };

    const stats = calculateStats();

    // Répartition automatique si non configurée
    useEffect(() => {
        if (Object.keys(budgetConfig.repartition).length === 0 && phases.length > 0) {
            // Répartition égale par défaut
            const montantParPhase = budgetConfig.montantTotal / phases.length;
            const repartition = {};
            phases.forEach(phase => {
                repartition[phase.id] = Math.round(montantParPhase * 100) / 100;
            });
            setBudgetConfig(prev => ({
                ...prev,
                repartition
            }));
        }
    }, [phases, budgetConfig.montantTotal]);

    const handleConfigSave = (newConfig) => {
        setBudgetConfig(newConfig);
        if (onUpdateBudget) {
            onUpdateBudget(newConfig);
        }
    };

    const handleViewPhaseBudget = (phase) => {
        setSelectedPhase(phase);
        setShowPhaseDetail(true);
    };

    const handleBackFromPhase = () => {
        setShowPhaseDetail(false);
        setSelectedPhase(null);
    };

    const formatMontant = (montant) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: budgetConfig.devise,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(montant);
    };

    // Obtenir la couleur selon le type de projet
    const getTypeInfo = () => {
        if (budgetConfig.type === 'investissement') {
            return {
                label: 'Projet d\'investissement',
                icon: <Business className="text-purple-600" />,
                color: 'purple',
                bg: 'bg-purple-100',
                text: 'text-purple-800'
            };
        } else {
            return {
                label: 'Fonds propres / Interne',
                icon: <Savings className="text-green-600" />,
                color: 'green',
                bg: 'bg-green-100',
                text: 'text-green-800'
            };
        }
    };

    const typeInfo = getTypeInfo();

    return (
        <div className="w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-md p-6 flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                    <AttachMoney className="text-white text-3xl" />
                    <h1 className="text-2xl text-white font-bold">Gestion du budget</h1>
                </div>
                <button
                    onClick={() => setIsConfigModalOpen(true)}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md">
                    <Edit /> Configurer le budget
                </button>
            </div>

            {showPhaseDetail && selectedPhase ? (
                <PhaseBudgetDetail
                    phase={selectedPhase}
                    budgetConfig={budgetConfig}
                    onBack={handleBackFromPhase}
                    onUpdateBudget={setBudgetConfig}
                    formatMontant={formatMontant}
                />
            ) : (
                <>
                    {/* Résumé du budget */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {/* Carte type de projet */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-center gap-3 mb-4">
                                {typeInfo.icon}
                                <h3 className="font-semibold text-gray-700">Type de projet</h3>
                            </div>
                            <span className={`${typeInfo.bg} ${typeInfo.text} px-3 py-1 rounded-full text-sm font-medium`}>
                                {typeInfo.label}
                            </span>
                        </div>

                        {/* Carte budget total */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="font-semibold text-gray-700 mb-2">Budget total</h3>
                            <p className="text-3xl font-bold text-blue-600">
                                {formatMontant(budgetConfig.montantTotal)}
                            </p>
                            {budgetConfig.reserve > 0 && (
                                <p className="text-sm text-gray-500 mt-2">
                                    Réserve: {formatMontant(budgetConfig.reserve)} (5%)
                                </p>
                            )}
                        </div>

                        {/* Carte dépenses */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="font-semibold text-gray-700 mb-2">Dépensé</h3>
                            <p className="text-3xl font-bold text-orange-500">
                                {formatMontant(stats.totalDepenses)}
                            </p>
                            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                                <div
                                    className="bg-orange-500 rounded-full h-2"
                                    style={{ width: `${Math.min(stats.pourcentageUtilise, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                                {stats.pourcentageUtilise.toFixed(1)}% utilisé
                            </p>
                        </div>

                        {/* Carte reste */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="font-semibold text-gray-700 mb-2">Reste à dépenser</h3>
                            <p className="text-3xl font-bold text-green-500">
                                {formatMontant(stats.reste)}
                            </p>
                            {stats.reste < 0 && (
                                <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                                    <Warning fontSize="small" /> Dépassement de budget
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Répartition par phase */}
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <Timeline className="text-blue-600" />
                                Répartition par phase
                            </h2>
                            <button
                                onClick={() => setIsConfigModalOpen(true)}
                                className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                                <Refresh fontSize="small" /> Ajuster
                            </button>
                        </div>

                        <div className="space-y-4">
                            {phases.map((phase) => {
                                const budgetPhase = budgetConfig.repartition[phase.id] || 0;
                                const depensesPhase = budgetConfig.depenses
                                    .filter(d => d.phaseId === phase.id)
                                    .reduce((acc, d) => acc + d.montant, 0);
                                const pourcentagePhase = budgetPhase > 0 ? (depensesPhase / budgetPhase) * 100 : 0;
                                const statut = pourcentagePhase >= 100 ? 'danger' : pourcentagePhase >= 75 ? 'warning' : 'success';

                                return (
                                    <div key={phase.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <h3 className="font-bold text-gray-800">{phase.title}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {phase.taches?.length || 0} tâches • {phase.membres?.length || 0} membres
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-blue-600">{formatMontant(budgetPhase)}</p>
                                                <p className="text-sm text-gray-500">
                                                    Dépensé: {formatMontant(depensesPhase)}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Barre de progression */}
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                            <div
                                                className={`rounded-full h-2 ${statut === 'danger' ? 'bg-red-500' :
                                                    statut === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                                                    }`}
                                                style={{ width: `${Math.min(pourcentagePhase, 100)}%` }}
                                            ></div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <span className={`text-xs font-medium ${statut === 'danger' ? 'text-red-600' :
                                                statut === 'warning' ? 'text-orange-600' : 'text-green-600'
                                                }`}>
                                                {pourcentagePhase.toFixed(1)}% utilisé
                                            </span>
                                            <button
                                                onClick={() => handleViewPhaseBudget(phase)}
                                                className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                                Voir détails
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Dernières dépenses */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
                            <PieChart className="text-blue-600" />
                            Dernières dépenses
                        </h2>

                        {budgetConfig.depenses.length > 0 ? (
                            <div className="space-y-3">
                                {budgetConfig.depenses.slice(-5).reverse().map((depense, index) => {
                                    const phase = phases.find(p => p.id === depense.phaseId);
                                    return (
                                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-800">{depense.libelle}</p>
                                                <p className="text-sm text-gray-500">
                                                    {phase?.title || 'Général'} • {new Date(depense.date).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-red-500">{formatMontant(depense.montant)}</p>
                                                {depense.type === 'reserve' && (
                                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                                        Réserve
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <AttachMoney className="text-gray-400 text-5xl mx-auto mb-3" />
                                <p className="text-gray-500">Aucune dépense enregistrée</p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {/* Modal de configuration */}
            <ModalConfigBudget
                isOpen={isConfigModalOpen}
                onClose={() => setIsConfigModalOpen(false)}
                onSave={handleConfigSave}
                phases={phases}
                currentConfig={budgetConfig}
            />
        </div>
    );
};

export default BudgetManager;