import React, { useState, useMemo } from 'react';
import { Flag, Add, Edit, Delete, CalendarToday } from "@mui/icons-material";
import ModalAddMilestone from './ModalAddMilestone';
import ModalEditMilestone from './ModalEditMilestone';

const MilestonesList = ({ phases = [], milestones = [], onUpdateMilestones }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [milestoneToEdit, setMilestoneToEdit] = useState(null);
    const [filterPhase, setFilterPhase] = useState('all');

    // Map phases pour accès rapide O(1)
    const phaseMap = useMemo(() => {
        const map = {};
        phases.forEach(p => {
            map[p.id] = p;
        });
        return map;
    }, [phases]);

    const handleAddMilestone = (newMilestone) => {
        const id = Date.now();
        onUpdateMilestones([...milestones, { ...newMilestone, id }]);
    };

    const handleEditMilestone = (updatedMilestone) => {
        onUpdateMilestones(
            milestones.map(m =>
                m.id === updatedMilestone.id ? updatedMilestone : m
            )
        );
    };

    const handleDeleteMilestone = (id) => {
        if (!window.confirm('Supprimer ce jalon ?')) return;
        onUpdateMilestones(milestones.filter(m => m.id !== id));
    };

    const getPhaseName = (phaseId) => {
        return phaseMap[phaseId]?.title || 'Inconnue';
    };

    const getPhaseColor = (phaseId) => {
        return phaseMap[phaseId]?.couleur || '#6B7280';
    };

    const getTypeIcon = (type) => {
        const icons = {
            validation: '✅',
            revue: '📋',
            livrable: '📦'
        };
        return icons[type] || '📍';
    };

    const getTypeLabel = (type) => {
        const labels = {
            validation: 'Validation',
            revue: 'Revue',
            livrable: 'Livrable'
        };
        return labels[type] || type;
    };

    const filteredMilestones = useMemo(() => {
        if (filterPhase === 'all') return milestones;
        return milestones.filter(
            m => m.phaseId === Number(filterPhase)
        );
    }, [milestones, filterPhase]);

    const sortedMilestones = useMemo(() => {
        return [...filteredMilestones].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );
    }, [filteredMilestones]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Flag className="text-blue-600" />
                    Jalons du projet ({milestones.length})
                </h2>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Add /> Ajouter un jalon
                </button>
            </div>

            <div className="mb-6 flex gap-4">
                <select
                    value={filterPhase}
                    onChange={(e) => setFilterPhase(e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    <option value="all">Toutes les phases</option>
                    {phases.map(phase => (
                        <option key={phase.id} value={phase.id}>
                            {phase.title}
                        </option>
                    ))}
                </select>
            </div>

            {sortedMilestones.length > 0 ? (
                <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    <div className="space-y-6">
                        {sortedMilestones.map((milestone) => {
                            const phaseColor = getPhaseColor(milestone.phaseId);
                            const date = new Date(milestone.date);
                            date.setHours(0, 0, 0, 0);

                            const isPast = date < today;
                            const isToday = date.getTime() === today.getTime();

                            return (
                                <div key={milestone.id} className="relative flex items-start gap-6">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl z-10 ${isPast ? 'bg-gray-200'
                                            : isToday ? 'bg-green-100'
                                                : 'bg-blue-100'
                                            }`}
                                        style={{ border: `3px solid ${phaseColor}` }}>
                                        {getTypeIcon(milestone.type)}
                                    </div>

                                    <div className="flex-1 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    {milestone.title}
                                                </h3>
                                                <p className="text-sm text-gray-600">
                                                    Phase: {getPhaseName(milestone.phaseId)}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setMilestoneToEdit(milestone);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                    <Edit fontSize="small" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteMilestone(milestone.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Delete fontSize="small" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-3">{milestone.description}</p>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <CalendarToday className="text-gray-400" fontSize="small" />
                                                <span className={`text-sm font-medium ${isPast ? 'text-gray-500'
                                                    : isToday ? 'text-green-600'
                                                        : 'text-blue-600'
                                                    }`}>
                                                    {new Date(milestone.date).toLocaleDateString('fr-FR', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium">
                                                {getTypeLabel(milestone.type)}
                                            </span>

                                            {isPast && (
                                                <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium text-gray-600">
                                                    Passé
                                                </span>
                                            )}

                                            {isToday && (
                                                <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-xs font-medium">
                                                    Aujourd'hui
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Flag className="text-gray-400 text-5xl mb-3" />
                    <p className="text-gray-500">Aucun jalon défini</p>
                    <p className="text-sm text-gray-400 mt-1">
                        Les jalons sont des événements clés dans le calendrier du projet
                    </p>
                </div>
            )}

            <ModalAddMilestone
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddMilestone}
                phases={phases}
            />

            <ModalEditMilestone
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setMilestoneToEdit(null);
                }}
                onSave={handleEditMilestone}
                milestoneToEdit={milestoneToEdit}
                phases={phases}
            />
        </div>
    );
};

export default MilestonesList;