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
    Category
} from "@mui/icons-material";

import AjouterMateriel from './AjouterMateriel';
import ModifyMateriel from './ModifyMateriel';

const MaterielContent = ({
    budgetGlobal = 0,
    onUpdateBudget,
    onUpdateMateriels,
    initialMateriels = []
}) => {

    const [materiels, setMateriels] = useState(initialMateriels || []);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [materielToEdit, setMaterielToEdit] = useState(null);
    const [filter, setFilter] = useState('all');

    // Sync props → state
    useEffect(() => {
        setMateriels(initialMateriels || []);
    }, [initialMateriels]);

    const totalMateriels = materiels.reduce(
        (acc, m) => acc + (Number(m.prix || 0) * Number(m.quantite || 0)),
        0
    );

    const budgetRestant = Number(budgetGlobal) - totalMateriels;
    const peutAjouter = budgetRestant > 0;

    const stats = {
        disponible: materiels.filter(m => m.statut === 'disponible').length,
        commande: materiels.filter(m => m.statut === 'commandé').length,
        livre: materiels.filter(m => m.statut === 'livré').length
    };

    const notifyMaterielsChange = (list) => {
        setMateriels(list);
        onUpdateMateriels?.(list);
    };

    const handleAddMateriel = (newMateriel) => {

        const cout = Number(newMateriel.prix || 0) *
            Number(newMateriel.quantite || 0);

        if (totalMateriels + cout > budgetGlobal) {
            alert("Budget insuffisant !");
            return;
        }

        const updated = [
            ...materiels,
            { ...newMateriel, id: Date.now() }
        ];

        notifyMaterielsChange(updated);

        onUpdateBudget?.(budgetGlobal - (totalMateriels + cout));

        setIsAddModalOpen(false);
    };

    const handleEditMateriel = (updatedMateriel) => {

        const ancien = materiels.find(m => m.id === updatedMateriel.id);
        if (!ancien) return;

        const ancienTotal =
            Number(ancien.prix || 0) * Number(ancien.quantite || 0);

        const nouveauTotal =
            Number(updatedMateriel.prix || 0) *
            Number(updatedMateriel.quantite || 0);

        if (budgetRestant + (ancienTotal - nouveauTotal) < 0) {
            alert("Budget insuffisant pour cette modification");
            return;
        }

        const updated = materiels.map(m =>
            m.id === updatedMateriel.id ? updatedMateriel : m
        );

        notifyMaterielsChange(updated);

        setIsEditModalOpen(false);
        setMaterielToEdit(null);
    };

    const handleDeleteMateriel = (id) => {
        if (!window.confirm("Supprimer ce matériel ?")) return;

        const updated = materiels.filter(m => m.id !== id);
        notifyMaterielsChange(updated);
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
        <div className="w-full p-4 bg-gray-200">

            <div className="bg-primary rounded-lg shadow-md p-4 flex justify-between mb-6">
                <h1 className="text-xl text-white font-bold">
                    Matériels du projet
                </h1>

                <button
                    onClick={() => setIsAddModalOpen(true)}
                    disabled={!peutAjouter}
                    className={`px-6 py-2 rounded-lg flex gap-2 ${peutAjouter
                        ? "bg-white text-blue-600"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    <Add /> Ajouter un matériel
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-4 gap-6 mb-6">

                <StatCard title="Budget total"
                    value={`${budgetGlobal.toLocaleString()} USD`} />

                <StatCard title="Coût matériels"
                    value={`${totalMateriels.toLocaleString()} USD`}
                    color="text-orange-500"
                />

                <StatCard title="Budget restant"
                    value={`${budgetRestant.toLocaleString()} USD`}
                    color={budgetRestant >= 0 ? "text-green-500" : "text-red-500"}
                />

                <StatCard
                    title="Statut"
                    value={budgetRestant >= 0
                        ? "Budget suffisant"
                        : "Budget insuffisant"}
                    icon={budgetRestant >= 0
                        ? <CheckCircle className="text-green-500" />
                        : <Warning className="text-red-500" />}
                />

            </div>

            {/* Liste */}
            {materielsFiltres.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <Inventory className="text-gray-400 text-6xl mx-auto mb-4" />
                    <p className="text-gray-500">
                        Aucun matériel enregistré
                    </p>
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">
                    {materielsFiltres.map(m => (
                        <MaterielCard
                            key={m.id}
                            materiel={m}
                            onEdit={handleOpenEditModal}
                            onDelete={handleDeleteMateriel}
                        />
                    ))}
                </div>
            )}

            {/* Modals */}
            <AjouterMateriel
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddMateriel}
                budgetRestant={budgetRestant}
            />

            <ModifyMateriel
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setMaterielToEdit(null);
                }}
                onSave={handleEditMateriel}
                materielToEdit={materielToEdit}
                budgetRestant={budgetRestant}
            />

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