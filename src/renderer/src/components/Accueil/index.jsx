import React, { useState } from 'react';
import accueilImg from "../../../../../resources/acceuil.png";

const Accueil = () => {
    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Logique de création de projet
        console.log('Projet créé:', { projectName, projectDescription });
    };

    return (
        <section className='w-full h-full flex items-center justify-center gap-10 bg-white p-10'>
            {/* Section gauche - Présentation */}
            <div className='flex flex-col h-full items-center justify-center gap-20 flex-1'>
                <div className='gap-6 text-center'>
                    <h3 className='text-4xl text-blue-600 font-bold'>Bienvenue sur Axis Lab</h3>
                    <p className='text-2xl text-gray-700'>Optimisez la gestion de vos projets avec Axis Lab</p>
                </div>
                <img src={accueilImg} alt="Accueil Axis Lab" className='w-100' />

                <aside>
                    par AryoTech
                </aside>
            </div>

            {/* Section droite - Formulaire */}
            <div className='bg-white w-2/4 flex flex-col items-center justify-center gap-10 p-8 rounded-lg shadow shadow-blue-600'>
                <h3 className='text-2xl text-black font-bold'>Créer votre premier projet</h3>

                <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-10'>
                    <div className='flex flex-col items-center justify-center gap-10 w-full'>
                        <div className='flex flex-col gap-3 w-full max-w-[450px]'>
                            <label className='text-xl text-gray-700'>Nom du projet</label>
                            <input
                                type="text"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                className='p-2 w-full outline-none border-2 border-gray-700 rounded-md bg-transparent text-gray-700 placeholder-gray-700 '
                                placeholder='Ex: Mon nouveau projet'
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-3 w-full max-w-[450px]'>
                            <label className='text-xl text-gray-700'>Description du projet</label>
                            <textarea
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                                className='p-2 w-full h-32 outline-none border-2 border-gray-700 rounded-md bg-transparent text-gray-700 placeholder-gray-700'
                                placeholder='Décrivez votre projet...'
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className='px-8 py-3 bg-blue-600 text-white font-semibold rounded-md cursor-pointer hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 transition-colors'
                    >
                        Créer un projet
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Accueil;