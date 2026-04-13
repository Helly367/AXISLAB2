import React, { useState, useMemo } from 'react';
import {
    Add, Delete, Edit, History, More
} from "@mui/icons-material";
import AjouterMembre from './AjouteMembre';
import ModifyMembre from './ModifyMembre';
import { useMembres } from '../../../hooks/useMembers';
import { usePhases } from '../../../hooks/usePhase';
import DetailsMembre from './DetailsMembre';
import DeleteConfirm from '../../widjets/DeleteConfirm';

const EquipeList = ({ project }) => {
    const { membres, deleteMembre, setMembres, loadMembres } = useMembres();
    const { setPhases } = usePhases();
    const [loading, setLoading] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [showDetailsMembre, setShowDetailsMembre] = useState(false);
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

    const entente = (name = "") => {
        return name || "Non defini";
    };

    /* ===============================
       HANDLERS
    =============================== */
    const handleDeleteClick = (member) => {
        setMemberToEdit(member);
        setOpenDelete(true);

        console.log(memberToEdit);

    };

    const handleEditClick = (member) => {
        setMemberToEdit(member);
        setIsEditModalOpen(true);
    };



    const handleDetailsClick = (member) => {
        setMemberToEdit(member);
        setShowDetailsMembre(true);
    };

    const handleCloseDelete = () => {
        setOpenDelete(false);
        setMemberToEdit(null); // Réinitialisation importante
    };



    const handlerConfirm = async () => {
        setLoading(true);

        const membre_id = memberToEdit.membre_id;
        const projet_id = project.projet_id;

        console.log("membre_id", membre_id);
        console.log("projet_id", projet_id);


        await new Promise(resolve => setTimeout(resolve, 3000))
        const result = await deleteMembre(projet_id, membre_id);
        console.log(result);

        if (!result.success) {
            console.error(result.error || result.errors);
            setLoading(false);
            return;
        }

        setMembres(result.data.membres);
        setPhases(result.data.phases);
        loadMembres();

        setOpenDelete(false);
        setMemberToEdit(null);
        handleClose();
    }

    const handleClose = () => {
        setLoading(false);
        setOpenDelete(false);
    }

    /* ===============================
       FILTERED MEMBERS (MEMOIZED ⭐)
    =============================== */
    const filteredMembers = useMemo(() => {
        return membres?.filter(member => {
            if (!member) return false;

            if (searchTerm) {
                const search = searchTerm.toLowerCase();
                return (
                    member.nomComplet?.toLowerCase().includes(search) ||
                    member.poste?.toLowerCase().includes(search)
                );
            }
            return true;
        });
    }, [membres, filter, searchTerm]);

    /* ===============================
       RENDER VIEW
    =============================== */
    const renderContent = () => {
        return (
            <div className="space-y-4">
                {/* Search + Filter */}
                <div className="w-full flex bg-white rounded-lg shadow-md p-4  gap-4">
                    <input
                        type="text"
                        placeholder="Rechercher un membre..."
                        value={searchTerm}
                        maxLength={80} // limite stricte
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            if (e.target.value.length > 80) {
                                e.target.value = e.target.value.slice(0, 80);
                            }

                        }}
                        className={`w-full px-5 py-3 bg-gray-50 border-2 border-gray-400 rounded-xl 
                           focus:outline-none focus:bg-white focus:border-blue-500
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                    />
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                        <Add /> Ajouter
                    </button>
                </div>



                {filteredMembers.length === 0 ? (
                    <div className='w-full items-center justify-center bg-white py-16  rounded-lg shadow-md'>
                        <div className="text-center ">
                            <p className="text-gray-500 text-lg font-medium">
                                Aucun membre ne correspond a cette recherche
                            </p>
                            <p className="text-sm text-gray-400 mt-2">
                                « Veuillez réessayez. »
                            </p>

                        </div>
                    </div>
                ) : (
                    < div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredMembers.map(member => {

                            if (!member) return null;
                            return (
                                <div key={member.membre_id}
                                    className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center gpa-6 justify-between">
                                    {/* Avatar */}
                                    <div className='flex flex-col w-full gap-4 items-center justify-center '>
                                        <div className={`${getAvatarColor(member.nomComplet)} w-24 h-24 rounded-full items-center justify-center flex`}>
                                            <h3 className="text-white text-2xl font-bold">
                                                {getInitials(entente(member.nomComplet))}
                                            </h3>
                                        </div>

                                        <div className='flex flex-col items-center'>
                                            <h3 className="text-xl font-bold flex items-center justify-center">
                                                {entente(member.nomComplet)}
                                            </h3>
                                            <span className="text-blue-600 flex items-center justify-center">
                                                {entente(member.poste)}
                                            </span>
                                            <span className="text-gray-500 text-sm flex items-center justify-center">
                                                {entente(member.role)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-3 mt-8 self-end">

                                        <button
                                            onClick={() => handleEditClick(member)}
                                            className="p-2 bg-blue-100 text-blue-600 rounded-full"
                                            title='modifier les informations'
                                        >
                                            <Edit fontSize="small" />
                                        </button>
                                        <button
                                            onClick={() => handleDetailsClick(member)}
                                            className="p-2 bg-red-100 text-red-600 rounded-full"
                                            title='voir plus'
                                        >
                                            <More fontSize="small" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(member)}
                                            className="p-2 bg-red-100 text-red-600 rounded-full"
                                            title='supprimer ce membre'
                                        >
                                            <Delete fontSize="small" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                        </div>
                )}

            </div>
        );
    };

    return (
        <div className="w-full mt-4">
            {/* Message si aucun membre */}
            {(!membres || membres.length === 0) && (
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
            {membres && membres.length > 0 && renderContent()}

            {/* Modals */}
            <AjouterMembre
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                project={project}
            />

            <ModifyMembre
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                memberToEdit={memberToEdit}
                project={project}
            />

            <DetailsMembre
                isOpen={showDetailsMembre}
                onClose={() => setShowDetailsMembre(false)}
                memberToEdit={memberToEdit}
                getAvatarColor={getAvatarColor}
                getInitials={getInitials}
                entente={entente}
            />

            {openDelete && (
                <DeleteConfirm
                    message={`Voulez-vous vraiment supprimer le membre ${memberToEdit?.nomComplet}`}
                    open={openDelete}
                    onClose={() => setOpenDelete(false)}
                    element={memberToEdit}
                    elementId={memberToEdit?.membre_id}
                    projet_id={project?.projet_id}
                    onConfirm={() => handlerConfirm()}
                    loading={loading}
                />

            )}





        </div>
    );
};

export default EquipeList;