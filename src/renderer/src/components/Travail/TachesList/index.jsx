import React, { useState } from 'react';
import {
    Assignment,
    Add,
    Edit,
    Delete,
    Person,
    CalendarToday,
    Flag,
    CheckCircle,
    RadioButtonUnchecked,
    PlayArrow,
    Pause,
    PriorityHigh,
    FilterList,
    Search,
    Sort,
    ArrowBack
} from "@mui/icons-material";
import ModalAddTask from '../ModalAddTache';
import ModalEditTask from '../ModalEditTache';
import TaskDetails from '../TachesDetails';
import TaskCalendar from '../TachesCalendar';

const TachesList = ({ members = [], phases = [], onUpdateTasks }) => {
    const [tasks, setTasks] = useState([
        {
            id: 1,
            titre: "Rédiger le cahier des charges",
            description: "Document détaillant les spécifications fonctionnelles et techniques du projet",
            phaseId: 1,
            phase: "ANALYSE",
            assignee: "Helly Djuma",
            assigneeId: 1,
            date_debut: "2026-02-01",
            date_echeance: "2026-02-10",
            date_fin: null,
            statut: "termine",
            priorite: "haute",
            estimated_hours: 20,
            actual_hours: 18,
            dependances: [],
            sous_taches: [
                { id: 101, titre: "Interview des parties prenantes", completed: true },
                { id: 102, titre: "Analyse des besoins", completed: true },
                { id: 103, titre: "Rédaction des spécifications", completed: true }
            ],
            commentaires: [
                { id: 1001, auteur: "Helly Djuma", date: "2026-02-03", texte: "Première version validée par le client" }
            ]
        },
        {
            id: 2,
            titre: "Maquetter l'interface utilisateur",
            description: "Créer les maquettes haute fidélité pour l'application",
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
                { id: 202, titre: "Maquetter l'écran d'accueil", completed: true },
                { id: 203, titre: "Maquetter les formulaires", completed: false },
                { id: 204, titre: "Valider avec le client", completed: false }
            ],
            commentaires: []
        },
        {
            id: 3,
            titre: "Configurer l'environnement de développement",
            description: "Mettre en place les outils et l'infrastructure nécessaire",
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
                { id: 301, titre: "Installer Node.js et npm", completed: false },
                { id: 302, titre: "Configurer le projet React", completed: false },
                { id: 303, titre: "Mettre en place Git", completed: false }
            ],
            commentaires: []
        },
        {
            id: 4,
            titre: "Développer l'API REST",
            description: "Créer les endpoints pour la gestion des utilisateurs",
            phaseId: 3,
            phase: "DEVELOPPEMENT",
            assignee: "Benny Woubi",
            assigneeId: 4,
            date_debut: "2026-02-19",
            date_echeance: "2026-02-28",
            date_fin: null,
            statut: "en_attente",
            priorite: "haute",
            estimated_hours: 40,
            actual_hours: 0,
            dependances: [3],
            sous_taches: [
                { id: 401, titre: "Modéliser la base de données", completed: false },
                { id: 402, titre: "Créer les modèles", completed: false },
                { id: 403, titre: "Implémenter les contrôleurs", completed: false },
                { id: 404, titre: "Tester les endpoints", completed: false }
            ],
            commentaires: []
        },
        {
            id: 5,
            titre: "Tester les fonctionnalités critiques",
            description: "Exécuter les tests de non-régression",
            phaseId: 4,
            phase: "TESTS",
            assignee: "Soso",
            assigneeId: 6,
            date_debut: "2026-03-01",
            date_echeance: "2026-03-05",
            date_fin: null,
            statut: "a_faire",
            priorite: "basse",
            estimated_hours: 16,
            actual_hours: 0,
            dependances: [4],
            sous_taches: [
                { id: 501, titre: "Préparer les cas de test", completed: false },
                { id: 502, titre: "Exécuter les tests", completed: false },
                { id: 503, titre: "Documenter les résultats", completed: false }
            ],
            commentaires: []
        }
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);
    const [viewMode, setViewMode] = useState('list'); // 'list', 'calendar', 'kanban'
    const [filter, setFilter] = useState({
        statut: 'all',
        assignee: 'all',
        phase: 'all',
        priorite: 'all'
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('echeance'); // 'echeance', 'priorite', 'statut'

    // Statistiques des tâches
    const stats = {
        total: tasks.length,
        a_faire: tasks.filter(t => t.statut === 'a_faire').length,
        en_cours: tasks.filter(t => t.statut === 'en_cours').length,
        en_attente: tasks.filter(t => t.statut === 'en_attente').length,
        termine: tasks.filter(t => t.statut === 'termine').length,
        haute_priorite: tasks.filter(t => t.priorite === 'haute').length,
        heures_estimees: tasks.reduce((acc, t) => acc + t.estimated_hours, 0),
        heures_reelles: tasks.reduce((acc, t) => acc + t.actual_hours, 0)
    };

    const handleAddTask = (newTask) => {
        const phase = phases.find(p => p.id === newTask.phaseId);
        const member = members.find(m => m.id === newTask.assigneeId);

        const taskWithId = {
            ...newTask,
            id: Date.now(),
            phase: phase?.title || '',
            assignee: member?.nom || '',
            date_fin: null,
            actual_hours: 0,
            sous_taches: [],
            commentaires: []
        };

        const updatedTasks = [...tasks, taskWithId];
        setTasks(updatedTasks);
        if (onUpdateTasks) {
            onUpdateTasks(updatedTasks);
        }
    };

    const handleEditTask = (updatedTask) => {
        const phase = phases.find(p => p.id === updatedTask.phaseId);
        const member = members.find(m => m.id === updatedTask.assigneeId);

        const taskWithDetails = {
            ...updatedTask,
            phase: phase?.title || updatedTask.phase,
            assignee: member?.nom || updatedTask.assignee
        };

        const updatedTasks = tasks.map(t =>
            t.id === updatedTask.id ? taskWithDetails : t
        );
        setTasks(updatedTasks);
        if (onUpdateTasks) {
            onUpdateTasks(updatedTasks);
        }
    };

    const handleDeleteTask = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            const updatedTasks = tasks.filter(t => t.id !== id);
            setTasks(updatedTasks);
            if (onUpdateTasks) {
                onUpdateTasks(updatedTasks);
            }
        }
    };

    const handleUpdateTaskStatus = (taskId, newStatus) => {
        const updatedTasks = tasks.map(t =>
            t.id === taskId ? {
                ...t,
                statut: newStatus,
                date_fin: newStatus === 'termine' ? new Date().toISOString().split('T')[0] : t.date_fin
            } : t
        );
        setTasks(updatedTasks);
        if (onUpdateTasks) {
            onUpdateTasks(updatedTasks);
        }
    };

    const handleToggleSubtask = (taskId, subtaskId) => {
        const updatedTasks = tasks.map(t => {
            if (t.id === taskId) {
                const updatedSubtasks = t.sous_taches.map(st =>
                    st.id === subtaskId ? { ...st, completed: !st.completed } : st
                );
                return { ...t, sous_taches: updatedSubtasks };
            }
            return t;
        });
        setTasks(updatedTasks);
    };

    const getStatusIcon = (statut) => {
        switch (statut) {
            case 'a_faire':
                return <RadioButtonUnchecked className="text-gray-400" />;
            case 'en_cours':
                return <PlayArrow className="text-blue-500" />;
            case 'en_attente':
                return <Pause className="text-yellow-500" />;
            case 'termine':
                return <CheckCircle className="text-green-500" />;
            default:
                return <RadioButtonUnchecked className="text-gray-400" />;
        }
    };

    const getStatusInfo = (statut) => {
        switch (statut) {
            case 'a_faire':
                return {
                    color: 'bg-gray-100 text-gray-700',
                    label: 'À faire'
                };
            case 'en_cours':
                return {
                    color: 'bg-blue-100 text-blue-700',
                    label: 'En cours'
                };
            case 'en_attente':
                return {
                    color: 'bg-yellow-100 text-yellow-700',
                    label: 'En attente'
                };
            case 'termine':
                return {
                    color: 'bg-green-100 text-green-700',
                    label: 'Terminé'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-700',
                    label: statut
                };
        }
    };

    const getPriorityInfo = (priorite) => {
        switch (priorite) {
            case 'haute':
                return {
                    color: 'bg-red-100 text-red-700',
                    icon: <PriorityHigh className="text-red-600" />,
                    label: 'Haute'
                };
            case 'moyenne':
                return {
                    color: 'bg-orange-100 text-orange-700',
                    icon: <Flag className="text-orange-600" />,
                    label: 'Moyenne'
                };
            case 'basse':
                return {
                    color: 'bg-green-100 text-green-700',
                    icon: <Flag className="text-green-600" />,
                    label: 'Basse'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-700',
                    icon: <Flag className="text-gray-600" />,
                    label: priorite
                };
        }
    };

    // Filtrer les tâches
    const filteredTasks = tasks.filter(task => {
        if (filter.statut !== 'all' && task.statut !== filter.statut) return false;
        if (filter.assignee !== 'all' && task.assigneeId !== parseInt(filter.assignee)) return false;
        if (filter.phase !== 'all' && task.phaseId !== parseInt(filter.phase)) return false;
        if (filter.priorite !== 'all' && task.priorite !== filter.priorite) return false;
        if (searchTerm && !task.titre.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !task.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    // Trier les tâches
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        switch (sortBy) {
            case 'echeance':
                return new Date(a.date_echeance) - new Date(b.date_echeance);
            case 'priorite':
                const priorityWeight = { 'haute': 3, 'moyenne': 2, 'basse': 1 };
                return priorityWeight[b.priorite] - priorityWeight[a.priorite];
            case 'statut':
                const statusOrder = { 'a_faire': 1, 'en_cours': 2, 'en_attente': 3, 'termine': 4 };
                return statusOrder[a.statut] - statusOrder[b.statut];
            default:
                return 0;
        }
    });

    // Vue Kanban (par statut)
    if (viewMode === 'kanban') {
        const columns = {
            a_faire: { title: 'À faire', tasks: tasks.filter(t => t.statut === 'a_faire'), color: 'gray' },
            en_cours: { title: 'En cours', tasks: tasks.filter(t => t.statut === 'en_cours'), color: 'blue' },
            en_attente: { title: 'En attente', tasks: tasks.filter(t => t.statut === 'en_attente'), color: 'yellow' },
            termine: { title: 'Terminé', tasks: tasks.filter(t => t.statut === 'termine'), color: 'green' }
        };

        return (
            <div className='w-full bg-gray-200 p-4'>
                <div className="bg-white">
                    <div className="flex  gap-4 items-center mb-6 p-4">
                        <button
                            onClick={() => setViewMode('list')}
                            className="text-black font-bold hover:text-blue-800">

                            <ArrowBack />
                        </button>
                        <h2 className="text-xl font-bold text-gray-800">Tableau Kanban</h2>

                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {Object.entries(columns).map(([key, column]) => (
                            <div key={key} className="bg-gray-50 rounded-lg p-4">
                                <h3 className={`font-bold mb-4 text-${column.color}-600`}>
                                    {column.title} ({column.tasks.length})
                                </h3>
                                <div className="space-y-3">
                                    {column.tasks.map(task => (
                                        <div
                                            key={task.id}
                                            className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer"
                                            onClick={() => {
                                                setSelectedTask(task);
                                                setIsDetailsModalOpen(true);
                                            }}>
                                            <h4 className="font-medium text-gray-800 mb-1">{task.titre}</h4>
                                            <p className="text-xs text-gray-500 mb-2">{task.phase}</p>
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="flex items-center gap-1">
                                                    <Person fontSize="small" className="text-gray-400" />
                                                    {task.assignee}
                                                </span>
                                                <span className={`px-2 py-1 rounded-full ${task.priorite === 'haute' ? 'bg-red-100 text-red-700' :
                                                    task.priorite === 'moyenne' ? 'bg-orange-100 text-orange-700' :
                                                        'bg-green-100 text-green-700'
                                                    }`}>
                                                    {task.priorite}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        );
    }

    // Vue Calendrier
    if (viewMode === 'calendar') {
        return (
            <TaskCalendar
                tasks={tasks}
                onTaskClick={(task) => {
                    setSelectedTask(task);
                    setIsDetailsModalOpen(true);
                }}
            />
        );
    }

    // Vue Liste (par défaut)
    return (
        <div className="w-full bg-gray-200 p-4">
            {/* Header */}
            <div className="bg-primary rounded-lg shadow-md p-4 flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <h1 className="text-xl text-white font-bold">Gestion des Tâches</h1>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md">
                    <Add /> Nouvelle tâche
                </button>
            </div>

            {/* Navigation des vues */}
            <div className="bg-white rounded-lg shadow-md p-2 mb-4 flex gap-2">
                <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                    Liste
                </button>
                <button
                    onClick={() => setViewMode('kanban')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                    Kanban
                </button>
                <button
                    onClick={() => setViewMode('calendar')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                        }`}>
                    Calendrier
                </button>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Total tâches</p>
                    <p className="text-2xl font-bold text-primary">{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">En cours</p>
                    <p className="text-2xl font-bold text-primary">{stats.en_cours}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Haute priorité</p>
                    <p className="text-2xl font-bold text-red-600">{stats.haute_priorite}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-600">Heures (est/réel)</p>
                    <p className="text-2xl font-bold text-green-600">
                        {stats.heures_estimees}h / {stats.heures_reelles}h
                    </p>
                </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[200px]">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Rechercher une tâche..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                            />
                        </div>
                    </div>

                    <select
                        value={filter.statut}
                        onChange={(e) => setFilter({ ...filter, statut: e.target.value })}
                        className="px-4 py-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600">
                        <option value="all">Tous statuts</option>
                        <option value="a_faire">À faire</option>
                        <option value="en_cours">En cours</option>
                        <option value="en_attente">En attente</option>
                        <option value="termine">Terminé</option>
                    </select>

                    <select
                        value={filter.assignee}
                        onChange={(e) => setFilter({ ...filter, assignee: e.target.value })}
                        className="px-4 py-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600">
                        <option value="all">Tous les membres</option>
                        {members.map(m => (
                            <option key={m.id} value={m.id}>{m.nom}</option>
                        ))}
                    </select>

                    <select
                        value={filter.phase}
                        onChange={(e) => setFilter({ ...filter, phase: e.target.value })}
                        className="px-4 py-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600">
                        <option value="all">Toutes phases</option>
                        {phases.map(p => (
                            <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                    </select>

                    <select
                        value={filter.priorite}
                        onChange={(e) => setFilter({ ...filter, priorite: e.target.value })}
                        className="px-4 py-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600">
                        <option value="all">Toutes priorités</option>
                        <option value="haute">Haute</option>
                        <option value="moyenne">Moyenne</option>
                        <option value="basse">Basse</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600">
                        <option value="echeance">Trier par échéance</option>
                        <option value="priorite">Trier par priorité</option>
                        <option value="statut">Trier par statut</option>
                    </select>
                </div>
            </div>

            {/* Liste des tâches */}
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-4">
                {sortedTasks.map((task) => {
                    const statusInfo = getStatusInfo(task.statut);
                    const priorityInfo = getPriorityInfo(task.priorite);
                    const isOverdue = new Date(task.date_echeance) < new Date() && task.statut !== 'termine';
                    const progress = task.sous_taches.length > 0
                        ? (task.sous_taches.filter(st => st.completed).length / task.sous_taches.length) * 100
                        : task.actual_hours > 0 ? (task.actual_hours / task.estimated_hours) * 100 : 0;

                    return (
                        <div
                            key={task.id}
                            className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 relative group ${isOverdue ? 'border-l-4 border-l-red-500' : ''
                                }`}>

                            {/* Boutons d'action */}
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => {
                                        setSelectedTask(task);
                                        setIsDetailsModalOpen(true);
                                    }}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                                    title="Voir détails">
                                    <Assignment fontSize="small" />
                                </button>
                                <button
                                    onClick={() => {
                                        setTaskToEdit(task);
                                        setIsEditModalOpen(true);
                                    }}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                                    <Edit fontSize="small" />
                                </button>
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                                    <Delete fontSize="small" />
                                </button>
                            </div>

                            {/* En-tête */}
                            <div className="flex items-start gap-4 mb-4">
                                <button
                                    onClick={() => {
                                        const nextStatus = {
                                            'a_faire': 'en_cours',
                                            'en_cours': 'termine',
                                            'en_attente': 'en_cours',
                                            'termine': 'termine'
                                        }[task.statut];
                                        if (nextStatus !== task.statut) {
                                            handleUpdateTaskStatus(task.id, nextStatus);
                                        }
                                    }}
                                    className="mt-1">
                                    {getStatusIcon(task.statut)}
                                </button>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-gray-800">{task.titre}</h3>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${priorityInfo.color}`}>
                                            {priorityInfo.icon}
                                            {priorityInfo.label}
                                        </span>
                                        {isOverdue && (
                                            <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                                En retard
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-gray-600 text-sm mb-3">{task.description}</p>

                                    {/* Métadonnées */}
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-3">
                                        <span className="flex items-center gap-1">
                                            <Person fontSize="small" className="text-blue-500" />
                                            {task.assignee}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Assignment fontSize="small" className="text-purple-500" />
                                            {task.phase}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <CalendarToday fontSize="small" className="text-orange-500" />
                                            Échéance: {new Date(task.date_echeance).toLocaleDateString('fr-FR')}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Flag fontSize="small" className="text-green-500" />
                                            {task.estimated_hours}h estimées
                                        </span>
                                    </div>

                                    {/* Barre de progression */}
                                    {progress > 0 && (
                                        <div className="mb-3">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-xs text-gray-500">Progression</span>
                                                <span className="text-xs font-medium">{Math.round(progress)}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-500 rounded-full h-2"
                                                    style={{ width: `${progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Sous-tâches */}
                                    {task.sous_taches.length > 0 && (
                                        <div className="mt-3 pt-3 border-t">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                Sous-tâches ({task.sous_taches.filter(st => st.completed).length}/{task.sous_taches.length})
                                            </h4>
                                            <div className="space-y-1">
                                                {task.sous_taches.slice(0, 3).map(st => (
                                                    <div key={st.id} className="flex items-center gap-2 text-sm">
                                                        <button onClick={() => handleToggleSubtask(task.id, st.id)}>
                                                            {st.completed ? (
                                                                <CheckCircle className="text-green-500" fontSize="small" />
                                                            ) : (
                                                                <RadioButtonUnchecked className="text-gray-400" fontSize="small" />
                                                            )}
                                                        </button>
                                                        <span className={st.completed ? 'line-through text-gray-400' : 'text-gray-600'}>
                                                            {st.titre}
                                                        </span>
                                                    </div>
                                                ))}
                                                {task.sous_taches.length > 3 && (
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        +{task.sous_taches.length - 3} autres
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Dépendances */}
                            {task.dependances.length > 0 && (
                                <div className="mt-2 text-xs text-gray-400">
                                    Dépend de: {task.dependances.map(d => {
                                        const depTask = tasks.find(t => t.id === d);
                                        return depTask?.titre;
                                    }).join(', ')}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Message si aucune tâche */}
            {sortedTasks.length === 0 && (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <Assignment className="text-gray-400 text-6xl mx-auto mb-4" />
                    <h3 className="text-xl text-gray-600 font-medium mb-2">Aucune tâche trouvée</h3>
                    <p className="text-gray-500 mb-6">Commencez par créer une nouvelle tâche</p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 inline-flex items-center gap-2">
                        <Add /> Créer une tâche
                    </button>
                </div>
            )}

            {/* Modals */}
            <ModalAddTask
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddTask}
                members={members}
                phases={phases}
                tasks={tasks}
            />

            <ModalEditTask
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setTaskToEdit(null);
                }}
                onSave={handleEditTask}
                taskToEdit={taskToEdit}
                members={members}
                phases={phases}
                tasks={tasks}
            />

            <TaskDetails
                isOpen={isDetailsModalOpen}
                onClose={() => {
                    setIsDetailsModalOpen(false);
                    setSelectedTask(null);
                }}
                task={selectedTask}
                onUpdateStatus={handleUpdateTaskStatus}
                onToggleSubtask={handleToggleSubtask}
                members={members}
            />
        </div>
    );
};

export default TachesList;