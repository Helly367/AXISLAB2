import React, { useState, useMemo, useCallback } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import axis from "../../../../../resources/axis.png";

// Import des icônes MUI
import {
    Person2Rounded,
    Schema,
    Groups,
    AttachMoney,
    Inventory,
    Campaign,
    Warning,
    Assignment,
    Notifications,
    Folder,
    Settings,
    Logout,
    ChevronLeft,
    ChevronRight
} from '@mui/icons-material';

// Import des composants de gestion
import Profile from '../Gestion/Profile';
import StructureProjet from '../Gestion/Structure';
import Equipe from '../Ressources/Equipe';
import BudgetManager from '../Ressources/BudgetManager';
import MaterielList from '../Ressources/MaterielList';
import CampagneList from '../Communification/CampagneList';
import RiskList from "../Security/RiskList";
import TachesList from '../Travail/TachesList';
import NotificationsList from '../Communification/NotificationsList';
import MesProjets from '../Projets/MesProjets';

const Dashboard = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [notificationsCount, setNotificationsCount] = useState(3);

    // États des données
    const [phases, setPhases] = useState([
        {
            id: 1,
            title: "ANALYSE",
            description_phase: "Phase d'analyse des besoins et spécifications du projet.",
            date_debut: "2026-02-01",
            date_fin: "2026-02-25",
            taches: [
                "Analyse des besoins clients",
                "Etude de faisabilité",
                "Spécifications fonctionnelles"
            ],
            membres: ["Helly Djuma", "Ephraim Winter"],
            couleur: "#3B82F6",
            progression: 100
        },
        {
            id: 2,
            title: "CONCEPTION",
            description_phase: "Conception technique et architecture du projet.",
            date_debut: "2026-02-26",
            date_fin: "2026-03-15",
            taches: [
                "Architecture technique",
                "Maquettage UI/UX",
                "Modélisation base de données"
            ],
            membres: ["Helly Djuma", "Ephraim Winter", "Kenny Mougou"],
            couleur: "#10B981",
            progression: 75
        },
        {
            id: 3,
            title: "DEVELOPPEMENT",
            description_phase: "Phase de développement de l'application.",
            date_debut: "2026-03-16",
            date_fin: "2026-04-30",
            taches: [
                "Mise en place environnement",
                "Développement frontend",
                "Développement backend",
                "Tests unitaires",
                "Intégration continue"
            ],
            membres: ["Helly Djuma", "Ephraim Winter", "Kenny Mougou", "Benny Woubi", "Sam Rosie"],
            couleur: "#F59E0B",
            progression: 30
        },
        {
            id: 4,
            title: "TESTS",
            description_phase: "Phase de tests et validation.",
            date_debut: "2026-05-01",
            date_fin: "2026-05-20",
            taches: [
                "Tests fonctionnels",
                "Tests d'intégration",
                "Tests de performance",
                "Correction des bugs",
                "Validation client"
            ],
            membres: ["Helly Djuma", "Ephraim Winter", "Kenny Mougou", "Sam Rosie"],
            couleur: "#EF4444",
            progression: 0
        },
        {
            id: 5,
            title: "DEPLOIEMENT",
            description_phase: "Phase de déploiement et mise en production.",
            date_debut: "2026-05-21",
            date_fin: "2026-06-05",
            taches: [
                "Préparation serveurs",
                "Déploiement production",
                "Formation utilisateurs",
                "Documentation technique",
                "Support post-déploiement"
            ],
            membres: ["Helly Djuma", "Ephraim Winter", "Kenny Mougou"],
            couleur: "#8B5CF6",
            progression: 0
        }
    ]);

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
            status: "en_cours",
            description: "Campagne de lancement du nouveau produit InnovX",
            objectif: "Atteindre 1000 ventes",
            responsable: "Helly Djuma",
            planification: {
                type: "continue",
                etapes: [
                    { nom: "Pré-lancement", date_debut: "2026-03-01", date_fin: "2026-03-10", completed: true },
                    { nom: "Lancement officiel", date_debut: "2026-03-11", date_fin: "2026-03-20", completed: false },
                    { nom: "Promotion intensive", date_debut: "2026-03-21", date_fin: "2026-04-10", completed: false }
                ],
                canaux: ["Réseaux sociaux", "Radio", "Affichage"]
            },
            resultats: {
                objectifs_atteints: 35,
                ventes_generees: 350,
                leads_generees: 850
            },
            depenses_reelles: [
                { poste: "Publicité radio", montant: 500000, date: "2026-03-05" },
                { poste: "Affichage", montant: 800000, date: "2026-03-01" }
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
            status: "termine",
            description: "Campagne de sensibilisation environnementale",
            objectif: "Toucher 5000 personnes",
            responsable: "Ephraim Winter",
            planification: {
                type: "evenement",
                etapes: [
                    { nom: "Préparation", date_debut: "2026-02-15", date_fin: "2026-02-20", completed: true },
                    { nom: "Sensibilisation", date_debut: "2026-02-21", date_fin: "2026-03-10", completed: true }
                ],
                canaux: ["Écoles", "Mairies", "ONG"]
            },
            resultats: {
                objectifs_atteints: 120,
                personnes_touchees: 6250,
                engagements: 850
            },
            depenses_reelles: [
                { poste: "Matériel", montant: 450000, date: "2026-02-20" },
                { poste: "Location", montant: 600000, date: "2026-03-01" }
            ]
        }
    ]);

    const [members, setMembers] = useState([
        {
            id: 1,
            nom: "Helly Djuma",
            poste: "Chef de projet",
            role: "Chef de projet principal",
            email: "helly.djuma@email.com",
            competences: ["Gestion", "Agile", "Communication"],
            competencesRequises: ["Gestion de projet", "Méthodologie Agile", "Leadership"],
            disponibilite: 80,
            chargeActuelle: 15,
            chargeMax: 40,
            dateDebut: "2026-01-15",
            historique: [
                { phase: "ANALYSE", role: "Chef de projet", periode: "Fév 2026" },
                { phase: "CONCEPTION", role: "Chef de projet", periode: "Mars 2026" }
            ],
            photo: ""
        },
        {
            id: 2,
            nom: "Ephraim Winter",
            poste: "Développeur Full Stack",
            role: "Lead développeur Frontend",
            email: "ephraim.w@email.com",
            competences: ["React", "Node.js", "MongoDB", "TypeScript", "GraphQL"],
            competencesRequises: ["React", "Node.js", "TypeScript", "GraphQL"],
            disponibilite: 100,
            chargeActuelle: 35,
            chargeMax: 40,
            dateDebut: "2026-01-15",
            historique: [
                { phase: "CONCEPTION", role: "Architecte technique", periode: "Mars 2026" }
            ],
            photo: ""
        },
        {
            id: 3,
            nom: "Kenny Mougou",
            poste: "UI/UX Designer",
            role: "Lead Designer",
            email: "kenny.m@email.com",
            competences: ["Figma", "Adobe XD", "Design System", "User Research"],
            competencesRequises: ["Figma", "Design System", "User Research"],
            disponibilite: 60,
            chargeActuelle: 20,
            chargeMax: 40,
            dateDebut: "2026-02-01",
            historique: [
                { phase: "CONCEPTION", role: "UI/UX Designer", periode: "Mars 2026" }
            ],
            photo: ""
        },
        {
            id: 4,
            nom: "Benny Woubi",
            poste: "Développeur Backend",
            role: "Lead développeur Backend",
            email: "benny.w@email.com",
            competences: ["Java", "Spring Boot", "PostgreSQL", "Microservices"],
            competencesRequises: ["Java", "Spring Boot", "PostgreSQL", "Microservices"],
            disponibilite: 90,
            chargeActuelle: 32,
            chargeMax: 40,
            dateDebut: "2026-01-20",
            historique: [
                { phase: "CONCEPTION", role: "Architecte Backend", periode: "Mars 2026" }
            ],
            photo: ""
        },
        {
            id: 5,
            nom: "Sam Rosie",
            poste: "DevOps",
            role: "Ingénieur DevOps",
            email: "sam.r@email.com",
            competences: ["Docker", "AWS", "CI/CD", "Kubernetes"],
            competencesRequises: ["Docker", "AWS", "CI/CD", "Kubernetes"],
            disponibilite: 70,
            chargeActuelle: 25,
            chargeMax: 40,
            dateDebut: "2026-03-01",
            historique: [
                { phase: "DEVELOPPEMENT", role: "DevOps", periode: "Avril 2026" }
            ],
            photo: ""
        },
        {
            id: 6,
            nom: "Soso",
            poste: "Testeur QA",
            role: "Lead QA",
            email: "soso@email.com",
            competences: ["Test manuel", "Cypress", "Jest", "Test automatisé"],
            competencesRequises: ["Test manuel", "Cypress", "Test automatisé"],
            disponibilite: 100,
            chargeActuelle: 30,
            chargeMax: 40,
            dateDebut: "2026-02-15",
            historique: [],
            photo: ""
        }
    ]);

    const [tasks, setTasks] = useState([
        {
            id: 1,
            titre: "Rédiger le cahier des charges",
            description: "Document détaillant les spécifications fonctionnelles et techniques",
            phaseId: 1,
            phase: "ANALYSE",
            assignee: "Helly Djuma",
            assigneeId: 1,
            date_debut: "2026-02-01",
            date_echeance: "2026-02-10",
            date_fin: "2026-02-09",
            statut: "termine",
            priorite: "haute",
            estimated_hours: 20,
            actual_hours: 18,
            dependances: [],
            sous_taches: [
                { id: 101, titre: "Interview des parties prenantes", completed: true },
                { id: 102, titre: "Analyse des besoins", completed: true }
            ],
            commentaires: []
        },
        {
            id: 2,
            titre: "Maquetter l'interface utilisateur",
            description: "Créer les maquettes haute fidélité",
            phaseId: 2,
            phase: "CONCEPTION",
            assignee: "Kenny Mougou",
            assigneeId: 3,
            date_debut: "2026-02-11",
            date_echeance: "2026-02-20",
            date_fin: null,
            statut: "en_cours",
            priorite: "haute",
            estimated_hours: 30,
            actual_hours: 15,
            dependances: [1],
            sous_taches: [
                { id: 201, titre: "Créer le design system", completed: true },
                { id: 202, titre: "Maquetter l'écran d'accueil", completed: false }
            ],
            commentaires: []
        },
        {
            id: 3,
            titre: "Configurer l'environnement",
            description: "Mettre en place les outils nécessaires",
            phaseId: 3,
            phase: "DEVELOPPEMENT",
            assignee: "Ephraim Winter",
            assigneeId: 2,
            date_debut: "2026-02-15",
            date_echeance: "2026-02-18",
            date_fin: null,
            statut: "a_faire",
            priorite: "moyenne",
            estimated_hours: 8,
            actual_hours: 0,
            dependances: [],
            sous_taches: [
                { id: 301, titre: "Installer Node.js", completed: false },
                { id: 302, titre: "Configurer le projet", completed: false }
            ],
            commentaires: []
        }
    ]);

    const [budgetConfig, setBudgetConfig] = useState({
        type: 'interne',
        montantTotal: 5000000,
        devise: 'USD',
        deviseOrigine: 'USD',
        tauxConversion: 1,
        repartition: {},
        depenses: [
            { id: 1, libelle: "Achat matériel", montant: 1500000, phaseId: 3, date: "2026-02-15" }
        ],
        reserve: 250000,
        alertes: {
            seuilAlerte: 80,
            notifications: true
        }
    });

    const [budgetGlobal, setBudgetGlobal] = useState(5000000);
    const [materiels, setMateriels] = useState([]);

    // Menu items simplifiés - sans catégories
    const menuItems = useMemo(() => [
        { name: 'Profile', icon: <Person2Rounded />, link: "/profile", badge: null },
        { name: 'Structure', icon: <Schema />, link: "/structure", badge: null },
        { name: 'Equipe', icon: <Groups />, link: "/equipe", badge: members.length },
        { name: 'Budget', icon: <AttachMoney />, link: "/budjet", badge: null },
        { name: 'Matériels', icon: <Inventory />, link: "/materiels", badge: materiels.length },
        { name: 'Campagnes', icon: <Campaign />, link: "/campagnes", badge: campagnes.filter(c => c.status === 'en_cours').length },
        { name: 'Risques', icon: <Warning />, link: "/risques", badge: null },
        { name: 'Tâches', icon: <Assignment />, link: "/taches", badge: tasks.filter(t => t.statut === 'en_cours').length },
        { name: 'Mes projets', icon: <Folder />, link: "/mesprojets", badge: null },
        { name: 'Notifications', icon: <Notifications />, link: "/notifications", badge: notificationsCount },
        { name: 'Paramètres', icon: <Settings />, link: "/parametres", badge: null, action: () => console.log("Paramètres") },
        { name: 'Déconnexion', icon: <Logout />, link: "#", badge: null, action: () => handleLogout() }
    ], [members.length, materiels.length, campagnes, notificationsCount, tasks]);

    // Handlers avec useCallback pour optimiser les performances
    const handleNavigate = useCallback((link) => {
        if (link !== "#") {
            navigate(link);
        }
    }, [navigate]);

    const handleLogout = useCallback(() => {
        if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    const handleUpdateBudget = useCallback((newConfig) => {
        setBudgetConfig(newConfig);
    }, []);

    const handleUpdateMateriels = useCallback((updatedMateriels) => {
        setMateriels(updatedMateriels);
    }, []);

    const handleUpdateCampagnes = useCallback((updatedCampagnes) => {
        setCampagnes(updatedCampagnes);
    }, []);

    const handleUpdateTasks = useCallback((updatedTasks) => {
        setTasks(updatedTasks);
    }, []);

    const handleUpdatePhases = useCallback((updatedPhases) => {
        setPhases(updatedPhases);
    }, []);

    const handleUpdateMembers = useCallback((updatedMembers) => {
        setMembers(updatedMembers);
    }, []);

    const handleMarkAsRead = useCallback((id) => {
        console.log('Notification marquée comme lue:', id);
        setNotificationsCount(prev => Math.max(0, prev - 1));
    }, []);

    const handleDeleteNotification = useCallback((id) => {
        console.log('Notification supprimée:', id);
    }, []);

    // Calcul des statistiques globales
    const globalStats = useMemo(() => ({
        totalTaches: tasks.length,
        tachesEnCours: tasks.filter(t => t.statut === 'en_cours').length,
        tachesTerminees: tasks.filter(t => t.statut === 'termine').length,
        progressionGlobale: Math.round(
            (phases.reduce((acc, p) => acc + p.progression, 0) / (phases.length * 100)) * 100
        ),
        budgetUtilise: Math.round((budgetConfig.depenses.reduce((acc, d) => acc + d.montant, 0) / budgetGlobal) * 100)
    }), [tasks, phases, budgetConfig.depenses, budgetGlobal]);

    return (
        <div className="flex h-screen bg-gray-100">

            {/* Sidebar avec toggle */}
            <div className={`${sidebarCollapsed ? 'w-18' : 'w-40'} bg-white shadow-lg flex flex-col transition-all duration-300 ease-in-out`}>
                {/* Logo et toggle */}

                <button
                    onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </button>


                {/* Menu de navigation simplifié - sans catégories */}

                <nav className="flex-1 overflow-y-auto py-4 menu px-2 ">

                    <div className="space-y-1  ">

                        {menuItems.map((item) => {
                            const isActive = location.pathname.includes(item.link) && item.link !== "#";
                            const activeClass = isActive
                                ? "bg-blue-100 text-primary border-r-4 border-blue-primary"
                                : "text-gray-600 hover:bg-gray-50";

                            return (
                                <button
                                    key={item.name}
                                    onClick={() => item.action ? item.action() : handleNavigate(item.link)}
                                    className={`w-full flex-col flex items-center px-2 py-2 transition-all relative ${activeClass} ${sidebarCollapsed ? 'justify-center' : 'justify-start gap-2'
                                        }`}
                                    title={sidebarCollapsed ? item.name : ''}
                                >
                                    <span className="text-xl">{item.icon}</span>
                                    {!sidebarCollapsed && (
                                        <>
                                            <span className="flex-1 text-[14px] font-bold">{item.name}</span>
                                            {item.badge > 0 && (
                                                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full absolute top-1/2 right-3 transform -translate-1/2 ">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </>
                                    )}
                                    {sidebarCollapsed && item.badge > 0 && (
                                        <span className="absolute top-1 right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                            {item.badge}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </nav>

            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto bg-gray-50">
                <Routes>
                    <Route path="/" element={
                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-gray-800 mb-6">Tableau de bord</h1>
                            {/* Ajoutez ici votre composant Dashboard principal */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-gray-500 text-sm">Progression globale</h3>
                                    <p className="text-3xl font-bold text-blue-600">{globalStats.progressionGlobale}%</p>
                                </div>
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-gray-500 text-sm">Tâches en cours</h3>
                                    <p className="text-3xl font-bold text-yellow-600">{globalStats.tachesEnCours}</p>
                                </div>
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-gray-500 text-sm">Tâches terminées</h3>
                                    <p className="text-3xl font-bold text-green-600">{globalStats.tachesTerminees}</p>
                                </div>
                                <div className="bg-white rounded-lg shadow-md p-6">
                                    <h3 className="text-gray-500 text-sm">Budget utilisé</h3>
                                    <p className="text-3xl font-bold text-purple-600">{globalStats.budgetUtilise}%</p>
                                </div>
                            </div>
                        </div>
                    } />
                    <Route path="/profile/*" element={<Profile />} />
                    <Route path="/structure/*" element={
                        <StructureProjet
                            phases={phases}
                            onUpdatePhases={handleUpdatePhases}
                        />
                    } />
                    <Route path="/equipe/*" element={
                        <Equipe
                            members={members}
                            onUpdateMembers={handleUpdateMembers}
                        />
                    } />
                    <Route path="/budjet/*" element={
                        <BudgetManager
                            phases={phases}
                            onUpdateBudget={handleUpdateBudget}
                        />
                    } />
                    <Route path="/materiels/*" element={
                        <MaterielList
                            budgetGlobal={budgetGlobal}
                            onUpdateBudget={setBudgetGlobal}
                            onUpdateMateriels={handleUpdateMateriels}
                        />
                    } />
                    <Route path="/campagnes/*" element={
                        <CampagneList
                            onUpdateCampagnes={handleUpdateCampagnes}
                            budgetGlobal={budgetGlobal}
                        />
                    } />
                    <Route path="/risques/*" element={
                        <RiskList
                            onUpdateRisques={() => { }}
                        />
                    } />
                    <Route path="/taches/*" element={
                        <TachesList
                            members={members}
                            phases={phases}
                            onUpdateTasks={handleUpdateTasks}
                        />
                    } />
                    <Route path="/notifications/*" element={
                        <NotificationsList
                            tasks={tasks}
                            campagnes={campagnes}
                            budgetConfig={budgetConfig}
                            membres={members}
                            onMarkAsRead={handleMarkAsRead}
                            onDeleteNotification={handleDeleteNotification}
                        />
                    } />
                    <Route path="/mesprojets/*" element={<MesProjets />} />
                    <Route path="/parametres" element={
                        <div className="p-6">
                            <h1 className="text-2xl font-bold text-gray-800">Paramètres</h1>
                            <p className="text-gray-500 mt-4">Page en construction...</p>
                        </div>
                    } />
                </Routes>
            </div>
        </div>
    );
};

export default Dashboard;