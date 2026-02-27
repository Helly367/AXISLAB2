import React, { useState } from 'react';
import {
    Campaign,
    Add,
    Edit,
    Delete,
    LocationOn,
    Category,
    AttachMoney,
    CalendarToday,
    PlayArrow,
    Pause,
    CheckCircle,
    Block,
    Info,
    Assessment,
    Schedule,

} from "@mui/icons-material";
import ModalAddCampagne from '../ModalAddCampagne';
import ModalEditCampagne from '../ModalEditCampagne';
import CampaignPlanning from '../CampaignPlanning';
import CampaignResults from '../CampaignResults';
import CampaignBudget from '../CampaignBudget';

const CampagneList = ({ onUpdateCampagnes, budgetGlobal }) => {
    const [campagnes, setCampagnes] = useState([
        {
            id: 1,
            nom: "Lancement produit InnovX",
            ville: "Douala",
            secteur: "Technologie",
            cout: 2500000,
            budgetAlloue: 2500000,
            date_debut: "2026-03-01",
            date_fin: "2026-04-15",
            date_debut_reelle: "2026-03-01",
            date_fin_reelle: null,
            status: "en_cours",
            description: "Campagne de lancement du nouveau produit InnovX sur le marché camerounais",
            objectif: "Atteindre 1000 ventes",
            responsable: "Helly Djuma",
            image: "",
            planification: {
                type: "continue", // continue, par_etapes
                etapes: [
                    { nom: "Pré-lancement", date_debut: "2026-03-01", date_fin: "2026-03-10", completed: true },
                    { nom: "Lancement officiel", date_debut: "2026-03-11", date_fin: "2026-03-20", completed: false },
                    { nom: "Promotion intensive", date_debut: "2026-03-21", date_fin: "2026-04-10", completed: false },
                    { nom: "Clôture", date_debut: "2026-04-11", date_fin: "2026-04-15", completed: false }
                ],
                canaux: ["Réseaux sociaux", "Radio", "Affichage", "Bouche à oreille"]
            },
            resultats: {
                objectifs_atteints: 35, // %
                ventes_generees: 350,
                leads_generees: 850,
                contacts_estimes: 25000,
                cout_par_lead: 2941, // Calculé
                retour_investissement: 0, // En attente de fin
                satisfaction: 4.2, // /5
                commentaires: "Bon démarrage, bon retour des clients"
            },
            depenses_reelles: [
                { poste: "Publicité radio", montant: 500000, date: "2026-03-05" },
                { poste: "Affichage", montant: 800000, date: "2026-03-01" },
                { poste: "Réseaux sociaux", montant: 300000, date: "2026-03-10" }
            ]
        },
        {
            id: 2,
            nom: "Sensibilisation environnement",
            ville: "Yaoundé",
            secteur: "Environnement",
            cout: 1500000,
            budgetAlloue: 1500000,
            date_debut: "2026-02-15",
            date_fin: "2026-03-30",
            date_debut_reelle: "2026-02-15",
            date_fin_reelle: "2026-03-28",
            status: "termine",
            description: "Campagne de sensibilisation à la protection de l'environnement",
            objectif: "Toucher 5000 personnes",
            responsable: "Ephraim Winter",
            image: "",
            planification: {
                type: "evenement",
                etapes: [
                    { nom: "Préparation", date_debut: "2026-02-15", date_fin: "2026-02-20", completed: true },
                    { nom: "Sensibilisation écoles", date_debut: "2026-02-21", date_fin: "2026-03-10", completed: true },
                    { nom: "Événement principal", date_debut: "2026-03-15", date_fin: "2026-03-15", completed: true },
                    { nom: "Suivi", date_debut: "2026-03-16", date_fin: "2026-03-30", completed: true }
                ],
                canaux: ["Écoles", "Mairies", "ONG", "Médias locaux"]
            },
            resultats: {
                objectifs_atteints: 120, // % (dépassé)
                personnes_touchees: 6250,
                engagements: 850,
                partenaires_impliques: 12,
                satisfaction: 4.8,
                commentaires: "Grand succès, à renouveler",
                photos: ["event1.jpg", "event2.jpg"]
            },
            depenses_reelles: [
                { poste: "Matériel pédagogique", montant: 450000, date: "2026-02-20" },
                { poste: "Location salle", montant: 600000, date: "2026-03-01" },
                { poste: "Communication", montant: 350000, date: "2026-02-25" },
                { poste: "Restauration", montant: 100000, date: "2026-03-15" }
            ]
        },
        {
            id: 3,
            nom: "Promotion back to school",
            ville: "Bafoussam",
            secteur: "Éducation",
            cout: 1800000,
            budgetAlloue: 1800000,
            date_debut: "2026-08-01",
            date_fin: "2026-09-15",
            date_debut_reelle: null,
            date_fin_reelle: null,
            status: "inactif",
            description: "Campagne promotionnelle pour la rentrée scolaire",
            objectif: "Vendre 500 kits scolaires",
            responsable: "Kenny Mougou",
            image: "",
            planification: {
                type: "saisonniere",
                etapes: [
                    { nom: "Préparation stocks", date_debut: "2026-07-01", date_fin: "2026-07-31", completed: false },
                    { nom: "Campagne pub", date_debut: "2026-08-01", date_fin: "2026-08-31", completed: false },
                    { nom: "Distribution", date_debut: "2026-08-15", date_fin: "2026-09-15", completed: false }
                ],
                canaux: ["Presse", "Radio", "Réseaux sociaux"]
            },
            resultats: {
                objectifs_atteints: 0,
                precommandes: 120,
                stocks_preparés: 300
            },
            depenses_reelles: [
                { poste: "Achat kits", montant: 1200000, date: "2026-07-15" }
            ]
        },
        {
            id: 4,
            nom: "Formation digitale",
            ville: "Garoua",
            secteur: "Formation",
            cout: 3000000,
            budgetAlloue: 3000000,
            date_debut: "2026-05-10",
            date_fin: "2026-06-20",
            date_debut_reelle: "2026-05-12",
            date_fin_reelle: null,
            status: "en_pause",
            description: "Campagne de formation au marketing digital",
            objectif: "Former 200 jeunes",
            responsable: "Benny Woubi",
            image: "",
            planification: {
                type: "formation",
                etapes: [
                    { nom: "Sélection candidats", date_debut: "2026-05-10", date_fin: "2026-05-20", completed: true },
                    { nom: "Module 1: Bases", date_debut: "2026-05-21", date_fin: "2026-05-30", completed: true },
                    { nom: "Module 2: Avancé", date_debut: "2026-06-01", date_fin: "2026-06-10", completed: false },
                    { nom: "Module 3: Projet", date_debut: "2026-06-11", date_fin: "2026-06-20", completed: false }
                ],
                formateurs: ["Expert 1", "Expert 2"],
                canaux: ["Présentiel", "E-learning"]
            },
            resultats: {
                objectifs_atteints: 45,
                inscrits: 150,
                presents: 125,
                attestations: 0,
                satisfaction: 4.5
            },
            depenses_reelles: [
                { poste: "Location salle", montant: 500000, date: "2026-05-01" },
                { poste: "Formateurs", montant: 1200000, date: "2026-05-15" },
                { poste: "Matériel", montant: 300000, date: "2026-05-10" }
            ]
        }
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [campagneToEdit, setCampagneToEdit] = useState(null);
    const [filter, setFilter] = useState('all');
    const [activeView, setActiveView] = useState('liste'); // 'liste', 'planning', 'resultats', 'budget'
    const [selectedCampagne, setSelectedCampagne] = useState(null);

    // Statistiques avancées
    const stats = {
        total: campagnes.length,
        en_cours: campagnes.filter(c => c.status === 'en_cours').length,
        termine: campagnes.filter(c => c.status === 'termine').length,
        inactif: campagnes.filter(c => c.status === 'inactif').length,
        en_pause: campagnes.filter(c => c.status === 'en_pause').length,
        totalCout: campagnes.reduce((acc, c) => acc + c.cout, 0),
        totalDepensesReelles: campagnes.reduce((acc, c) =>
            acc + (c.depenses_reelles?.reduce((sum, d) => sum + d.montant, 0) || 0), 0),
        coutMoyen: campagnes.length > 0
            ? campagnes.reduce((acc, c) => acc + c.cout, 0) / campagnes.length
            : 0,
        objectifsMoyens: campagnes.reduce((acc, c) =>
            acc + (c.resultats?.objectifs_atteints || 0), 0) / campagnes.length,
        budgetRestantGlobal: budgetGlobal - campagnes.reduce((acc, c) => acc + c.cout, 0)
    };

    const handleAddCampagne = (newCampagne) => {
        // Vérifier le budget global
        const totalCout = campagnes.reduce((acc, c) => acc + c.cout, 0) + newCampagne.cout;
        if (budgetGlobal && totalCout > budgetGlobal) {
            alert(`⚠️ Budget global insuffisant ! Il manque ${(totalCout - budgetGlobal).toLocaleString()} USD`);
            return;
        }

        const updatedCampagnes = [...campagnes, {
            ...newCampagne,
            id: Date.now(),
            depenses_reelles: [],
            resultats: {
                objectifs_atteints: 0,
                ...newCampagne.resultats
            }
        }];
        setCampagnes(updatedCampagnes);
        if (onUpdateCampagnes) {
            onUpdateCampagnes(updatedCampagnes);
        }
    };

    const handleEditCampagne = (updatedCampagne) => {
        const updatedCampagnes = campagnes.map(c =>
            c.id === updatedCampagne.id ? updatedCampagne : c
        );
        setCampagnes(updatedCampagnes);
        if (onUpdateCampagnes) {
            onUpdateCampagnes(updatedCampagnes);
        }
    };

    const handleDeleteCampagne = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) {
            const updatedCampagnes = campagnes.filter(c => c.id !== id);
            setCampagnes(updatedCampagnes);
            if (onUpdateCampagnes) {
                onUpdateCampagnes(updatedCampagnes);
            }
        }
    };

    const handleOpenEditModal = (campagne) => {
        setCampagneToEdit(campagne);
        setIsEditModalOpen(true);
    };

    const handleViewCampagne = (campagne, view) => {
        setSelectedCampagne(campagne);
        setActiveView(view);
    };

    const handleBack = () => {
        setSelectedCampagne(null);
        setActiveView('liste');
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'en_cours':
                return {
                    color: 'bg-green-100 text-green-800',
                    icon: <PlayArrow className="text-green-600" fontSize="small" />,
                    label: 'En cours'
                };
            case 'termine':
                return {
                    color: 'bg-blue-100 text-blue-800',
                    icon: <CheckCircle className="text-blue-600" fontSize="small" />,
                    label: 'Terminé'
                };
            case 'inactif':
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: <Block className="text-gray-600" fontSize="small" />,
                    label: 'Inactif'
                };
            case 'en_pause':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: <Pause className="text-yellow-600" fontSize="small" />,
                    label: 'En pause'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: <Info className="text-gray-600" fontSize="small" />,
                    label: status
                };
        }
    };

    const getProgressionColor = (progression) => {
        if (progression >= 75) return 'text-green-600';
        if (progression >= 50) return 'text-yellow-600';
        if (progression >= 25) return 'text-orange-600';
        return 'text-red-600';
    };

    // Filtrer les campagnes
    const campagnesFiltrees = filter === 'all'
        ? campagnes
        : campagnes.filter(c => c.status === filter);

    // Si une campagne est sélectionnée pour une vue détaillée
    if (selectedCampagne) {
        switch (activeView) {
            case 'planning':
                return (
                    <CampaignPlanning
                        campagne={selectedCampagne}
                        onBack={handleBack}
                        onUpdate={handleEditCampagne}
                    />
                );
            case 'resultats':
                return (
                    <CampaignResults
                        campagne={selectedCampagne}
                        onBack={handleBack}
                        onUpdate={handleEditCampagne}
                    />
                );
            case 'budget':
                return (
                    <CampaignBudget
                        campagne={selectedCampagne}
                        onBack={handleBack}
                        onUpdate={handleEditCampagne}
                        budgetGlobal={budgetGlobal}
                    />
                );
            default:
                return null;
        }
    }

    return (
        <div className="w-full p-4">
            {/* Header */}
            <div className="bg-primary rounded-lg shadow-md p-4 flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl text-white font-bold">Campagnes du projet</h1>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md">
                    <Add /> Nouvelle campagne
                </button>
            </div>

            {/* Statistiques avancées */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Budget total</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalCout.toLocaleString()} USD</p>
                    <p className="text-xs text-gray-500 mt-1">
                        Dépensé: {stats.totalDepensesReelles.toLocaleString()} USD
                    </p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Coût moyen/campagne</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.coutMoyen.toLocaleString()} USD</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Objectifs atteints</p>
                    <p className="text-2xl font-bold text-green-600">{stats.objectifsMoyens.toFixed(1)}%</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Budget restant</p>
                    <p className={`text-2xl font-bold ${stats.budgetRestantGlobal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {stats.budgetRestantGlobal.toLocaleString()} USD
                    </p>
                </div>
            </div>

            {/* Résumé des statuts */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Total</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.total}</p>
                </div>
                <div className="bg-green-50 rounded-lg shadow-md p-4">
                    <p className="text-sm text-green-600">En cours</p>
                    <p className="text-2xl font-bold text-green-600">{stats.en_cours}</p>
                </div>
                <div className="bg-blue-50 rounded-lg shadow-md p-4">
                    <p className="text-sm text-blue-600">Terminées</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.termine}</p>
                </div>
                <div className="bg-yellow-50 rounded-lg shadow-md p-4">
                    <p className="text-sm text-yellow-600">En pause</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.en_pause}</p>
                </div>
                <div className="bg-gray-50 rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Inactives</p>
                    <p className="text-2xl font-bold text-gray-600">{stats.inactif}</p>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex flex-wrap gap-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}>
                    Toutes ({campagnes.length})
                </button>
                <button
                    onClick={() => setFilter('en_cours')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'en_cours'
                        ? 'bg-green-600 text-white'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}>
                    En cours ({stats.en_cours})
                </button>
                <button
                    onClick={() => setFilter('termine')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'termine'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}>
                    Terminées ({stats.termine})
                </button>
                <button
                    onClick={() => setFilter('en_pause')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'en_pause'
                        ? 'bg-yellow-600 text-white'
                        : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        }`}>
                    En pause ({stats.en_pause})
                </button>
                <button
                    onClick={() => setFilter('inactif')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'inactif'
                        ? 'bg-gray-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}>
                    Inactives ({stats.inactif})
                </button>
            </div>

            {/* Liste des campagnes */}
            {campagnesFiltrees.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {campagnesFiltrees.map((campagne) => {
                        const statusInfo = getStatusInfo(campagne.status);
                        const dateDebut = new Date(campagne.date_debut).toLocaleDateString('fr-FR');
                        const dateFin = new Date(campagne.date_fin).toLocaleDateString('fr-FR');
                        const totalDepense = campagne.depenses_reelles?.reduce((sum, d) => sum + d.montant, 0) || 0;
                        const budgetRestant = campagne.budgetAlloue - totalDepense;

                        return (
                            <div
                                key={campagne.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 relative group">

                                {/* Boutons d'action */}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleViewCampagne(campagne, 'planning')}
                                        className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
                                        title="Planification">
                                        <Schedule fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => handleViewCampagne(campagne, 'resultats')}
                                        className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                                        title="Résultats">
                                        <Assessment fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => handleViewCampagne(campagne, 'budget')}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                                        title="Budget">
                                        <AttachMoney fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenEditModal(campagne)}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                                        <Edit fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCampagne(campagne.id)}
                                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                                        <Delete fontSize="small" />
                                    </button>
                                </div>

                                {/* Image ou icône */}
                                <div className="w-full h-40 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                                    {campagne.image ? (
                                        <img
                                            src={campagne.image}
                                            alt={campagne.nom}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <Campaign className="text-blue-300 text-6xl" />
                                    )}
                                </div>

                                {/* Statut et progression */}
                                <div className="flex justify-between items-start mb-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${statusInfo.color}`}>
                                        {statusInfo.icon}
                                        {statusInfo.label}
                                    </span>
                                    {campagne.resultats?.objectifs_atteints > 0 && (
                                        <span className={`text-xs font-medium ${getProgressionColor(campagne.resultats.objectifs_atteints)}`}>
                                            {campagne.resultats.objectifs_atteints}% objectifs
                                        </span>
                                    )}
                                </div>

                                {/* Nom */}
                                <h3 className="text-xl font-bold text-gray-800 mb-2">{campagne.nom}</h3>

                                {/* Description */}
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {campagne.description}
                                </p>

                                {/* Informations principales */}
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <LocationOn fontSize="small" className="text-blue-500" />
                                        <span className="text-sm">{campagne.ville}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <Category fontSize="small" className="text-purple-500" />
                                        <span className="text-sm">{campagne.secteur}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <AttachMoney fontSize="small" className="text-green-500" />
                                        <span className="text-sm font-medium">
                                            {campagne.cout.toLocaleString()} USD
                                            {totalDepense > 0 && (
                                                <span className="ml-2 text-xs text-gray-500">
                                                    (dépensé: {totalDepense.toLocaleString()} USD)
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <CalendarToday fontSize="small" className="text-orange-500" />
                                        <span className="text-sm">{dateDebut} - {dateFin}</span>
                                    </div>
                                </div>

                                {/* Indicateurs rapides */}
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {campagne.planification?.etapes && (
                                        <div className="text-center">
                                            <p className="text-xs text-gray-500">Étapes</p>
                                            <p className="font-medium text-sm">
                                                {campagne.planification.etapes.filter(e => e.completed).length}/{campagne.planification.etapes.length}
                                            </p>
                                        </div>
                                    )}
                                    {campagne.resultats && (
                                        <>
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500">Ventes</p>
                                                <p className="font-medium text-sm">{campagne.resultats.ventes_generees || 0}</p>
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs text-gray-500">Leads</p>
                                                <p className="font-medium text-sm">{campagne.resultats.leads_generees || 0}</p>
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Budget restant */}
                                {campagne.status === 'en_cours' && (
                                    <div className={`text-xs p-2 rounded-lg ${budgetRestant < 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                        Budget restant: {budgetRestant.toLocaleString()} USD
                                        {budgetRestant < 0 && ' (dépassement)'}
                                    </div>
                                )}

                                {/* Objectif et responsable */}
                                <div className="border-t pt-3 mt-3">
                                    <p className="text-sm text-gray-500 mb-1">
                                        <span className="font-medium">Objectif:</span> {campagne.objectif}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        <span className="font-medium">Responsable:</span> {campagne.responsable}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <Campaign className="text-gray-400 text-6xl mx-auto mb-4" />
                    <h3 className="text-xl text-gray-600 font-medium mb-2">Aucune campagne</h3>
                    <p className="text-gray-500 mb-6">Commencez par créer une nouvelle campagne</p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                        <Add /> Créer une campagne
                    </button>
                </div>
            )}

            {/* Modals */}
            <ModalAddCampagne
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddCampagne}
            />

            <ModalEditCampagne
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setCampagneToEdit(null);
                }}
                onSave={handleEditCampagne}
                campagneToEdit={campagneToEdit}
            />
        </div>
    );
};

export default CampagneList;