import React, { useState } from 'react';
import {
    Person, Add, Email, School, Work, Delete, Edit,
    AccessTime, Warning, CheckCircle, History, Assignment,
    TrendingUp, Timeline, BarChart
} from "@mui/icons-material";
import ModalAddMember from '../ModalAddMember';
import ModalEditMember from '../ModalEditMember';
import MemberHistory from '../MemberHistory';
import AvailabilityChart from '../AvailabilityChart';

const TeamList = ({
    members,
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

    const handleOpenEditModal = (member) => {
        setMemberToEdit(member);
        setIsEditModalOpen(true);
    };

    const handleOpenHistory = (member) => {
        setSelectedMember(member);
        setIsHistoryModalOpen(true);
    };

    const getAvatarColor = (name) => {
        const colors = [
            'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
            'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const getInitials = (name) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getAvailabilityColor = (dispo) => {
        if (dispo >= 80) return 'text-green-600 bg-green-100';
        if (dispo >= 50) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    const getChargeColor = (charge, max) => {
        const ratio = (charge / max) * 100;
        if (ratio <= 50) return 'text-green-600';
        if (ratio <= 80) return 'text-yellow-600';
        return 'text-red-600';
    };

    // Filtrer les membres
    const filteredMembers = members.filter(member => {
        if (filter !== 'all' && member.disponibilite < parseInt(filter)) return false;
        if (searchTerm && !member.nom.toLowerCase().includes(searchTerm.toLowerCase()) &&
            !member.poste.toLowerCase().includes(searchTerm.toLowerCase())) return false;
        return true;
    });

    // Rendu conditionnel selon viewMode
    const renderContent = () => {
        if (viewMode === 'grid') {
            return (
                <>
                    {/* Barre de recherche et filtres */}
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-4">
                        <input
                            type="text"
                            placeholder="Rechercher un membre..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-400"
                        />
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="all">Tous les membres</option>
                            <option value="80">Disponibilité ≥ 80%</option>
                            <option value="50">Disponibilité ≥ 50%</option>
                            <option value="30">Disponibilité ≥ 30%</option>
                        </select>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Add /> Ajouter
                        </button>
                    </div>

                    {/* Grille */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 relative group">

                                {/* Boutons d'action */}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleOpenHistory(member)}
                                        className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
                                        title="Historique">
                                        <History fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => handleOpenEditModal(member)}
                                        className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                                        <Edit fontSize="small" />
                                    </button>
                                    <button
                                        onClick={() => onDeleteMember(member.id)}
                                        className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                                        <Delete fontSize="small" />
                                    </button>
                                </div>

                                {/* Avatar */}
                                <div className={`w-24 h-24 ${member.photo ? '' : getAvatarColor(member.nom)} rounded-full mx-auto mb-4 overflow-hidden border-4 border-blue-100`}>
                                    {member.photo ? (
                                        <img src={member.photo} alt={member.nom} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-white text-2xl font-bold">{getInitials(member.nom)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Informations principales */}
                                <h3 className="text-xl font-bold text-gray-800 text-center">{member.nom}</h3>
                                <p className="text-blue-600 font-medium text-center">{member.poste}</p>
                                <p className="text-gray-500 text-sm text-center mb-3">{member.role}</p>

                                {/* Disponibilité et charge */}
                                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-gray-600">Disponibilité</span>
                                        <span className={`text-sm font-bold px-2 py-1 rounded-full ${getAvailabilityColor(member.disponibilite)}`}>
                                            {member.disponibilite}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className={`rounded-full h-2 ${member.disponibilite >= 80 ? 'bg-green-500' :
                                                member.disponibilite >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                            style={{ width: `${member.disponibilite}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-xs text-gray-500">Charge actuelle</span>
                                        <span className={`text-xs font-medium ${getChargeColor(member.chargeActuelle, member.chargeMax)}`}>
                                            {member.chargeActuelle}h / {member.chargeMax}h
                                        </span>
                                    </div>
                                </div>

                                {/* Compétences */}
                                <div className="mb-3">
                                    <div className="flex items-center gap-1 text-gray-600 mb-2">
                                        <School fontSize="small" />
                                        <span className="text-sm font-medium">Compétences</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {member.competences.map((comp, index) => {
                                            const isRequired = member.competencesRequises?.includes(comp);
                                            return (
                                                <span
                                                    key={index}
                                                    className={`px-2 py-1 text-xs rounded-full ${isRequired
                                                        ? 'bg-green-100 text-green-700 border border-green-300'
                                                        : 'bg-blue-100 text-blue-700'
                                                        }`}
                                                    title={isRequired ? 'Compétence requise' : 'Compétence supplémentaire'}>
                                                    {comp}
                                                    {isRequired && ' ✓'}
                                                </span>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Email */}
                                {member.email && (
                                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                                        <Email fontSize="small" />
                                        <a href={`mailto:${member.email}`} className="hover:text-blue-600 truncate">
                                            {member.email}
                                        </a>
                                    </div>
                                )}

                                {/* Date d'arrivée */}
                                <div className="text-xs text-gray-400 mt-2">
                                    Membre depuis {new Date(member.dateDebut).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            );
        }

        if (viewMode === 'table') {
            return (
                <>
                    <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex justify-between">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="flex-1 max-w-md p-2 border border-gray-300 rounded-lg"
                        />
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Add /> Ajouter
                        </button>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Membre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Disponibilité</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Charge</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compétences</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredMembers.map((member) => (
                                    <tr key={member.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <div className={`w-8 h-8 ${getAvatarColor(member.nom)} rounded-full flex items-center justify-center mr-3`}>
                                                    <span className="text-white text-xs font-bold">{getInitials(member.nom)}</span>
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">{member.nom}</div>
                                                    <div className="text-sm text-gray-500">{member.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{member.poste}</div>
                                            <div className="text-sm text-gray-500">{member.role}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs rounded-full ${getAvailabilityColor(member.disponibilite)}`}>
                                                {member.disponibilite}%
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                <span className={`text-sm font-medium ${getChargeColor(member.chargeActuelle, member.chargeMax)}`}>
                                                    {member.chargeActuelle}h/{member.chargeMax}h
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {member.competences.slice(0, 3).map((comp, i) => (
                                                    <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                        {comp}
                                                    </span>
                                                ))}
                                                {member.competences.length > 3 && (
                                                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                        +{member.competences.length - 3}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button onClick={() => handleOpenHistory(member)} className="text-purple-600 hover:text-purple-800">
                                                    <History fontSize="small" />
                                                </button>
                                                <button onClick={() => handleOpenEditModal(member)} className="text-blue-600 hover:text-blue-800">
                                                    <Edit fontSize="small" />
                                                </button>
                                                <button onClick={() => onDeleteMember(member.id)} className="text-red-600 hover:text-red-800">
                                                    <Delete fontSize="small" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            );
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
            {renderContent()}

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

            <MemberHistory
                isOpen={isHistoryModalOpen}
                onClose={() => {
                    setIsHistoryModalOpen(false);
                    setSelectedMember(null);
                }}
                member={selectedMember}
            />
        </div>
    );
};

export default TeamList;