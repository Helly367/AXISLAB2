import React, { useState, useEffect } from 'react';
import {
    Close,
    Warning,
    Assignment,
    CheckCircle,
    Block,
    Add,
    Delete,
    Person,
    CalendarToday,
    Comment
} from "@mui/icons-material";

const RiskDetails = ({ isOpen, onClose, risk, onUpdate }) => {
    const [actions, setActions] = useState([]);
    const [newAction, setNewAction] = useState('');
    const [comment, setComment] = useState('');

    // Synchroniser actions si le risque change
    useEffect(() => {
        if (risk) {
            setActions(risk.actions || []);
        }
    }, [risk]);

    if (!isOpen || !risk) return null;

    const handleToggleAction = (actionId) => {
        const updatedActions = actions.map(a =>
            a.id === actionId ? { ...a, completed: !a.completed } : a
        );
        setActions(updatedActions);
        onUpdate({ ...risk, actions: updatedActions });
    };

    const handleAddAction = () => {
        if (!newAction.trim()) return;

        const newActionObj = {
            id: Date.now(),
            description: newAction.trim(),
            completed: false
        };

        const updatedActions = [...actions, newActionObj];
        setActions(updatedActions);
        onUpdate({ ...risk, actions: updatedActions });
        setNewAction('');
    };

    const handleDeleteAction = (actionId) => {
        const updatedActions = actions.filter(a => a.id !== actionId);
        setActions(updatedActions);
        onUpdate({ ...risk, actions: updatedActions });
    };

    const handleAddComment = () => {
        if (!comment.trim()) return;

        const updatedComments = risk.commentaires
            ? `${risk.commentaires}\n[${new Date().toLocaleDateString('fr-FR')}] ${comment.trim()}`
            : `[${new Date().toLocaleDateString('fr-FR')}] ${comment.trim()}`;

        onUpdate({ ...risk, commentaires: updatedComments });
        setComment('');
    };

    const levelColor = {
        critique: 'bg-red-600',
        élevé: 'bg-orange-500',
        moyen: 'bg-yellow-500',
        faible: 'bg-green-500'
    };

    const statusIcon = {
        actif: <Warning className="text-red-600" />,
        en_traitement: <Assignment className="text-yellow-600" />,
        resolu: <CheckCircle className="text-green-600" />,
        ignore: <Block className="text-gray-600" />
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 flex justify-between items-center sticky top-0 z-10">
                    <h2 className="text-xl text-white font-bold flex items-center gap-2">
                        <Warning /> Détails du risque
                    </h2>
                    <button onClick={onClose} className="text-white hover:bg-red-700 p-1 rounded-full">
                        <Close />
                    </button>
                </div>

                <div className="p-6">
                    {/* En-tête avec statut et niveau */}
                    <div className="flex items-start justify-between mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{risk.nom}</h3>
                            <p className="text-gray-600">{risk.description}</p>
                        </div>
                        <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${levelColor[risk.niveau]}`}>
                                {risk.niveau?.toUpperCase()}
                            </span>
                            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium flex items-center gap-1">
                                {statusIcon[risk.statut]}
                                {risk.statut}
                            </span>
                        </div>
                    </div>

                    {/* Métriques */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm text-gray-500 mb-2">Probabilité</h4>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div className="bg-blue-500 rounded-full h-3" style={{ width: `${risk.probabilite * 100}%` }} />
                                    </div>
                                </div>
                                <span className="text-lg font-bold">{(risk.probabilite * 100).toFixed(0)}%</span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h4 className="text-sm text-gray-500 mb-2">Impact</h4>
                            <div className="flex items-center gap-4">
                                <div className="flex-1">
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div className="bg-orange-500 rounded-full h-3" style={{ width: `${risk.impact * 100}%` }} />
                                    </div>
                                </div>
                                <span className="text-lg font-bold">{(risk.impact * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Plans de mitigation et contingence */}
                    <div className="grid grid-cols-2 gap-6 mb-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-medium text-blue-700 mb-2 flex items-center gap-2">
                                <Assignment fontSize="small" /> Plan de mitigation
                            </h4>
                            <p className="text-sm text-blue-600">{risk.plan_mitigation}</p>
                        </div>

                        <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="font-medium text-purple-700 mb-2 flex items-center gap-2">
                                <Assignment fontSize="small" /> Plan de contingence
                            </h4>
                            <p className="text-sm text-purple-600">{risk.plan_contingence}</p>
                        </div>
                    </div>

                    {/* Responsable et dates */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Responsable</p>
                                <p className="font-medium flex items-center gap-1">
                                    <Person fontSize="small" className="text-blue-600" />
                                    {risk.responsable}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Identifié le</p>
                                <p className="font-medium flex items-center gap-1">
                                    <CalendarToday fontSize="small" className="text-orange-600" />
                                    {new Date(risk.date_identification).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Dernière révision</p>
                                <p className="font-medium flex items-center gap-1">
                                    <CalendarToday fontSize="small" className="text-green-600" />
                                    {new Date(risk.date_revision).toLocaleDateString('fr-FR')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Actions de mitigation */}
                    <div className="mb-6">
                        <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <Assignment className="text-blue-600" /> Actions de mitigation
                        </h4>

                        <div className="space-y-2 mb-4">
                            {actions.map((action) => (
                                <div key={action.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3 flex-1">
                                        <button
                                            onClick={() => handleToggleAction(action.id)}
                                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${action.completed ? 'bg-green-500 border-green-500' : 'border-gray-400'}`}>
                                            {action.completed && <span className="text-white text-xs">✓</span>}
                                        </button>
                                        <span className={action.completed ? 'line-through text-gray-400' : 'text-gray-700'}>
                                            {action.description}
                                        </span>
                                    </div>
                                    <button onClick={() => handleDeleteAction(action.id)} className="text-red-500 hover:text-red-700">
                                        <Delete fontSize="small" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newAction}
                                onChange={(e) => setNewAction(e.target.value)}
                                placeholder="Nouvelle action de mitigation..."
                                className="flex-1 p-2 border-2 border-gray-400 rounded-md focus:outline-blue-600"
                            />
                            <button
                                onClick={handleAddAction}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-1">
                                <Add fontSize="small" /> Ajouter
                            </button>
                        </div>
                    </div>

                    {/* Commentaires */}
                    <div className="border-t pt-4">
                        <h4 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                            <Comment className="text-blue-600" /> Commentaires
                        </h4>

                        {risk.commentaires && (
                            <div className="bg-gray-50 rounded-lg p-4 mb-4 whitespace-pre-line">
                                {risk.commentaires}
                            </div>
                        )}

                        <div className="flex gap-2">
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Ajouter un commentaire..."
                                className="flex-1 p-2 border-2 border-gray-400 rounded-md"
                                rows={2}
                            />
                            <button
                                onClick={handleAddComment}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 self-end">
                                Ajouter
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6 pt-4 border-t">
                        <button onClick={onClose} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskDetails;