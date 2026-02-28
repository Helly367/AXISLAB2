import React, { useState } from 'react';
import accueilImg from "../../../../../resources/acceuil.png";
import CreationProjet from '../widjets/CreationProjet';

const Accueil = ({ setProject }) => {




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
            <CreationProjet setProject={setProject} />

        </section>
    );
};

export default Accueil;