import React, { useState, useMemo } from 'react';
import { Flag, Add, Edit, Delete, CalendarToday } from "@mui/icons-material";
import AddJalon from './ModalAddJalon';
import EditJalon from './ModalEditJalon';
import { useJalon } from '../../../../hooks/useJalon';
import DeleteConfirm from '../../../widjets/DeleteConfirm';

const JalonContnent = ({ phases, project }) => {
    const { jalons, deleteJalon } = useJalon();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [jalonToEdite, setJalonToEdite] = useState(null);
    const [filterPhase, setFilterPhase] = useState('all');
    const [openDelete, setOpenDelete] = useState(false);
    const [titre, setTitle] = useState('');

    // Map phases pour accès rapide O(1)
    const phaseMap = useMemo(() => {
        const map = {};
        phases.forEach(p => {
            map[p.phase_id] = p;
        });
        return map;
    }, [phases]);


    const getPhaseName = (phase_id) => {
        return phaseMap[phase_id]?.title || 'Inconnue';
    };

    const getPhaseColor = (phase_id) => {
        return phaseMap[phase_id]?.couleur || '#6B7280';
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

    const filteredJalons = useMemo(() => {
        if (filterPhase === 'all') return jalons;
        return jalons.filter(
            m => m.phaseId === Number(filterPhase)
        );
    }, [jalons, filterPhase]);

    const sortedMilestones = useMemo(() => {
        return [...filteredJalons].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
        );
    }, [filteredJalons]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);


    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <Flag className="text-blue-600" />
                    Jalons du projet ({jalons.length})
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
                        <option key={phase.phase_id} value={phase.phase_id}>
                            {phase.title}
                        </option>
                    ))}
                </select>
            </div>

            {sortedMilestones.length > 0 ? (
                <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                    <div className="space-y-6">
                        {sortedMilestones.map((jalon) => {
                            const phaseColor = getPhaseColor(jalon.phase_id);
                            const date = new Date(jalon.date);
                            date.setHours(0, 0, 0, 0);

                            const isPast = date < today;
                            const isToday = date.getTime() === today.getTime();

                            return (
                                <div key={jalon.jalon_id} className="relative flex items-start gap-6">
                                    <div
                                        className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl z-10 ${isPast ? 'bg-gray-200'
                                            : isToday ? 'bg-green-100'
                                                : 'bg-blue-100'
                                            }`}
                                        style={{ border: `3px solid ${phaseColor}` }}>
                                        {getTypeIcon(jalon.type)}
                                    </div>

                                    <div className="flex-1 bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">
                                                    {jalon.title}
                                                </h3>
                                                <p className="text-sm text-primary font-bold">
                                                    Phase :  {getPhaseName(jalon.phase_id)}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setJalonToEdite(jalon);
                                                        setIsEditModalOpen(true);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                                    <Edit fontSize="small" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setJalonToEdite(jalon);
                                                        setTitle(jalon.title);
                                                        setOpenDelete(true);

                                                    }}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                                                    <Delete fontSize="small" />
                                                </button>
                                            </div>
                                        </div>

                                        <p className="text-gray-700 mb-3">{jalon.description}</p>

                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-2">
                                                <CalendarToday className="text-gray-400" fontSize="small" />
                                                <span className={`text-sm font-medium ${isPast ? 'text-gray-500'
                                                    : isToday ? 'text-green-600'
                                                        : 'text-blue-600'
                                                    }`}>
                                                    {new Date(jalon.date).toLocaleDateString('fr-FR', {
                                                        weekday: 'long',
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>

                                            <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium">
                                                {getTypeLabel(jalon.type)}
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

            <AddJalon
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                phases={phases}
                project={project}
            />

            <EditJalon
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setJalonToEdite(null);
                }}
                jalonToEdite={jalonToEdite}
                phases={phases}
            />

            <DeleteConfirm
                title={`Voulez-vous vraiment supprimer le jalon ${titre}`}
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                onConfirm={() => {
                    deleteJalon(jalonToEdite.jalon_id, jalonToEdite);
                    setOpenDelete(false);
                }} />
        </div>
    );
};

export default JalonContnent;