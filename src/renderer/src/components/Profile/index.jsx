import {
    Person2Rounded,
    Description,
    Flag,
    CalendarToday,
    Edit,
    Close,
    Save,
    GroupAdd,
    Category
} from '@mui/icons-material'
import React, { useState } from 'react'
import ModifierProjet from '../widjets/ModifieProjet';



// Main Component
const Profile = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Données du projet
    const projectData = {
        name: "Maloko tojours",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum suscipit saepe quaerat aperiam dolor ex nisi ab rem maxime, distinctio ad cupiditate fugiat",
        shortTerm: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        shortStart: "2026-04-11",
        shortEnd: "2026-04-11",
        longTerm: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        longStart: "2026-04-11",
        longEnd: "2026-04-11"
    };

    return (

        <div className="min-h-screen bg-gray-100 px-4">

            <div className="max-w-8xl mx-auto flex flex-col items-center py-3">

                {/* Header avec gradient */}
                <div className='w-full bg-gradient-to-r from-blue to-blue-800 shadow-sm rounded-sm p-4 flex justify-between items-center'>
                    <h1 className='text-xl text-white font-bold'>Profil du projet</h1>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='bg-white text-blue px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-300 flex items-center gap-2 shadow-md'
                    >
                        <Edit /> Modifier les informations
                    </button>
                </div>

                {/* Contenu principal */}
                <div className='w-full  rounded-b-lg p-8'>

                    {/* Informations générales */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mb-8'>
                        {/* Nom du projet */}
                        <div className='bg-blue-100 p-6 rounded-lg  shadow-sm'>

                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-blue rounded-full'>
                                    <Person2Rounded className='text-white' />
                                </div>
                                <h3 className='text-xl font-bold text-gray-800'>Nom du projet</h3>
                            </div>
                            <p className='text-gray-700 font-medium pl-14'>{projectData.name}</p>
                        </div>


                        {/* Chef de projet (nouveau) */}

                        <div className='bg-green-100 p-6 rounded-lg shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-green-600 rounded-full'>
                                    <Person2Rounded className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Chef de projet</h3>
                            </div>
                            <p className='text-gray-700 font-medium pl-14'>Jean Dupont</p>
                        </div>

                    </div>

                    {/* Description */}
                    <div className='mb-8'>

                        <div className='p-6 rounded-lg shadow-sm bg-purple-100'>
                            <div className='flex items-center gap-3 mb-4 '>
                                <div className='p-2 bg-purple-600 rounded-full'>
                                    <Description className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Description du projet</h3>
                            </div>
                            <p className='text-gray-600 pl-14'>{projectData.description}</p>
                        </div>
                    </div>

                    {/* Objectifs */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>

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
                                    <span className='text-gray-600'>11/04/2026</span>
                                </div>
                                <div className='flex items-center gap-3 text-sm'>
                                    <CalendarToday className='text-red-500' />
                                    <span className='font-semibold'>Fin :</span>
                                    <span className='text-gray-600'>11/04/2026</span>
                                </div>
                            </div>
                        </div>


                        {/* Long terme */}
                        <div className='bg-green-100 p-6 rounded-lg  shadow-sm'>
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
                                    <span className='text-gray-600'>11/04/2026</span>
                                </div>
                                <div className='flex items-center gap-3 text-sm'>
                                    <CalendarToday className='text-red-500' />
                                    <span className='font-semibold'>Fin :</span>
                                    <span className='text-gray-600'>11/04/2026</span>
                                </div>
                            </div>

                        </div>


                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-8'>

                        {/* client cible */}

                        <div className='p-6 rounded-lg bg-red-100 shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-red-600 rounded-full'>
                                    <GroupAdd className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Prospects cible</h3>
                            </div>

                            <div className='space-y-3 pl-14'>
                                <ul className='font-bold'>
                                    <li className='list-disc'>Eleves</li>
                                    <li className='list-disc'>Etudiant(e)s</li>
                                    <li className='list-disc'>Commercant(e)s</li>
                                    <li className='list-disc'>Salariers</li>
                                </ul>
                            </div>
                        </div>


                        {/* type de projet */}
                        <div className='bg-gray-200 p-6 rounded-lg  shadow-sm'>
                            <div className='flex items-center gap-3 mb-4'>
                                <div className='p-2 bg-black rounded-full'>
                                    <Category className='text-white' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Type de projet</h3>
                            </div>

                            <div className='flex flex-col space-y-3 pl-14'>
                                <label className='text-black font-bold'>Projet ouvrage</label>

                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo tempora consectetur dolores sit velit? Voluptatibus, magni repellat maxime, doloremque obcaecati cum rem natus laboriosam, repellendus reiciendis ex optio autem ut.</p>

                            </div>

                        </div>


                    </div>
                </div>
            </div>


            {/* Modal */}
            <ModifierProjet
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectData={projectData} />

            <div />
        </div>

    )

};

export default Profile;