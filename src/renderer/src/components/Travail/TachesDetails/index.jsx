import React, { useState } from 'react';
import {
    Close,
    Assignment,
    Person,
    CalendarToday,
    Flag,
    Comment,
    Add,
    CheckCircle,
    RadioButtonUnchecked,
    PlayArrow,
    Pause,
    Schedule,
    AttachMoney,
    Link
} from "@mui/icons-material";

const TachesDetails = ({ isOpen, onClose, task, onUpdateStatus, onToggleSubtask, members }) => {
    const [newComment, setNewComment] = useState('');

    if (!isOpen || !task) return null;

    const handleAddComment = () => {
        if (newComment.trim()) {
            // Logique pour ajouter un commentaire
            setNewComment('');
        }
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
                return null;
        }
    };

    const getStatusColor = (statut) => {
        switch (statut) {
            case 'a_faire':
                return 'bg-gray-100 text-gray-700';
            case 'en_cours':
                return 'bg-blue-100 text-blue-700';
            case 'en_attente':
                return 'bg-yellow-100 text-yellow-700';
            case 'termine':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityColor = (priorite) => {
        switch (priorite) {
            case 'haute':
                return 'bg-red-100 text-red-700';
            case 'moyenne':
                return 'bg-orange-100 text-orange-700';
            case 'basse':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getMemberName = (memberId) => {
        const member = members.find(m => m.id === memberId);
        return member ? member.nom : task.assignee;
    };

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold flex items-center gap-2">
                        <Assignment />
                        Détails de la tâche
                    </h2>
                    <button onClick={onClose} className="text-white hover:bg-blue-700 p-1 rounded-full">
                        <Close />
                    </button>
                </div>

                <div className="p-6">
                    {/* En-tête avec statut et priorité */}
                    <div className="flex justify-between items-start mb-6">
                        <h3 className="text-2xl font-bold text-gray-800">{task.titre}</h3>
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.statut)}`}>
                                {getStatusIcon(task.statut)}
                                {task.statut}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priorite)}`}>
                                <Flag fontSize="small" className="inline mr-1" />
                                {task.priorite}
                            </span>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <h4 className="font-medium text-gray-700 mb-2">Description</h4>
                        <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{task.description}</p>
                    </div>

                    {/* Métriques */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Assigné à</p>
                            <p className="font-medium flex items-center gap-1">
                                <Person fontSize="small" className="text-blue-600" />
                                {getMemberName(task.assigneeId)}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Phase</p>
                            <p className="font-medium">{task.phase}</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Échéance</p>
                            <p className="font-medium flex items-center gap-1">
                                <CalendarToday fontSize="small" className="text-orange-600" />
                                {new Date(task.date_echeance).toLocaleDateString('fr-FR')}
                            </p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3">
                            <p className="text-xs text-gray-500">Temps estimé</p>
                            <p className="font-medium flex items-center gap-1">
                                <Schedule fontSize="small" className="text-green-600" />
                                {task.estimated_hours}h
                            </p>
                        </div>
                    </div>

                    {/* Sous-tâches */}
                    {task.sous_taches && task.sous_taches.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-700 mb-3">Sous-tâches</h4>
                            <div className="space-y-2">
                                {task.sous_taches.map((st) => (
                                    <div key={st.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                                        <button onClick={() => onToggleSubtask(task.id, st.id)}>
                                            {st.completed ? (
                                                <CheckCircle className="text-green-500" />
                                            ) : (
                                                <RadioButtonUnchecked className="text-gray-400" />
                                            )}
                                        </button>
                                        <span className={st.completed ? 'line-through text-gray-400' : 'text-gray-700'}>
                                            {st.titre}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Dépendances */}
                    {task.dependances && task.dependances.length > 0 && (
                        <div className="mb-6">
                            <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                                <Link className="text-blue-600" />
                                Dépendances
                            </h4>
                            <div className="space-y-2">
                                {task.dependances.map((depId) => {
                                    // Logique pour trouver la tâche dépendante
                                    return (
                                        <div key={depId} className="p-2 bg-gray-50 rounded-lg text-sm">
                                            Tâche #{depId}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Commentaires */}
                    <div className="mb-6">
                        <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                            <Comment className="text-blue-600" />
                            Commentaires
                        </h4>

                        {task.commentaires && task.commentaires.length > 0 ? (
                            <div className="space-y-3 mb-4">
                                {task.commentaires.map((comment) => (
                                    <div key={comment.id} className="bg-gray-50 rounded-lg p-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-medium text-sm">{comment.auteur}</span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(comment.date).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600">{comment.texte}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-400 italic mb-4">Aucun commentaire</p>
                        )}

                        {/* Ajout de commentaire */}
                        <div className="flex gap-2">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Ajouter un commentaire..."
                                className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                                rows="2"
                            />
                            <button
                                onClick={handleAddComment}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 self-end">
                                <Add />
                            </button>
                        </div>
                    </div>

                    {/* Actions sur le statut */}
                    <div className="border-t pt-4 flex justify-between items-center">
                        <div className="flex gap-2">
                            <button
                                onClick={() => onUpdateStatus(task.id, 'a_faire')}
                                className={`px-3 py-1 rounded-lg text-sm ${task.statut === 'a_faire' ? 'bg-gray-600 text-white' : 'bg-gray-200'
                                    }`}>
                                À faire
                            </button>
                            <button
                                onClick={() => onUpdateStatus(task.id, 'en_cours')}
                                className={`px-3 py-1 rounded-lg text-sm ${task.statut === 'en_cours' ? 'bg-blue-600 text-white' : 'bg-blue-200'
                                    }`}>
                                En cours
                            </button>
                            <button
                                onClick={() => onUpdateStatus(task.id, 'en_attente')}
                                className={`px-3 py-1 rounded-lg text-sm ${task.statut === 'en_attente' ? 'bg-yellow-600 text-white' : 'bg-yellow-200'
                                    }`}>
                                En attente
                            </button>
                            <button
                                onClick={() => onUpdateStatus(task.id, 'termine')}
                                className={`px-3 py-1 rounded-lg text-sm ${task.statut === 'termine' ? 'bg-green-600 text-white' : 'bg-green-200'
                                    }`}>
                                Terminé
                            </button>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TachesDetails;