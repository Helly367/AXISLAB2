import React, { useState } from 'react';
import { Person, Add, Email, School, Work, Delete, Edit } from "@mui/icons-material";
import ModalAddMember from '../ModalAddMember';
import ModalEditMember from '../ModalEditMember';

const TeamList = ({ members, onAddMember, onEditMember, onDeleteMember }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [memberToEdit, setMemberToEdit] = useState(null);

    const handleOpenEditModal = (member) => {
        setMemberToEdit(member);
        setIsEditModalOpen(true);
    };

    // Couleurs aléatoires mais cohérentes pour les avatars
    const getAvatarColor = (name) => {
        const colors = [
            'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
            'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    // Initiales du nom
    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="w-full">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue to-blue-800 rounded-lg shadow-md p-4 flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">

                    <h1 className="text-xl text-white font-bold">Équipe projet ({members.length})</h1>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-white text-blue px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md">
                    <Add /> Ajouter un membre
                </button>
            </div>

            {/* Grille des membres */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {members.map((member) => (
                    <div
                        key={member.id}
                        className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col items-center relative group">

                        {/* Boutons d'action (apparaissent au hover) */}
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleOpenEditModal(member)}
                                className="p-2 bg-blue-100 text-blue rounded-full hover:bg-blue-200 transition-colors">
                                <Edit fontSize="small" />
                            </button>
                            <button
                                onClick={() => onDeleteMember(member.id)}
                                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors">
                                <Delete fontSize="small" />
                            </button>
                        </div>

                        {/* Avatar avec photo ou initiales */}
                        <div className={`w-28 h-28 ${member.photo ? '' : getAvatarColor(member.nom)} rounded-full flex items-center justify-center mb-4 overflow-hidden border-4 border-blue-100`}>
                            {member.photo ? (
                                <img
                                    src={member.photo}
                                    alt={member.nom}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-white text-3xl font-bold">
                                    {getInitials(member.nom)}
                                </span>
                            )}
                        </div>

                        {/* Informations */}
                        <h3 className="text-xl font-bold text-gray-800 text-center">{member.nom}</h3>

                        <div className="flex items-center gap-1 mt-1 text-blue">
                            <Work fontSize="small" />
                            <p className="text-sm font-medium">{member.poste}</p>
                        </div>

                        {/* Compétences */}
                        <div className="mt-4 w-full">
                            <div className="flex items-center gap-1 text-gray-600 mb-2">
                                <School fontSize="small" />
                                <span className="text-sm font-medium">Compétences</span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {member.competences.map((comp, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-blue-100 text-blue text-xs rounded-full font-medium">
                                        {comp}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Email (optionnel) */}
                        {member.email && (
                            <div className="mt-4 flex items-center gap-1 text-gray-500 text-sm">
                                <Email fontSize="small" />
                                <a href={`mailto:${member.email}`} className="hover:text-blue">
                                    {member.email}
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Message si aucun membre */}
            {members.length === 0 && (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <Person className="text-gray-400 text-6xl mx-auto mb-4" />
                    <h3 className="text-xl text-gray-600 font-medium mb-2">Aucun membre dans l'équipe</h3>
                    <p className="text-gray-500 mb-6">Commencez par ajouter des membres à votre projet</p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                        <Add /> Ajouter un membre
                    </button>
                </div>
            )}

            {/* Modals */}
            <ModalAddMember
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={onAddMember}
            />

            <ModalEditMember
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setMemberToEdit(null);
                }}
                onSave={onEditMember}
                memberToEdit={memberToEdit}
            />
        </div>
    );
};

export default TeamList;