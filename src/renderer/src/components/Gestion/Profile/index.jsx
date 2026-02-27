import {
    Person2Rounded,
    Description,
    Flag,
    CalendarToday,
    Edit,
    Close,
    Save,
    GroupAdd,
    Category,
    AccessTime,
    TrendingUp,
    PriorityHigh,
    CheckCircle,
    Pause,
    Block,
    PlayArrow
} from '@mui/icons-material'
import React, { useState } from 'react'
import ModifierProjet from '../ModifieProjet';

// Main Component
const Profile = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Données du projet avec les nouvelles informations
    const [projectData, setProjectData] = useState({
        name: "Maloko tojours",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum suscipit saepe quaerat aperiam dolor ex nisi ab rem maxime, distinctio ad cupiditate fugiat",
        shortTerm: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        shortStart: "2026-04-11",
        shortEnd: "2026-04-11",
        longTerm: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        longStart: "2026-04-11",
        longEnd: "2026-04-11",

        // Nouvelles données
        dateDebut: "2026-01-15",
        dateFinPrevue: "2026-12-20",
        dateFinReelle: "",
        statut: "en_cours", // en_cours, termine, en_pause, annule
        priorite: "haute", // haute, moyenne, basse
        progression: 45, // 0-100
        chefProjet: "Jean Dupont",
        prospects: ["Élèves", "Étudiant(e)s", "Commerçant(e)s", "Salariés"],
        typeProjet: "Projet ouvrage",
        descriptionType: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo tempora consectetur dolores sit velit? Voluptatibus, magni repellat maxime, doloremque obcaecati cum rem natus laboriosam, repellendus reiciendis ex optio autem ut."
    });

    // Fonction pour mettre à jour les données du projet
    const handleUpdateProject = (updatedData) => {
        setProjectData(updatedData);
    };

    // Fonction pour obtenir la couleur et l'icône du statut
    const getStatusInfo = (statut) => {
        switch (statut) {
            case 'en_cours':
                return {
                    color: 'bg-green-100 text-green-800',
                    icon: <PlayArrow className="text-green-600" />,
                    label: 'En cours'
                };
            case 'termine':
                return {
                    color: 'bg-blue-100 text-blue-800',
                    icon: <CheckCircle className="text-blue-600" />,
                    label: 'Terminé'
                };
            case 'en_pause':
                return {
                    color: 'bg-yellow-100 text-yellow-800',
                    icon: <Pause className="text-yellow-600" />,
                    label: 'En pause'
                };
            case 'annule':
                return {
                    color: 'bg-red-100 text-red-800',
                    icon: <Block className="text-red-600" />,
                    label: 'Annulé'
                };
            default:
                return {
                    color: 'bg-gray-100 text-gray-800',
                    icon: <AccessTime className="text-gray-600" />,
                    label: statut
                };
        }
    };

    // Fonction pour obtenir la couleur de la priorité
    const getPriorityColor = (priorite) => {
        switch (priorite) {
            case 'haute':
                return 'bg-red-100 text-red-800';
            case 'moyenne':
                return 'bg-yellow-100 text-yellow-800';
            case 'basse':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const statusInfo = getStatusInfo(projectData.statut);

    // Formater les dates
    const formatDate = (dateString) => {
        if (!dateString) return 'Non définie';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    return (
        <div className="min-h-screen bg-gray-200 px-4">

            <div className="max-w-8xl mx-auto flex flex-col items-center py-2">

                {/* Header avec gradient */}
                <div className='w-full  bg-primary shadow-sm rounded-lg p-4 flex justify-between items-center'>
                    <h1 className='text-xl text-white font-bold'>Profil du projet</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center gap-2 shadow-md'
                    >
                        <Edit /> Modifier les informations
                    </button>
                </div>


                {/* Contenu principal */}
                <div className='w-full rounded-b-lg p-4'>
                    {/* Section Statut et Priorité */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>

                        {/* Statut */}
                        <div className='bg-white p-4 rounded-lg shadow-md'>
                            <div className='flex items-center gap-3 mb-3'>
                                <AccessTime className='text-blue-600' />
                                <h3 className='text-lg font-semibold text-gray-700'>Statut</h3>
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${statusInfo.color}`}>
                                {statusInfo.icon}
                                <span className='font-medium'>{statusInfo.label}</span>
                            </div>
                        </div>

                        {/* Priorité */}
                        <div className='bg-white p-4 rounded-lg shadow-md'>
                            <div className='flex items-center gap-3 mb-3'>
                                <PriorityHigh className='text-blue-600' />
                                <h3 className='text-lg font-semibold text-gray-700'>Priorité</h3>
                            </div>
                            <div className={`inline-flex items-center px-4 py-2 rounded-full font-medium ${getPriorityColor(projectData.priorite)}`}>
                                {projectData.priorite.charAt(0).toUpperCase() + projectData.priorite.slice(1)}
                            </div>
                        </div>

                        {/* Progression */}
                        <div className='bg-white p-4 rounded-lg shadow-md'>
                            <div className='flex items-center gap-3 mb-3'>
                                <TrendingUp className='text-blue-600' />
                                <h3 className='text-lg font-semibold text-gray-700'>Progression</h3>
                            </div>
                            <div className='flex items-center gap-4'>
                                <div className='flex-1'>
                                    <div className='w-full bg-gray-200 rounded-full h-3'>
                                        <div
                                            className='bg-blue-600 rounded-full h-3 transition-all duration-500'
                                            style={{ width: `${projectData.progression}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <span className='text-xl font-bold text-blue-600'>{projectData.progression}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Informations générales */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
                        {/* Nom du projet */}
                        <div className='bg-blue-100 p-6 rounded-lg shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-blue-600 rounded-full'>
                                    <Person2Rounded className='text-white' />
                                </div>
                                <h3 className='text-xl font-bold text-gray-800'>Nom du projet</h3>
                            </div>
                            <p className='text-gray-700 font-medium pl-14'>{projectData.name}</p>
                        </div>

                        {/* Chef de projet */}
                        <div className='bg-green-100 p-6 rounded-lg shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-green-600 rounded-full'>
                                    <Person2Rounded className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Chef de projet</h3>
                            </div>
                            <p className='text-gray-700 font-medium pl-14'>{projectData.chefProjet}</p>
                        </div>
                    </div>

                    {/* Description */}
                    <div className='mb-8'>
                        <div className='p-6 rounded-lg shadow-sm bg-purple-100'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-purple-600 rounded-full'>
                                    <Description className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Description du projet</h3>
                            </div>
                            <p className='text-gray-600 pl-14'>{projectData.description}</p>
                        </div>
                    </div>

                    {/* Dates du projet */}
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <div className='flex items-center gap-3 mb-3'>
                                <CalendarToday className='text-green-500' />
                                <h3 className='font-semibold text-gray-700'>Date de début</h3>
                            </div>
                            <p className='text-lg font-medium text-gray-800'>{formatDate(projectData.dateDebut)}</p>
                        </div>

                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <div className='flex items-center gap-3 mb-3'>
                                <CalendarToday className='text-blue-500' />
                                <h3 className='font-semibold text-gray-700'>Date de fin prévue</h3>
                            </div>
                            <p className='text-lg font-medium text-gray-800'>{formatDate(projectData.dateFinPrevue)}</p>
                        </div>

                        <div className='bg-white p-6 rounded-lg shadow-md'>
                            <div className='flex items-center gap-3 mb-3'>
                                <CalendarToday className='text-red-500' />
                                <h3 className='font-semibold text-gray-700'>Date de fin réelle</h3>
                            </div>
                            <p className='text-lg font-medium text-gray-800'>
                                {projectData.dateFinReelle ? formatDate(projectData.dateFinReelle) : 'En cours'}
                            </p>
                        </div>
                    </div>

                    {/* Objectifs */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
                        {/* Court terme */}
                        <div className='p-6 rounded-lg bg-yellow-100 shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-yellow-600 rounded-full'>
                                    <Flag className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Objectif à court terme</h3>
                            </div>
                            <p className='text-gray-600 mb-4 pl-14'>{projectData.shortTerm}</p>
                            <div className='space-y-3 pl-14'>
                                <div className='flex items-center gap-3 text-sm'>
                                    <CalendarToday className='text-blue-500' />
                                    <span className='font-semibold'>Début :</span>
                                    <span className='text-gray-600'>{formatDate(projectData.shortStart)}</span>
                                </div>
                                <div className='flex items-center gap-3 text-sm'>
                                    <CalendarToday className='text-red-500' />
                                    <span className='font-semibold'>Fin :</span>
                                    <span className='text-gray-600'>{formatDate(projectData.shortEnd)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Long terme */}
                        <div className='bg-green-100 p-6 rounded-lg shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-green-600 rounded-full'>
                                    <Flag className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Objectif à long terme</h3>
                            </div>
                            <p className='text-gray-600 mb-4 pl-14'>{projectData.longTerm}</p>
                            <div className='space-y-3 pl-14'>
                                <div className='flex items-center gap-3 text-sm'>
                                    <CalendarToday className='text-blue-500' />
                                    <span className='font-semibold'>Début :</span>
                                    <span className='text-gray-600'>{formatDate(projectData.longStart)}</span>
                                </div>
                                <div className='flex items-center gap-3 text-sm'>
                                    <CalendarToday className='text-red-500' />
                                    <span className='font-semibold'>Fin :</span>
                                    <span className='text-gray-600'>{formatDate(projectData.longEnd)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Clients cibles et Type de projet */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                        {/* Clients cibles */}
                        <div className='p-6 rounded-lg bg-red-100 shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-red-600 rounded-full'>
                                    <GroupAdd className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Prospects cibles</h3>
                            </div>
                            <div className='pl-14'>
                                <ul className='list-disc pl-5 space-y-1'>
                                    {projectData.prospects.map((prospect, index) => (
                                        <li key={index} className='text-gray-700'>{prospect}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Type de projet */}
                        <div className='bg-gray-100 p-6 rounded-lg shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-gray-700 rounded-full'>
                                    <Category className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Type de projet</h3>
                            </div>
                            <div className='pl-14'>
                                <span className='inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium mb-3'>
                                    {projectData.typeProjet}
                                </span>
                                <p className='text-gray-600'>{projectData.descriptionType}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de modification */}
            <ModifierProjet
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectData={projectData}
                onSave={handleUpdateProject}
            />
        </div>
    );
};

export default Profile;