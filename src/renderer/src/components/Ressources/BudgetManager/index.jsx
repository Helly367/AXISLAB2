import React, { useState, useEffect } from 'react';
import {
    AttachMoney,
    Savings,
    Business,
    Timeline,
    PieChart,
    Edit,
    Warning,
    CheckCircle,
    Refresh,
    Receipt,
    WarningAmber,
    CurrencyExchange,
    Description
} from "@mui/icons-material";
import ModalConfigBudget from '../ModalConfigBudget';
import PhaseBudgetDetail from '../PhaseBudgetDetail';
import ExpensesTracker from '../ExpensesTracker';
import CurrencyConverter from '../CurrencyConverter';
import JustificatifsList from '../JustificatifsList';

const BudgetManager = ({ phases, onUpdateBudget }) => {
    const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
    const [budgetConfig, setBudgetConfig] = useState({
        type: 'interne',
        montantTotal: 0,
        devise: 'USD',
        deviseOrigine: 'USD',
        tauxConversion: 1,
        repartition: {},
        depenses: [],
        reserve: 0,
        alertes: {
            seuilAlerte: 80, // Alerte à 80% du budget
            notifications: true
        }
    });

    const [selectedPhase, setSelectedPhase] = useState(null);
    const [showPhaseDetail, setShowPhaseDetail] = useState(false);
    const [activeTab, setActiveTab] = useState('apercu'); // 'apercu', 'depenses', 'justificatifs', 'conversion'
    const [alerteActive, setAlerteActive] = useState(false);

    // Calculs avancés
    const calculateStats = () => {
        const totalBudget = budgetConfig.montantTotal;

        // Dépenses par phase
        const depensesParPhase = {};
        phases.forEach(phase => {
            depensesParPhase[phase.id] = budgetConfig.depenses
                .filter(d => d.phaseId === phase.id)
                .reduce((acc, d) => acc + d.montant, 0);
        });

        const totalDepenses = Object.values(depensesParPhase).reduce((a, b) => a + b, 0);
        const reserveUtilisee = budgetConfig.depenses
            .filter(d => d.type === 'reserve')
            .reduce((acc, d) => acc + d.montant, 0);

        // Budget par phase (prévu vs réel)
        const ecartsParPhase = {};
        phases.forEach(phase => {
            const prevu = budgetConfig.repartition[phase.id] || 0;
            const reel = depensesParPhase[phase.id] || 0;
            ecartsParPhase[phase.id] = {
                prevu,
                reel,
                ecart: reel - prevu,
                pourcentageEcart: prevu > 0 ? ((reel - prevu) / prevu) * 100 : 0
            };
        });

        // Détection des alertes
        const nouvellesAlertes = [];
        if (totalBudget > 0 && (totalDepenses / totalBudget) * 100 >= budgetConfig.alertes.seuilAlerte) {
            nouvellesAlertes.push({
                type: 'seuil',
                message: `Vous avez atteint ${((totalDepenses / totalBudget) * 100).toFixed(1)}% du budget total`
            });
        }

        phases.forEach(phase => {
            const ecart = ecartsParPhase[phase.id];
            if (ecart.reel > ecart.prevu) {
                nouvellesAlertes.push({
                    type: 'depassement',
                    phase: phase.title,
                    message: `Dépassement de budget sur ${phase.title} : ${formatMontant(ecart.ecart)}`
                });
            }
        });

        if (nouvellesAlertes.length > 0) {
            setAlerteActive(true);
        }

        return {
            totalBudget,
            totalDepenses,
            reserveUtilisee,
            reste: totalBudget - totalDepenses,
            reserveRestante: budgetConfig.reserve - reserveUtilisee,
            pourcentageUtilise: totalBudget > 0 ? (totalDepenses / totalBudget) * 100 : 0,
            depensesParPhase,
            ecartsParPhase,
            alertes: nouvellesAlertes
        };
    };

    const stats = calculateStats();

    // Effet pour les alertes
    useEffect(() => {
        if (stats.alertes.length > 0 && budgetConfig.alertes.notifications) {
            // Afficher une notification
            const alertesMessage = stats.alertes.map(a => a.message).join('\n');
            alert(`⚠️ Alertes budget :\n${alertesMessage}`);
        }
    }, [stats.alertes]);

    // Répartition automatique
    useEffect(() => {
        if (Object.keys(budgetConfig.repartition).length === 0 && phases.length > 0 && budgetConfig.montantTotal > 0) {
            const montantNet = budgetConfig.montantTotal - budgetConfig.reserve;
            const montantParPhase = montantNet / phases.length;
            const repartition = {};
            phases.forEach(phase => {
                repartition[phase.id] = Math.round(montantParPhase * 100) / 100;
            });
            setBudgetConfig(prev => ({
                ...prev,
                repartition
            }));
        }
    }, [phases, budgetConfig.montantTotal, budgetConfig.reserve]);

    const handleConfigSave = (newConfig) => {
        setBudgetConfig(newConfig);
        if (onUpdateBudget) {
            onUpdateBudget(newConfig);
        }
    };

    const handleAddDepense = (depense) => {
        const nouvelleDepense = {
            ...depense,
            id: Date.now(),
            date: depense.date || new Date().toISOString().split('T')[0],
            justificatifs: []
        };

        setBudgetConfig(prev => ({
            ...prev,
            depenses: [...prev.depenses, nouvelleDepense]
        }));
    };

    const handleAddJustificatif = (depenseId, justificatif) => {
        setBudgetConfig(prev => ({
            ...prev,
            depenses: prev.depenses.map(d =>
                d.id === depenseId
                    ? { ...d, justificatifs: [...(d.justificatifs || []), justificatif] }
                    : d
            )
        }));
    };

    const handleConversionDevise = (nouvelleDevise, taux) => {
        setBudgetConfig(prev => ({
            ...prev,
            devise: nouvelleDevise,
            montantTotal: prev.montantTotal * taux,
            reserve: prev.reserve * taux,
            repartition: Object.fromEntries(
                Object.entries(prev.repartition).map(([key, value]) => [key, value * taux])
            ),
            depenses: prev.depenses.map(d => ({
                ...d,
                montant: d.montant * taux
            }))
        }));
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

    const getTypeInfo = () => {
        if (budgetConfig.type === 'investissement') {
            return {
                label: "Projet d'investissement",
                icon: <Business className="text-purple-600" />,
                color: 'purple',
                bg: 'bg-purple-100',
                text: 'text-purple-800'
            };
        } else {
            return {
                label: 'Fonds propres',
                icon: <Savings className="text-green-600" />,
                color: 'green',
                bg: 'bg-green-100',
                text: 'text-green-800'
            };
        }
    };

    const typeInfo = getTypeInfo();

    return (
        <div className="w-full p-4 bg-gray-200">
            {/* Header */}
            <div className="bg-primary rounded-lg shadow-md p-4 flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl text-white font-bold">Gestion du budget</h1>
                </div>
                <div className="flex gap-3">
                    {/* Alerte globale */}
                    {alerteActive && (
                        <div className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                            <WarningAmber fontSize="small" />
                            <span>Alertes actives</span>
                        </div>
                    )}
                    <button
                        onClick={() => setIsConfigModalOpen(true)}
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md">
                        <Edit /> Configurer
                    </button>
                </div>
            </div>

            {/* Navigation des onglets */}
            <div className="bg-white rounded-lg shadow-md p-2 mb-6 flex gap-2">
                <button
                    onClick={() => setActiveTab('apercu')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'apercu' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                    <PieChart fontSize="small" />
                    Aperçu
                </button>
                <button
                    onClick={() => setActiveTab('depenses')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'depenses' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                    <Receipt fontSize="small" />
                    Dépenses
                </button>
                <button
                    onClick={() => setActiveTab('justificatifs')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'justificatifs' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                    <Description fontSize="small" />
                    Justificatifs
                </button>
                <button
                    onClick={() => setActiveTab('conversion')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${activeTab === 'conversion' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                    <CurrencyExchange fontSize="small" />
                    Conversion
                </button>
            </div>

            {/* Contenu selon l'onglet */}
            {showPhaseDetail && selectedPhase ? (
                <PhaseBudgetDetail
                    phase={selectedPhase}
                    budgetConfig={budgetConfig}
                    onBack={handleBackFromPhase}
                    onUpdateBudget={setBudgetConfig}
                    onAddDepense={handleAddDepense}
                    formatMontant={formatMontant}
                />
            ) : (
                <>
                    {activeTab === 'apercu' && (
                        <>
                            {/* Résumé du budget */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 ">
                                {/* Carte type de projet */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        {typeInfo.icon}
                                        <h3 className="font-semibold text-gray-700">Type</h3>
                                    </div>
                                    <span className={`${typeInfo.bg} ${typeInfo.text} px-3 py-1 rounded-full text-sm font-medium`}>
                                        {typeInfo.label}
                                    </span>
                                </div>

                                {/* Carte budget total */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="font-semibold text-gray-700 mb-2">Budget total</h3>
                                    <p className="text-3xl font-bold text-primary ">
                                        {formatMontant(budgetConfig.montantTotal)}
                                    </p>
                                    {budgetConfig.reserve > 0 && (
                                        <p className="text-sm text-gray-500 mt-2">
                                            Réserve: {formatMontant(budgetConfig.reserve)}
                                        </p>
                                    )}
                                    {budgetConfig.devise !== budgetConfig.deviseOrigine && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Converti depuis {budgetConfig.deviseOrigine}
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
                                            className={`rounded-full h-2 ${stats.pourcentageUtilise >= 100 ? 'bg-red-500' :
                                                stats.pourcentageUtilise >= budgetConfig.alertes.seuilAlerte ? 'bg-orange-500' : 'bg-green-500'
                                                }`}
                                            style={{ width: `${Math.min(stats.pourcentageUtilise, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {stats.pourcentageUtilise.toFixed(1)}% utilisé
                                    </p>
                                </div>

                                {/* Carte reste */}
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="font-semibold text-gray-700 mb-2">Reste</h3>
                                    <p className={`text-3xl font-bold ${stats.reste >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {formatMontant(Math.abs(stats.reste))}
                                        {stats.reste < 0 && ' (dépassement)'}
                                    </p>
                                    {stats.reste < 0 && (
                                        <p className="text-sm text-red-500 flex items-center gap-1 mt-2">
                                            <Warning fontSize="small" /> Dépassement
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Alertes */}
                            {stats.alertes.length > 0 && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                                    <h3 className="font-medium text-red-800 mb-3 flex items-center gap-2">
                                        <WarningAmber className="text-red-600" />
                                        Alertes budget
                                    </h3>
                                    <div className="space-y-2">
                                        {stats.alertes.map((alerte, index) => (
                                            <div key={index} className="flex items-start gap-2 text-sm">
                                                <span className="text-red-600">•</span>
                                                <span className="text-red-700">{alerte.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Répartition par phase */}
                            <div className="bg-white rounded-lg shadow-md p-6 m-8">
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
                                        const depensesPhase = stats.depensesParPhase[phase.id] || 0;
                                        const ecart = stats.ecartsParPhase[phase.id];
                                        const pourcentagePhase = budgetPhase > 0 ? (depensesPhase / budgetPhase) * 100 : 0;

                                        let statut = 'success';
                                        if (depensesPhase > budgetPhase) statut = 'danger';
                                        else if (pourcentagePhase >= 75) statut = 'warning';

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
                                                        {ecart && ecart.ecart !== 0 && (
                                                            <p className={`text-xs font-medium ${ecart.ecart > 0 ? 'text-red-500' : 'text-green-500'
                                                                }`}>
                                                                {ecart.ecart > 0 ? '+' : ''}{formatMontant(ecart.ecart)}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Barre de progression */}
                                                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                                                    <div
                                                        className={`rounded-full h-2 ${statut === 'danger' ? 'bg-red-500' :
                                                            statut === 'warning' ? 'bg-orange-500' : 'bg-green-500'
                                                            }`}
                                                        style={{ width: `${Math.min(pourcentagePhase, 100)}%` }}
                                                    />
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
                        </>
                    )}

                    {activeTab === 'depenses' && (
                        <ExpensesTracker
                            budgetConfig={budgetConfig}
                            phases={phases}
                            onAddDepense={handleAddDepense}
                            formatMontant={formatMontant}
                        />
                    )}

                    {activeTab === 'justificatifs' && (
                        <JustificatifsList
                            budgetConfig={budgetConfig}
                            phases={phases}
                            onAddJustificatif={handleAddJustificatif}
                            formatMontant={formatMontant}
                        />
                    )}

                    {activeTab === 'conversion' && (
                        <CurrencyConverter
                            budgetConfig={budgetConfig}
                            onConvert={handleConversionDevise}
                            formatMontant={formatMontant}
                        />
                    )}
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