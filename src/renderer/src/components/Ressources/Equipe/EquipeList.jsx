import React, { useState, useMemo } from 'react';
import {
    Add, Email, School, Work, Delete, Edit, History
} from "@mui/icons-material";
import AjouterMembre from './AjouteMembre';
import ModifyMembre from './ModifyMembre';
import MemberHistory from './MemberHistory';
import AvailabilityChart from './AvailabilityChart';

const EquipeList = ({
    members = [],
    onAddMember,
    onEditMember,
    onDeleteMember,
    onUpdateAvailability,
    viewMode
}) => {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

    const [memberToEdit, setMemberToEdit] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    const [filter, setFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    /* ===============================
       UTILITIES
    =============================== */

    const getAvatarColor = (name = "") => {
        const colors = [
            'bg-red-500', 'bg-blue-500', 'bg-green-500',
            'bg-yellow-500', 'bg-purple-500', 'bg-pink-500',
            'bg-indigo-500', 'bg-teal-500'
        ];

        if (!name) return colors[0];

        return colors[name.charCodeAt(0) % colors.length];
    };

    const getInitials = (name = "") => {
        if (!name) return "?";

        return name
            .split(' ')
            .map(n => n?.[0] || "")
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getAvailabilityColor = (dispo = 0) => {
        if (dispo >= 80) return 'text-green-600 bg-green-100';
        if (dispo >= 50) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getChargeColor = (charge = 0, max = 1) => {

        if (!max) return 'text-gray-600';

        const ratio = (charge / max) * 100;

        if (ratio <= 50) return 'text-green-600';
        if (ratio <= 80) return 'text-yellow-600';

        return 'text-red-600';
    };

    /* ===============================
       FILTERED MEMBERS (MEMOIZED ⭐)
    =============================== */

    const filteredMembers = useMemo(() => {

        return members.filter(member => {

            if (!member) return false;

            if (filter !== 'all' && member.disponibilite < parseInt(filter))
                return false;

            if (searchTerm) {

                const search = searchTerm.toLowerCase();

                return (
                    member.nom?.toLowerCase().includes(search) ||
                    member.poste?.toLowerCase().includes(search)
                );
            }

            return true;

        });

    }, [members, filter, searchTerm]);

    /* ===============================
       RENDER VIEW
    =============================== */


    const renderContent = () => {

        if (viewMode === 'grid') {

            return (
                <div className="space-y-6">

                    {/* Search + Filter */}
                    <div className="bg-white rounded-lg shadow-md p-4 flex flex-wrap gap-4">

                        <input
                            type="text"
                            placeholder="Rechercher un membre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 p-2 border-2 border-gray-300 rounded-md"
                        />

                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="all">Tous</option>
                            <option value="80">Disponibilité ≥ 80%</option>
                            <option value="50">Disponibilité ≥ 50%</option>
                            <option value="30">Disponibilité ≥ 30%</option>
                        </select>

                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                        >
                            <Add /> Ajouter
                        </button>

                    </div>

                    {/* Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                        {filteredMembers.map(member => {

                            if (!member) return null;

                            return (
                                <div key={member.id}
                                    className="bg-white rounded-lg shadow-md p-6 relative group">

                                    <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">

                                        <button
                                            onClick={() => {
                                                setSelectedMember(member);
                                                setIsHistoryModalOpen(true);
                                            }}
                                            className="p-2 bg-purple-100 text-purple-600 rounded-full"
                                        >
                                            <History fontSize="small" />
                                        </button>

                                        <button
                                            onClick={() => {
                                                setMemberToEdit(member);
                                                setIsEditModalOpen(true);
                                            }}
                                            className="p-2 bg-blue-100 text-blue-600 rounded-full"
                                        >
                                            <Edit fontSize="small" />
                                        </button>

                                        <button
                                            onClick={() => onDeleteMember(member.id)}
                                            className="p-2 bg-red-100 text-red-600 rounded-full"
                                        >
                                            <Delete fontSize="small" />
                                        </button>

                                    </div>

                                    {/* Avatar */}
                                    <div className={`w-24 h-24 ${getAvatarColor(member.nom)} rounded-full mx-auto mb-4 flex items-center justify-center`}>
                                        {member.photo ? (
                                            <img src={member.photo} alt="" className="w-full h-full object-cover rounded-full" />
                                        ) : (
                                            <span className="text-white text-2xl font-bold">
                                                {getInitials(member.nom)}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-bold text-center">
                                        {member.nom || "Inconnu"}
                                    </h3>

                                    <p className="text-blue-600 text-center">
                                        {member.poste}
                                    </p>

                                    <p className="text-gray-500 text-sm text-center">
                                        {member.role}
                                    </p>

                                </div>
                            );
                        })}

                    </div>
                </div>
            );
        }

        if (viewMode === 'table') {
            return <div>Table View</div>;
        }

        return (
            <AvailabilityChart
                members={members}
                onUpdateAvailability={onUpdateAvailability}
                onAddMember={() => setIsAddModalOpen(true)}
            />
        );
    };

    return (

        <div className="w-full">

            {/* Message si aucun membre */}
            {(!members || members.length === 0) && (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <p className="text-gray-500 text-lg font-medium">
                        Aucun membre n’a encore été ajouté
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                        Cliquez sur le bouton Ajouter pour commencer à constituer l’équipe
                    </p>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Ajouter un membre
                    </button>
                </div>
            )}

            {/* Contenu de la liste ou grid */}
            {members && members.length > 0 && renderContent()}

            {/* Modals */}
            <AjouterMembre
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={onAddMember}
            />

            <ModifyMembre
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                onSave={onEditMember}
                memberToEdit={memberToEdit}
            />

            <MemberHistory
                isOpen={isHistoryModalOpen}
                onClose={() => setIsHistoryModalOpen(false)}
                member={selectedMember}
            />

        </div>

    );
};

export default EquipeList;