import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
    Search,
    ArrowBack
} from "@mui/icons-material";
import ModalAddTask from '../ModalAddTache';
import ModalEditTask from '../ModalEditTache';
import TaskDetails from '../TachesDetails';
import TaskCalendar from '../TachesCalendar';

const TachesContent = ({ members = [], phases = [], onUpdateTasks }) => {
    const [tasks, setTasks] = useState([]);
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

    // Utilitaire pour enrichir les tâches avec phase et assignee
    const enrichTask = (task) => ({
        ...task,
        phase: phases.find(p => p.id === task.phaseId)?.title || task.phase || '',
        assignee: members.find(m => m.id === task.assigneeId)?.nom || task.assignee || ''
    });

    // Ajout d'une tâche
    const handleAddTask = (newTask) => {
        const taskWithId = enrichTask({
            ...newTask,
            id: uuidv4(),
            date_fin: null,
            actual_hours: 0,
            sous_taches: newTask.sous_taches?.map(st => ({ ...st, id: uuidv4() })) || [],
            commentaires: []
        });
        const updatedTasks = [...tasks, taskWithId];
        setTasks(updatedTasks);
        onUpdateTasks?.(updatedTasks);
    };

    // Modification d'une tâche
    const handleEditTask = (updatedTask) => {
        const taskWithDetails = enrichTask(updatedTask);
        const updatedTasks = tasks.map(t => t.id === updatedTask.id ? taskWithDetails : t);
        setTasks(updatedTasks);
        onUpdateTasks?.(updatedTasks);
    };

    // Suppression d'une tâche
    const handleDeleteTask = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
            const updatedTasks = tasks.filter(t => t.id !== id);
            setTasks(updatedTasks);
            onUpdateTasks?.(updatedTasks);
        }
    };

    // Changement de statut
    const handleUpdateTaskStatus = (taskId, newStatus) => {
        const updatedTasks = tasks.map(t =>
            t.id === taskId ? { ...t, statut: newStatus, date_fin: newStatus === 'termine' ? new Date().toISOString().split('T')[0] : t.date_fin } : t
        );
        setTasks(updatedTasks);
        onUpdateTasks?.(updatedTasks);
    };

    // Toggle sous-tâche
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

    // Filtrage
    const filteredTasks = useMemo(() => {
        return tasks.filter(task => {
            if (filter.statut !== 'all' && task.statut !== filter.statut) return false;
            if (filter.assignee !== 'all' && task.assigneeId !== parseInt(filter.assignee)) return false;
            if (filter.phase !== 'all' && task.phaseId !== parseInt(filter.phase)) return false;
            if (filter.priorite !== 'all' && task.priorite !== filter.priorite) return false;
            if (searchTerm && !task.titre.toLowerCase().includes(searchTerm.toLowerCase()) &&
                !task.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
            return true;
        });
    }, [tasks, filter, searchTerm]);

    // Tri
    const sortedTasks = useMemo(() => {
        const priorityWeight = { 'haute': 3, 'moyenne': 2, 'basse': 1 };
        const statusOrder = { 'a_faire': 1, 'en_cours': 2, 'en_attente': 3, 'termine': 4 };
        return [...filteredTasks].sort((a, b) => {
            switch (sortBy) {
                case 'echeance': return new Date(a.date_echeance) - new Date(b.date_echeance);
                case 'priorite': return priorityWeight[b.priorite] - priorityWeight[a.priorite] || new Date(a.date_echeance) - new Date(b.date_echeance);
                case 'statut': return statusOrder[a.statut] - statusOrder[b.statut];
                default: return 0;
            }
        });
    }, [filteredTasks, sortBy]);

    // Statistiques
    const stats = useMemo(() => ({
        total: tasks.length,
        a_faire: tasks.filter(t => t.statut === 'a_faire').length,
        en_cours: tasks.filter(t => t.statut === 'en_cours').length,
        en_attente: tasks.filter(t => t.statut === 'en_attente').length,
        termine: tasks.filter(t => t.statut === 'termine').length,
        haute_priorite: tasks.filter(t => t.priorite === 'haute').length,
        heures_estimees: tasks.reduce((acc, t) => acc + t.estimated_hours, 0),
        heures_reelles: tasks.reduce((acc, t) => acc + t.actual_hours, 0)
    }), [tasks]);

    // Icônes et labels pour statuts et priorités
    const getStatusIcon = (statut) => {
        switch (statut) {
            case 'a_faire': return <RadioButtonUnchecked className="text-gray-400" />;
            case 'en_cours': return <PlayArrow className="text-blue-500" />;
            case 'en_attente': return <Pause className="text-yellow-500" />;
            case 'termine': return <CheckCircle className="text-green-500" />;
            default: return <RadioButtonUnchecked className="text-gray-400" />;
        }
    };
    const getStatusInfo = (statut) => ({
        a_faire: { color: 'bg-gray-100 text-gray-700', label: 'À faire' },
        en_cours: { color: 'bg-blue-100 text-blue-700', label: 'En cours' },
        en_attente: { color: 'bg-yellow-100 text-yellow-700', label: 'En attente' },
        termine: { color: 'bg-green-100 text-green-700', label: 'Terminé' }
    }[statut] || { color: 'bg-gray-100 text-gray-700', label: statut });
    const getPriorityInfo = (priorite) => ({
        haute: { color: 'bg-red-100 text-red-700', icon: <PriorityHigh className="text-red-600" />, label: 'Haute' },
        moyenne: { color: 'bg-orange-100 text-orange-700', icon: <Flag className="text-orange-600" />, label: 'Moyenne' },
        basse: { color: 'bg-green-100 text-green-700', icon: <Flag className="text-green-600" />, label: 'Basse' }
    }[priorite] || { color: 'bg-gray-100 text-gray-700', icon: <Flag className="text-gray-600" />, label: priorite });

    // Vue Kanban
    if (viewMode === 'kanban') {
        const columns = {
            a_faire: { title: 'À faire', tasks: sortedTasks.filter(t => t.statut === 'a_faire'), color: 'gray' },
            en_cours: { title: 'En cours', tasks: sortedTasks.filter(t => t.statut === 'en_cours'), color: 'blue' },
            en_attente: { title: 'En attente', tasks: sortedTasks.filter(t => t.statut === 'en_attente'), color: 'yellow' },
            termine: { title: 'Terminé', tasks: sortedTasks.filter(t => t.statut === 'termine'), color: 'green' }
        };
        return (
            <div className='w-full bg-gray-200 p-4'>
                <div className="flex gap-4 items-center mb-6 p-4">
                    <button onClick={() => setViewMode('list')} className="text-black font-bold hover:text-blue-800"><ArrowBack /></button>
                    <h2 className="text-xl font-bold text-gray-800">Tableau Kanban</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Object.entries(columns).map(([key, column]) => (
                        <div key={key} className="bg-gray-50 rounded-lg p-4">
                            <h3 className={`font-bold mb-4 text-${column.color}-600`}>{column.title} ({column.tasks.length})</h3>
                            <div className="space-y-3">
                                {column.tasks.map(task => (
                                    <div key={task.id} className="bg-white rounded-lg shadow-sm p-3 hover:shadow-md transition-shadow cursor-pointer"
                                        onClick={() => { setSelectedTask(task); setIsDetailsModalOpen(true); }}>
                                        <h4 className="font-medium text-gray-800 mb-1">{task.titre}</h4>
                                        <p className="text-xs text-gray-500 mb-2">{task.phase}</p>
                                        <div className="flex justify-between items-center text-xs">
                                            <span className="flex items-center gap-1"><Person fontSize="small" className="text-gray-400" />{task.assignee}</span>
                                            <span className={`px-2 py-1 rounded-full ${task.priorite === 'haute' ? 'bg-red-100 text-red-700' :
                                                task.priorite === 'moyenne' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
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
        );
    }

    // Vue calendrier
    if (viewMode === 'calendar') {
        return <TaskCalendar tasks={tasks} onTaskClick={(task) => { setSelectedTask(task); setIsDetailsModalOpen(true); }} />;
    }

    // Vue liste par défaut
    return (
        <div className="w-full bg-gray-200 p-4">
            {/* Header, statistiques, barre de recherche, liste des tâches ... */}
            {/* [Tu peux réutiliser la même logique que ton code original ici] */}
            {/* Modals */}
            <ModalAddTask isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddTask} members={members} phases={phases} tasks={tasks} />
            <ModalEditTask isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setTaskToEdit(null); }} onSave={handleEditTask} taskToEdit={taskToEdit} members={members} phases={phases} tasks={tasks} />
            <TaskDetails isOpen={isDetailsModalOpen} onClose={() => { setIsDetailsModalOpen(false); setSelectedTask(null); }} task={selectedTask} onUpdateStatus={handleUpdateTaskStatus} onToggleSubtask={handleToggleSubtask} members={members} />
        </div>
    );
};

export default TachesContent;