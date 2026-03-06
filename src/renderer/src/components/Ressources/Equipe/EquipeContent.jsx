import React, { useState, useMemo } from 'react';
import EquipeList from './EquipeList';

const EquipeContnent = ({ projet }) => {

    const [members, setMembers] = useState([]); // ton dataset reste identique

    const [viewMode, setViewMode] = useState('grid');

    /* ===============================
       HANDLERS
    =============================== */

    const handleAddMember = (newMember) => {
        setMembers(prev => [
            ...prev,
            { ...newMember, id: Date.now(), historique: [] }
        ]);
    };

    const handleEditMember = (updatedMember) => {
        setMembers(prev =>
            prev.map(m =>
                m.id === updatedMember.id ? updatedMember : m
            )
        );
    };

    const handleDeleteMember = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) {
            setMembers(prev => prev.filter(m => m.id !== id));
        }
    };

    const handleUpdateAvailability = (memberId, disponibilite) => {
        setMembers(prev =>
            prev.map(m =>
                m.id === memberId
                    ? { ...m, disponibilite }
                    : m
            )
        );
    };

    /* ===============================
       STATISTIQUES (MEMOIZED ⭐)
    =============================== */

    const teamStats = useMemo(() => {

        if (!members.length) {
            return {
                total: 0,
                disponibiliteMoyenne: 0,
                chargeMoyenne: 0,
                competencesManquantes: []
            };
        }

        const total = members.length;

        const disponibiliteMoyenne = Math.round(
            members.reduce((acc, m) =>
                acc + (m.disponibilite || 0), 0
            ) / total
        );

        const chargeMoyenne = Math.round(
            members.reduce((acc, m) => {
                if (!m.chargeMax) return acc;

                return acc + ((m.chargeActuelle || 0) / m.chargeMax * 100);
            }, 0) / total
        );

        return {
            total,
            disponibiliteMoyenne,
            chargeMoyenne,
            competencesManquantes: identifyMissingSkills(members)
        };

    }, [members]);

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="max-w-8xl mx-auto px-4 py-2">

                {/* Header stats */}
                <div className="bg-primary rounded-lg shadow-md p-4 mb-6">

                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-xl text-white font-bold">
                            Équipe projet
                        </h1>

                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`px-4 py-2 rounded-lg ${viewMode === 'grid'
                                    ? 'bg-white text-blue-600'
                                    : 'bg-blue-700 text-white'}`}>
                                Vue Grille
                            </button>

                            <button
                                onClick={() => setViewMode('table')}
                                className={`px-4 py-2 rounded-lg ${viewMode === 'table'
                                    ? 'bg-white text-blue-600'
                                    : 'bg-blue-700 text-white'}`}>
                                Vue Tableau
                            </button>

                            <button
                                onClick={() => setViewMode('availability')}
                                className={`px-4 py-2 rounded-lg ${viewMode === 'availability'
                                    ? 'bg-white text-blue-600'
                                    : 'bg-blue-700 text-white'}`}>
                                Disponibilités
                            </button>
                        </div>
                    </div>

                    {/* Stats cards */}
                    <div className="grid md:grid-cols-4 gap-4">

                        <StatCard
                            label="Total membres"
                            value={teamStats.total}
                        />

                        <StatCard
                            label="Disponibilité moyenne"
                            value={`${teamStats.disponibiliteMoyenne}%`}
                        />

                        <StatCard
                            label="Charge moyenne"
                            value={`${teamStats.chargeMoyenne}%`}
                        />

                        <StatCard
                            label="Compétences manquantes"
                            value={teamStats.competencesManquantes.length}
                        />

                    </div>
                </div>

                {/* Team List */}
                <EquipeList
                    members={members}
                    onAddMember={handleAddMember}
                    onEditMember={handleEditMember}
                    onDeleteMember={handleDeleteMember}
                    onUpdateAvailability={handleUpdateAvailability}
                    viewMode={viewMode}
                />

            </div>
        </div>
    );
};

/* ===============================
   UTILS
=============================== */

const identifyMissingSkills = (members) => {

    const allSkills = new Set();
    const requiredSkills = new Set();

    members.forEach(member => {

        (member.competences || []).forEach(skill =>
            allSkills.add(skill)
        );

        (member.competencesRequises || []).forEach(skill =>
            requiredSkills.add(skill)
        );
    });

    return [...requiredSkills].filter(skill =>
        !allSkills.has(skill)
    );
};

const StatCard = ({ label, value }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm">
        <p className="text-primary text-sm">{label}</p>
        <p className="text-primary text-2xl font-bold">{value}</p>
    </div>
);

export default EquipeContnent;