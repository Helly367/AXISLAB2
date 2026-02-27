import React, { useState } from 'react';
import {
    Folder,
    Search,
    Add,
    Upload,
    CalendarToday,
    CheckCircle,
    PlayArrow,
    Pause,
} from "@mui/icons-material";
import ModalCreateProject from '../ModalCreateProject';
import ModalImportProject from '../ModalImportProject';
import ProjectCard from '../ProjectCard';
import ProjectFilters from '../ProjectFilters';

const MesProjets = () => {
    const [projects, setProjects] = useState([
        {
            id: 1,
            nom: "Développement Application Mobile InnovX",
            description: "Création d'une application mobile de e-commerce pour la marque InnovX",
            client: "InnovX SARL",
            date_debut: "2026-01-15",
            date_fin_prevue: "2026-06-30",
            date_fin_reelle: null,
            statut: "en_cours",
            priorite: "haute",
            progression: 45,
            budget_total: 15000000,
            budget_depense: 6750000,
            chef_projet: "Helly Djuma",
            membres: 8,
            taches_total: 42,
            taches_terminees: 19,
            risques_critiques: 2,
            image: "/projects/app-mobile.jpg",
            couleur: "bg-blue-600",
            favori: true
        },
        {
            id: 2,
            nom: "Campagne Marketing Digital 2026",
            description: "Campagne de publicité en ligne pour les réseaux sociaux et Google Ads",
            client: "Groupe Multimedia",
            date_debut: "2026-02-01",
            date_fin_prevue: "2026-05-15",
            date_fin_reelle: null,
            statut: "en_cours",
            priorite: "moyenne",
            progression: 30,
            budget_total: 8000000,
            budget_depense: 2400000,
            chef_projet: "Ephraim Winter",
            membres: 5,
            taches_total: 28,
            taches_terminees: 8,
            risques_critiques: 1,
            image: null,
            couleur: "bg-purple-600",
            favori: false
        },
        {
            id: 3,
            nom: "Migration Infrastructure Cloud",
            description: "Migration de tous les serveurs vers AWS et mise en place de l'infrastructure",
            client: "Interne IT",
            date_debut: "2026-01-10",
            date_fin_prevue: "2026-04-20",
            date_fin_reelle: "2026-04-15",
            statut: "termine",
            priorite: "haute",
            progression: 100,
            budget_total: 12000000,
            budget_depense: 11400000,
            chef_projet: "Sam Rosie",
            membres: 6,
            taches_total: 35,
            taches_terminees: 35,
            risques_critiques: 0,
            image: "/projects/cloud.jpg",
            couleur: "bg-green-600",
            favori: true
        },
        {
            id: 4,
            nom: "Refonte Site Web Corporate",
            description: "Nouveau design et développement du site web de l'entreprise",
            client: "Direction Générale",
            date_debut: "2026-03-01",
            date_fin_prevue: "2026-07-31",
            date_fin_reelle: null,
            statut: "planifie",
            priorite: "moyenne",
            progression: 0,
            budget_total: 6000000,
            budget_depense: 0,
            chef_projet: "Kenny Mougou",
            membres: 4,
            taches_total: 25,
            taches_terminees: 0,
            risques_critiques: 0,
            image: null,
            couleur: "bg-yellow-600",
            favori: false
        },
        {
            id: 5,
            nom: "Formation Équipe Commerciale",
            description: "Programme de formation pour la nouvelle équipe commerciale",
            client: "RH",
            date_debut: "2026-02-15",
            date_fin_prevue: "2026-03-15",
            date_fin_reelle: null,
            statut: "en_pause",
            priorite: "basse",
            progression: 60,
            budget_total: 3000000,
            budget_depense: 1800000,
            chef_projet: "Benny Woubi",
            membres: 3,
            taches_total: 15,
            taches_terminees: 9,
            risques_critiques: 0,
            image: null,
            couleur: "bg-orange-600",
            favori: false
        },
        {
            id: 6,
            nom: "Déploiement ERP Odoo",
            description: "Installation et configuration d'Odoo pour la gestion d'entreprise",
            client: "Finances",
            date_debut: "2026-04-01",
            date_fin_prevue: "2026-08-30",
            date_fin_reelle: null,
            statut: "planifie",
            priorite: "haute",
            progression: 10,
            budget_total: 20000000,
            budget_depense: 2000000,
            chef_projet: "Helly Djuma",
            membres: 7,
            taches_total: 50,
            taches_terminees: 5,
            risques_critiques: 3,
            image: "/projects/odoo.jpg",
            couleur: "bg-red-600",
            favori: true
        }
    ]);

    const [filteredProjects, setFilteredProjects] = useState(projects);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        statut: 'all',
        priorite: 'all',
        date: 'all',
        favoris: false
    });
    const [sortBy, setSortBy] = useState('date_desc'); // 'date_desc', 'date_asc', 'nom', 'progression', 'budget'
    const [viewMode, setViewMode] = useState('grid'); // 'grid', 'list'
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isImportModalOpen, setIsImportModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showMenu, setShowMenu] = useState(null);

    // Statistiques globales
    const stats = {
        total: projects.length,
        en_cours: projects.filter(p => p.statut === 'en_cours').length,
        termine: projects.filter(p => p.statut === 'termine').length,
        planifie: projects.filter(p => p.statut === 'planifie').length,
        en_pause: projects.filter(p => p.statut === 'en_pause').length,
        budget_total: projects.reduce((acc, p) => acc + p.budget_total, 0),
        budget_depense: projects.reduce((acc, p) => acc + p.budget_depense, 0),
        taches_total: projects.reduce((acc, p) => acc + p.taches_total, 0),
        taches_terminees: projects.reduce((acc, p) => acc + p.taches_terminees, 0),
        risques: projects.reduce((acc, p) => acc + p.risques_critiques, 0)
    };

    // Fonction de recherche et filtrage
    const applyFilters = () => {
        let filtered = [...projects];

        // Recherche textuelle
        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.chef_projet.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Filtres
        if (filters.statut !== 'all') {
            filtered = filtered.filter(p => p.statut === filters.statut);
        }
        if (filters.priorite !== 'all') {
            filtered = filtered.filter(p => p.priorite === filters.priorite);
        }
        if (filters.favoris) {
            filtered = filtered.filter(p => p.favori);
        }
        if (filters.date === 'mois') {
            const now = new Date();
            const finMois = new Date(now.getFullYear(), now.getMonth() + 1, 0);
            filtered = filtered.filter(p => new Date(p.date_fin_prevue) <= finMois);
        } else if (filters.date === 'trimestre') {
            const now = new Date();
            const finTrimestre = new Date(now.getFullYear(), now.getMonth() + 3, 0);
            filtered = filtered.filter(p => new Date(p.date_fin_prevue) <= finTrimestre);
        }

        // Tri
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date_desc':
                    return new Date(b.date_debut) - new Date(a.date_debut);
                case 'date_asc':
                    return new Date(a.date_debut) - new Date(b.date_debut);
                case 'nom':
                    return a.nom.localeCompare(b.nom);
                case 'progression':
                    return b.progression - a.progression;
                case 'budget':
                    return b.budget_total - a.budget_total;
                default:
                    return 0;
            }
        });

        setFilteredProjects(filtered);
    };

    React.useEffect(() => {
        applyFilters();
    }, [searchTerm, filters, sortBy, projects]);

    const handleCreateProject = (newProject) => {
        const projectWithId = {
            ...newProject,
            id: Date.now(),
            progression: 0,
            budget_depense: 0,
            taches_total: 0,
            taches_terminees: 0,
            risques_critiques: 0,
            image: null,
            favori: false
        };
        setProjects([...projects, projectWithId]);
        setIsCreateModalOpen(false);
    };

    const handleImportProject = (importedData) => {
        // Simulation d'import
        const newProjects = importedData.map((data, index) => ({
            ...data,
            id: Date.now() + index,
            progression: data.progression || 0
        }));
        setProjects([...projects, ...newProjects]);
        setIsImportModalOpen(false);
    };

    const handleDeleteProject = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
            setProjects(projects.filter(p => p.id !== id));
        }
    };

    const handleToggleFavorite = (id) => {
        setProjects(projects.map(p =>
            p.id === id ? { ...p, favori: !p.favori } : p
        ));
    };

    const handleDuplicateProject = (project) => {
        const newProject = {
            ...project,
            id: Date.now(),
            nom: `${project.nom} (copie)`,
            date_debut: new Date().toISOString().split('T')[0],
            progression: 0,
            budget_depense: 0,
            taches_terminees: 0,
            favori: false
        };
        setProjects([...projects, newProject]);
    };

    const getStatusIcon = (statut) => {
        switch (statut) {
            case 'en_cours':
                return <PlayArrow className="text-blue-500" />;
            case 'termine':
                return <CheckCircle className="text-green-500" />;
            case 'planifie':
                return <CalendarToday className="text-yellow-500" />;
            case 'en_pause':
                return <Pause className="text-orange-500" />;
            default:
                return null;
        }
    };

    const getStatusLabel = (statut) => {
        switch (statut) {
            case 'en_cours':
                return 'En cours';
            case 'termine':
                return 'Terminé';
            case 'planifie':
                return 'Planifié';
            case 'en_pause':
                return 'En pause';
            default:
                return statut;
        }
    };

    return (
        <div className="w-full bg-gray-200 p-4">
            {/* Header */}
            <div className="bg-primary rounded-lg shadow-md p-4 mb-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">

                        <h1 className="text-xl text-white font-bold">Mes Projets</h1>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setIsImportModalOpen(true)}
                            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md">
                            <Upload /> Importer
                        </button>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md">
                            <Add /> Nouveau projet
                        </button>
                    </div>
                </div>

                {/* Statistiques rapides */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-6">
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <p className="text-primary text-xs">Total projets</p>
                        <p className="text-primary text-2xl font-bold">{stats.total}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <p className="text-primary text-xs">En cours</p>
                        <p className="text-primary text-2xl font-bold">{stats.en_cours}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <p className="text-primary text-xs">Budget total</p>
                        <p className="text-primary text-2xl font-bold">{stats.budget_total.toLocaleString()} FCFA</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <p className="text-primary text-xs">Tâches</p>
                        <p className="text-primary text-2xl font-bold">{stats.taches_terminees}/{stats.taches_total}</p>
                    </div>
                    <div className="bg-white bg-opacity-20 rounded-lg p-3">
                        <p className="text-primary text-xs">Risques</p>
                        <p className="text-primary text-2xl font-bold">{stats.risques}</p>
                    </div>
                </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    {/* Recherche */}
                    <div className="flex-1 min-w-[300px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher un projet par nom, client, responsable..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                            />
                        </div>
                    </div>

                    {/* Filtres */}
                    <ProjectFilters
                        filters={filters}
                        setFilters={setFilters}
                        sortBy={sortBy}
                        setSortBy={setSortBy}
                        viewMode={viewMode}
                        setViewMode={setViewMode}
                    />
                </div>
            </div>

            {/* Résultats */}
            <div className="mb-4 flex justify-between items-center">
                <p className="text-gray-600">
                    {filteredProjects.length} projet{filteredProjects.length > 1 ? 's' : ''} trouvé{filteredProjects.length > 1 ? 's' : ''}
                </p>
                {searchTerm && (
                    <button
                        onClick={() => setSearchTerm('')}
                        className="text-blue-600 hover:text-blue-800 text-sm">
                        Effacer la recherche
                    </button>
                )}
            </div>

            {/* Liste des projets */}
            {filteredProjects.length > 0 ? (
                <div className={viewMode === 'grid'
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }>
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project.id}
                            project={project}
                            viewMode={viewMode}
                            onToggleFavorite={handleToggleFavorite}
                            onDelete={handleDeleteProject}
                            onDuplicate={handleDuplicateProject}
                            getStatusIcon={getStatusIcon}
                            getStatusLabel={getStatusLabel}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <Folder className="text-gray-400 text-6xl mx-auto mb-4" />
                    <h3 className="text-xl text-gray-600 font-medium mb-2">Aucun projet trouvé</h3>
                    <p className="text-gray-500 mb-6">
                        {searchTerm
                            ? `Aucun projet ne correspond à "${searchTerm}"`
                            : 'Commencez par créer votre premier projet'
                        }
                    </p>
                    {searchTerm ? (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Voir tous les projets
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2">
                            <Add /> Créer un projet
                        </button>
                    )}
                </div>
            )}

            {/* Modals */}
            <ModalCreateProject
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSave={handleCreateProject}
            />

            <ModalImportProject
                isOpen={isImportModalOpen}
                onClose={() => setIsImportModalOpen(false)}
                onImport={handleImportProject}
            />
        </div>
    );
};

export default MesProjets;