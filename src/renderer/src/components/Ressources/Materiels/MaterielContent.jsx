import React, { useState, useEffect } from 'react';
import {
    Computer,
    Add,
    Edit,
    Delete,
    Warning,
    CheckCircle,
    Inventory,
    AttachMoney,
    ShoppingCart,
    Category,
    AddCircle
} from "@mui/icons-material";

import AjouterMateriel from './AjouterMateriel';
import ModifyMateriel from './ModifyMateriel';
import { useBudgets } from "../../../hooks/useBudgets"
import { useMateriels } from '../../../hooks/useMateriels';

const MaterielContent = ({ project }) => {

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [materielToEdit, setMaterielToEdit] = useState(null);
    const [filter, setFilter] = useState('all');
    const { budget } = useBudgets();
    const { materiels } = useMateriels();

    // Sync props → state seulement si différent
  

    // Calculs
    const totalMateriels = materiels.reduce(
        (acc, m) => acc + (Number(m.prix || 0) * Number(m.quantite || 0)),
        0
    );

   

    const notifyMaterielsChange = (list) => {

        onUpdateMateriels?.(list);
    };

   

    const handleOpenEditModal = (materiel) => {
        setMaterielToEdit(materiel);
        setIsEditModalOpen(true);
    };

    const materielsFiltres =
        filter === 'all'
            ? materiels
            : materiels.filter(m => m.statut === filter);

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
                {materielsFiltres.length === 0 ? (

                    <div className="text-center py-16 bg-white rounded-lg shadow-md mt-4">
                        <p className="text-gray-500 text-lg font-medium">

                            <span className='ml-2'> Aucun materiel disponible pour le moment</span>

                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            « Ajouter des matieriels a votre projet. »
                        </p>


                    </div>

                ) : (
                    <div className="grid md:grid-cols-3 gap-6">
                        {materielsFiltres.map(m => (
                            <MaterielCard
                                key={m.id}
                                materiel={m}
                            />
                        ))}
                    </div>
                )}

            {/* Modals */}
            <AjouterMateriel
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                project={project}
                budget={budget}
            />

            <ModifyMateriel
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setMaterielToEdit(null);
                }}
                materielToEdit={materielToEdit}
               
            />

            </div>
        </div>
    );
};

/* ---------------- Components internes ---------------- */

const StatCard = ({ title, value, color = "text-blue-600", icon }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-gray-600 mb-2">{title}</h3>

        {icon && <div className="mb-2">{icon}</div>}

        <p className={`text-2xl font-bold ${color}`}>
            {value}
        </p>
    </div>
);

const MaterielCard = ({ materiel, onEdit, onDelete }) => (
    <div className="bg-white rounded-lg shadow-md p-6 group relative">

        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition">
            <button
                onClick={() => onEdit(materiel)}
                className="p-2 bg-blue-100 rounded-full"
            >
                <Edit fontSize="small" />
            </button>

            <button
                onClick={() => onDelete(materiel.id)}
                className="p-2 bg-red-100 rounded-full"
            >
                <Delete fontSize="small" />
            </button>
        </div>

        <h3 className="font-bold text-lg mb-2">
            {materiel.nom}
        </h3>

        <p className="text-sm text-gray-500">
            {materiel.categorie}
        </p>

        <p className="font-bold text-blue-600 mt-3">
            {(materiel.prix * materiel.quantite).toLocaleString()} USD
        </p>

    </div>
);

export default MaterielContent;