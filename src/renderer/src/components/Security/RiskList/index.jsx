import React, { useState } from 'react';
import {
    Warning,
    Add,
    Edit,
    Delete,
    PriorityHigh,
    TrendingUp,
    CheckCircle,
    Block,
    Info,
    Assignment,
    Timeline,
    Flag
} from "@mui/icons-material";
import ModalAddRisk from '../ModalAddRisk';
import ModalEditRisk from '../ModalEditRisk';
import RiskMatrix from '../RiskMatrix';
import RiskDetails from '../RiskDetails';

const RiskList = ({ onUpdateRisks }) => {
    const [risks, setRisks] = useState([
        {
            id: 1,
            nom: "Retard de livraison des équipements",
            description: "Les équipements critiques pour le projet pourraient être livrés en retard par les fournisseurs",
            categorie: "technique",
            probabilite: 0.7, // 70%
            impact: 0.8, // 80%
            niveau: "critique", // calculé: probabilite * impact
            plan_mitigation: "Commander les équipements 2 mois à l'avance et prévoir des fournisseurs de secours",
            plan_contingence: "Louer des équipements en attendant la livraison",
            responsable: "Helly Djuma",
            date_identification: "2026-01-15",
            date_revision: "2026-02-15",
            statut: "actif",
            commentaires: "Le fournisseur principal a déjà eu des retards par le passé",
            actions: [
                { id: 1, description: "Contacter le fournisseur chaque semaine", completed: true },
                { id: 2, description: "Identifier 2 fournisseurs alternatifs", completed: false },
                { id: 3, description: "Négocier des pénalités de retard", completed: false }
            ]
        },
        {
            id: 2,
            nom: "Dépassement du budget",
            description: "Les coûts réels pourraient dépasser le budget alloué",
            categorie: "financier",
            probabilite: 0.5,
            impact: 0.9,
            niveau: "élevé",
            plan_mitigation: "Suivi hebdomadaire du budget et validation des dépenses importantes",
            plan_contingence: "Utiliser la réserve pour imprévus et chercher des financements additionnels",
            responsable: "Ephraim Winter",
            date_identification: "2026-01-10",
            date_revision: "2026-02-10",
            statut: "actif",
            commentaires: "Les devis reçus sont 15% plus élevés que prévu",
            actions: [
                { id: 1, description: "Réviser tous les devis", completed: true },
                { id: 2, description: "Négocier avec les fournisseurs", completed: true }
            ]
        },
        {
            id: 3,
            nom: "Disponibilité des ressources humaines",
            description: "Certains membres clés de l'équipe pourraient ne pas être disponibles",
            categorie: "ressources",
            probabilite: 0.3,
            impact: 0.7,
            niveau: "moyen",
            plan_mitigation: "Former des binômes et documenter les connaissances",
            plan_contingence: "Faire appel à des consultants externes",
            responsable: "Kenny Mougou",
            date_identification: "2026-01-20",
            date_revision: "2026-02-20",
            statut: "en_traitement",
            commentaires: "Deux membres ont posé des congés en même période",
            actions: [
                { id: 1, description: "Planifier les congés à l'avance", completed: true },
                { id: 2, description: "Identifier des ressources externes", completed: false }
            ]
        },
        {
            id: 4,
            nom: "Problèmes techniques avec la plateforme",
            description: "Des bugs critiques pourraient bloquer le déploiement",
            categorie: "technique",
            probabilite: 0.4,
            impact: 0.6,
            niveau: "moyen",
            plan_mitigation: "Tests intensifs et revue de code systématique",
            plan_contingence: "Prévoir un hotfix et un rollback possible",
            responsable: "Sam Rosie",
            date_identification: "2026-02-01",
            date_revision: "2026-02-15",
            statut: "resolu",
            commentaires: "Les tests en cours n'ont pas révélé de problème majeur",
            actions: [
                { id: 1, description: "Mettre en place des tests automatisés", completed: true },
                { id: 2, description: "Faire une revue de code", completed: true }
            ]
        },
        {
            id: 5,
            nom: "Retard dans les validations client",
            description: "Les clients pourraient prendre du retard dans leurs validations",
            categorie: "externe",
            probabilite: 0.6,
            impact: 0.5,
            niveau: "moyen",
            plan_mitigation: "Planifier des réunions de validation régulières",
            plan_contingence: "Démarrer les phases suivantes avec des hypothèses",
            responsable: "Benny Woubi",
            date_identification: "2026-01-25",
            date_revision: "2026-02-25",
            statut: "ignore",
            commentaires: "Le client est généralement réactif",
            actions: []
        }
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [riskToEdit, setRiskToEdit] = useState(null);
    const [selectedRisk, setSelectedRisk] = useState(null);
    const [filter, setFilter] = useState('all');
    const [filterCategorie, setFilterCategorie] = useState('all');
    const [viewMode, setViewMode] = useState('list'); // 'list', 'matrix', 'details'

    // Statistiques des risques
    const stats = {
        total: risks.length,
        actif: risks.filter(r => r.statut === 'actif').length,
        en_traitement: risks.filter(r => r.statut === 'en_traitement').length,
        resolu: risks.filter(r => r.statut === 'resolu').length,
        ignore: risks.filter(r => r.statut === 'ignore').length,
        critique: risks.filter(r => {
            const niveau = r.probabilite * r.impact;
            return niveau >= 0.5;
        }).length,
        parCategorie: {
            technique: risks.filter(r => r.categorie === 'technique').length,
            financier: risks.filter(r => r.categorie === 'financier').length,
            ressources: risks.filter(r => r.categorie === 'ressources').length,
            externe: risks.filter(r => r.categorie === 'externe').length
        }
    };

    const handleAddRisk = (newRisk) => {
        const riskWithId = {
            ...newRisk,
            id: Date.now(),
            niveau: calculateRiskLevel(newRisk.probabilite, newRisk.impact),
            actions: []
        };
        const updatedRisks = [...risks, riskWithId];
        setRisks(updatedRisks);
        if (onUpdateRisks) {
            onUpdateRisks(updatedRisks);
        }
    };

    const handleEditRisk = (updatedRisk) => {
        const updatedRisks = risks.map(r =>
            r.id === updatedRisk.id ? {
                ...updatedRisk,
                niveau: calculateRiskLevel(updatedRisk.probabilite, updatedRisk.impact)
            } : r
        );
        setRisks(updatedRisks);
        if (onUpdateRisks) {
            onUpdateRisks(updatedRisks);
        }
    };

    const handleDeleteRisk = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce risque ?')) {
            const updatedRisks = risks.filter(r => r.id !== id);
            setRisks(updatedRisks);
            if (onUpdateRisks) {
                onUpdateRisks(updatedRisks);
            }
        }
    };

    const handleViewRiskDetails = (risk) => {
        setSelectedRisk(risk);
        setIsDetailsModalOpen(true);
    };

    const handleOpenEditModal = (risk) => {
        setRiskToEdit(risk);
        setIsEditModalOpen(true);
    };

    const calculateRiskLevel = (probabilite, impact) => {
        const score = probabilite * impact;
        if (score >= 0.7) return "critique";
        if (score >= 0.4) return "élevé";
        if (score >= 0.2) return "moyen";
        return "faible";
    };

    const getStatusInfo = (statut) => {
        switch (statut) {
            case 'actif':
                return {
                    color: 'bg-red-100 text-red-800',
                    icon: <Warning className="text-red-600" />,
                    label: 'Actif'
                };
            case 'en_traitement':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: <Assignment className="text-yellow-600" />,
                    label: 'En traitement'
                };
            case 'resolu':
                return {
                    color: 'bg-green-100 text-green-800',
                    icon: <CheckCircle className="text-green-600" />,
                    label: 'Résolu'
                };
            case 'ignore':
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: <Block className="text-gray-600" />,
                    label: 'Ignoré'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: <Info className="text-gray-600" />,
                    label: statut
                };
        }
    };

    const getRiskLevelInfo = (niveau) => {
        switch (niveau) {
            case 'critique':
                return {
                    color: 'bg-red-600 text-white',
                    label: 'Critique'
                };
            case 'élevé':
                return {
                    color: 'bg-orange-500 text-white',
                    label: 'Élevé'
                };
            case 'moyen':
                return {
                    color: 'bg-yellow-500 text-white',
                    label: 'Moyen'
                };
            case 'faible':
                return {
                    color: 'bg-green-500 text-white',
                    label: 'Faible'
                };
            default:
                return {
                    color: 'bg-gray-500 text-white',
                    label: niveau
                };
        }
    };

    const getCategorieIcon = (categorie) => {
        switch (categorie) {
            case 'technique':
                return <span className="text-blue-600">🔧</span>;
            case 'financier':
                return <span className="text-green-600">💰</span>;
            case 'ressources':
                return <span className="text-purple-600">👥</span>;
            case 'externe':
                return <span className="text-orange-600">🌍</span>;
            default:
                return <span className="text-gray-600">📋</span>;
        }
    };

    // Filtrer les risques
    const filteredRisks = risks.filter(risk => {
        if (filter !== 'all' && risk.statut !== filter) return false;
        if (filterCategorie !== 'all' && risk.categorie !== filterCategorie) return false;
        return true;
    });

    // Trier par niveau de risque (critique en premier)
    const sortedRisks = [...filteredRisks].sort((a, b) => {
        const scoreA = a.probabilite * a.impact;
        const scoreB = b.probabilite * b.impact;
        return scoreB - scoreA;
    });

    return (
        <div className="w-full bg-gray-200 p-4">
            {/* Header */}
            <div className="bg-primary rounded-lg shadow-md p-4 flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <Warning className="text-white text-3xl" />
                    <h1 className="text-xl text-white font-bold">Gestion des Risques</h1>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-white text-red-600 px-6 py-2 rounded-lg font-semibold hover:bg-red-50 transition-all flex items-center gap-2 shadow-md">
                    <Add /> Identifier un risque
                </button>
            </div>

            {/* Navigation des vues */}
            <div className="bg-white rounded-lg shadow-md p-2 mb-4 flex gap-2">
                <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                    <Warning fontSize="small" />
                    Liste des risques
                </button>
                <button
                    onClick={() => setViewMode('matrix')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${viewMode === 'matrix' ? 'bg-red-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                    <Timeline fontSize="small" />
                    Matrice d'impact
                </button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Total risques</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-red-50 rounded-lg shadow-md p-4">
                    <p className="text-sm text-red-600">Actifs</p>
                    <p className="text-2xl font-bold text-red-600">{stats.actif}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg shadow-md p-4">
                    <p className="text-sm text-yellow-600">En traitement</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.en_traitement}</p>
                </div>
                <div className="bg-green-50 rounded-lg shadow-md p-4">
                    <p className="text-sm text-green-600">Résolus</p>
                    <p className="text-2xl font-bold text-green-600">{stats.resolu}</p>
                </div>
                <div className="bg-gray-50 rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Ignorés</p>
                    <p className="text-2xl font-bold text-gray-600">{stats.ignore}</p>
                </div>
                <div className="bg-purple-50 rounded-lg shadow-md p-4">
                    <p className="text-sm text-purple-600">Critiques</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.critique}</p>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-4">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                    <option value="all">Tous les statuts</option>
                    <option value="actif">Actifs</option>
                    <option value="en_traitement">En traitement</option>
                    <option value="resolu">Résolus</option>
                    <option value="ignore">Ignorés</option>
                </select>

                <select
                    value={filterCategorie}
                    onChange={(e) => setFilterCategorie(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
                    <option value="all">Toutes catégories</option>
                    <option value="technique">Technique</option>
                    <option value="financier">Financier</option>
                    <option value="ressources">Ressources</option>
                    <option value="externe">Externe</option>
                </select>
            </div>

            {/* Contenu selon la vue */}
            {viewMode === 'list' && (
                <div className="space-y-4">
                    {sortedRisks.map((risk) => {
                        const statusInfo = getStatusInfo(risk.statut);
                        const levelInfo = getRiskLevelInfo(risk.niveau);
                        const score = (risk.probabilite * risk.impact * 100).toFixed(0);

                        return (
                            <div
                                key={risk.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 relative group m-4">

                                {/* Boutons d'action */}
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleViewRiskDetails(risk)}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                                        title="Voir détails">
                                        <Info fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenEditModal(risk)}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                                        <Edit fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRisk(risk.id)}
                                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                                        <Delete fontSize="small" />
                                    </button>
                                </div>

                                {/* En-tête */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${levelInfo.color}`}>
                                        {levelInfo.label}
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                                        {statusInfo.icon}
                                        {statusInfo.label}
                                    </div>
                                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                                        {getCategorieIcon(risk.categorie)}
                                        <span className="capitalize">{risk.categorie}</span>
                                    </div>
                                </div>

                                {/* Titre et description */}
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{risk.nom}</h3>
                                <p className="text-gray-600 mb-4">{risk.description}</p>

                                {/* Probabilité et impact */}
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-600">Probabilité</span>
                                            <span className="text-sm font-bold">{(risk.probabilite * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 rounded-full h-2"
                                                style={{ width: `${risk.probabilite * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-sm text-gray-600">Impact</span>
                                            <span className="text-sm font-bold">{(risk.impact * 100).toFixed(0)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-orange-500 rounded-full h-2"
                                                style={{ width: `${risk.impact * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Score de risque */}
                                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium text-gray-700">Niveau de risque</span>
                                        <span className="text-lg font-bold text-red-600">{score}/100</span>
                                    </div>
                                </div>

                                {/* Plan de mitigation */}
                                <div className="mb-4">
                                    <h4 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                        <Assignment className="text-blue-600" fontSize="small" />
                                        Plan de mitigation
                                    </h4>
                                    <p className="text-gray-600 text-sm bg-blue-50 p-3 rounded-lg">
                                        {risk.plan_mitigation}
                                    </p>
                                </div>

                                {/* Responsable et dates */}
                                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">Responsable:</span>
                                        <span>{risk.responsable}</span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span>Identifié: {new Date(risk.date_identification).toLocaleDateString('fr-FR')}</span>
                                        <span>Révision: {new Date(risk.date_revision).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                </div>

                                {/* Actions en cours */}
                                {risk.actions && risk.actions.length > 0 && (
                                    <div className="mt-4 pt-4 border-t">
                                        <h4 className="text-sm font-medium text-gray-700 mb-2">Actions ({risk.actions.filter(a => a.completed).length}/{risk.actions.length})</h4>
                                        <div className="flex gap-2">
                                            {risk.actions.map((action, index) => (
                                                <span
                                                    key={index}
                                                    className={`text-xs px-2 py-1 rounded-full ${action.completed ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                    {action.completed ? '✓' : '○'} {action.description.substring(0, 30)}...
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {viewMode === 'matrix' && (
                <RiskMatrix risks={risks} />
            )}

            {/* Modals */}
            <ModalAddRisk
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddRisk}
            />

            <ModalEditRisk
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setRiskToEdit(null);
                }}
                onSave={handleEditRisk}
                riskToEdit={riskToEdit}
            />

            <RiskDetails
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedRisk(null);
                }}
                risk={selectedRisk}
                onUpdate={handleEditRisk}
            />
        </div>
    );
};

export default RiskList;