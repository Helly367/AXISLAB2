import React, { useState, useEffect } from 'react';
import {

    AddCircle
} from "@mui/icons-material";

import AjouterMateriel from './AjouterMateriel';
import { useBudgets } from "../../../hooks/useBudgets"
import { useMateriels } from '../../../hooks/useMateriels';
import { usePhases } from '../../../hooks/usePhase';
import MaterielCard from './MaterielCard';

const MaterielContent = ({ project }) => {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const { budget } = useBudgets();
    const { materiels, deleteMateriel } = useMateriels();
    const { phases, setPhases } = usePhases();

    // Sync props → state seulement si différent
  

    // Calculs
    const totalMateriels = materiels.reduce(
        (acc, m) => acc + (Number(m.prix || 0) * Number(m.quantite || 0)),
        0
    );

   

    const notifyMaterielsChange = (list) => {

        onUpdateMateriels?.(list);
    };

   





    return (
        <div className="min-h-screen bg-gray-200">
            <div className='max-w-8xl mx-auto px-4 py-2'>

                <div className="w-full  flex items-center justify-between bg-primary rounded-lg shadow-md p-2  ">
                    <h1 className="text-2xd text-white font-bold">
                        Matériels du projet
                    </h1>

                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md"
                    >
                        <AddCircle /> Ajouter un matériel
                    </button>
                </div>

                {/* Liste */}
                {materiels.length === 0 ? (

                    <div className="text-center py-16 bg-white rounded-lg shadow-md mt-4">
                        <p className="text-gray-500 text-lg font-medium">

                            <span className='ml-2'> Aucun materiel disponible pour le moment</span>

                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            « Ajouter des matieriels a votre projet. »
                        </p>


                    </div>

                ) : (

                        <MaterielCard
                            materiels={materiels}
                            phases={phases}
                            devise={budget?.devise}
                            project={project}
                            budget={budget}
                            deleteMateriel={deleteMateriel}
                            setPhases={setPhases}
                        />
                )}

            {/* Modals */}
            <AjouterMateriel
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                project={project}
                budget={budget}
            />



            </div>
        </div>
    );
};

/* ---------------- Components internes ---------------- */


export default MaterielContent;