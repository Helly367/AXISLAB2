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
import ModalAddMateriel from '../ModalAddMateriel';
import ModalEditMateriel from '../ModalEditMateriel';

const MaterielList = ({ budgetGlobal, onUpdateBudget, onUpdateMateriels }) => {
    const [materiels, setMateriels] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [materielToEdit, setMaterielToEdit] = useState(null);
    const [filter, setFilter] = useState('all'); // 'all', 'disponible', 'commandé', 'livré'

    // Calculer le total des matériels
    const totalMateriels = materiels.reduce((acc, m) => acc + (m.prix * m.quantite), 0);
    const budgetRestant = budgetGlobal - totalMateriels;
    const peutAjouter = budgetRestant > 0;

    // Statistiques par statut
    const stats = {
        disponible: materiels.filter(m => m.statut === 'disponible').length,
        commande: materiels.filter(m => m.statut === 'commandé').length,
        livre: materiels.filter(m => m.statut === 'livré').length
    };

    const handleAddMateriel = (newMateriel) => {
        const nouveauTotal = totalMateriels + (newMateriel.prix * newMateriel.quantite);

        if (nouveauTotal > budgetGlobal) {
            alert(`Budget insuffisant ! Il vous manque ${(nouveauTotal - budgetGlobal).toLocaleString()} USD`);
            return;
        }

        const updatedMateriels = [...materiels, { ...newMateriel, id: Date.now() }];
        setMateriels(updatedMateriels);

        if (onUpdateMateriels) {
            onUpdateMateriels(updatedMateriels);
        }

        // Mettre à jour le budget (optionnel)
        if (onUpdateBudget) {
            onUpdateBudget(budgetGlobal - totalMateriels - (newMateriel.prix * newMateriel.quantite));
        }
    };

    const handleEditMateriel = (updatedMateriel) => {
        const ancienMateriel = materiels.find(m => m.id === updatedMateriel.id);
        const ancienTotal = ancienMateriel.prix * ancienMateriel.quantite;
        const nouveauTotal = updatedMateriel.prix * updatedMateriel.quantite;
        const difference = nouveauTotal - ancienTotal;

        if (budgetRestant - difference < 0) {
            alert(`Budget insuffisant pour cette modification ! Il manque ${Math.abs(budgetRestant - difference).toLocaleString()} USD`);
            return;
        }

        const updatedMateriels = materiels.map(m =>
            m.id === updatedMateriel.id ? updatedMateriel : m
        );

        setMateriels(updatedMateriels);

        if (onUpdateMateriels) {
            onUpdateMateriels(updatedMateriels);
        }
    };

    const handleDeleteMateriel = (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce matériel ?')) {
            const updatedMateriels = materiels.filter(m => m.id !== id);
            setMateriels(updatedMateriels);

            if (onUpdateMateriels) {
                onUpdateMateriels(updatedMateriels);
            }
        }
    };

    const handleOpenEditModal = (materiel) => {
        setMaterielToEdit(materiel);
        setIsEditModalOpen(true);
    };

    const getStatutColor = (statut) => {
        switch (statut) {
            case 'disponible': return 'bg-green-100 text-green-800';
            case 'commandé': return 'bg-yellow-100 text-yellow-800';
            case 'livré': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatutIcon = (statut) => {
        switch (statut) {
            case 'disponible': return <CheckCircle className="text-green-600" fontSize="small" />;
            case 'commandé': return <ShoppingCart className="text-yellow-600" fontSize="small" />;
            case 'livré': return <CheckCircle className="text-blue-600" fontSize="small" />;
            default: return null;
        }
    };

    // Filtrer les matériels
    const materielsFiltres = filter === 'all'
        ? materiels
        : materiels.filter(m => m.statut === filter);

    return (
        <div className="w-full p-4 bg-gray-200">
            {/* Header */}
            <div className="bg-primary rounded-lg shadow-md p-4 flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">

                    <h1 className="text-xl text-white font-bold">Matériels du projet</h1>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    disabled={!peutAjouter}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 shadow-md ${peutAjouter
                        ? 'bg-white text-blue-600 hover:bg-blue-50'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}>
                    <Add /> Ajouter un matériel
                </button>
            </div>

            {/* Résumé budgétaire */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-gray-600 mb-2">Budget total</h3>
                    <p className="text-2xl font-bold text-primary">
                        {budgetGlobal.toLocaleString()} USD
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-gray-600 mb-2">Coût matériels</h3>
                    <p className="text-2xl font-bold text-orange-500">
                        {totalMateriels.toLocaleString()} USD
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-gray-600 mb-2">Budget restant</h3>
                    <p className={`text-2xl font-bold ${budgetRestant >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {budgetRestant.toLocaleString()} USD
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-gray-600 mb-2">Statut</h3>
                    <div className="flex items-center gap-2">
                        {budgetRestant >= 0 ? (
                            <>
                                <CheckCircle className="text-green-500" />
                                <span className="text-green-600 font-medium">Budget suffisant</span>
                            </>
                        ) : (
                            <>
                                <Warning className="text-red-500" />
                                <span className="text-red-600 font-medium">Budget insuffisant</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Filtres et statistiques */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}>
                        Tous ({materiels.length})
                    </button>
                    <button
                        onClick={() => setFilter('disponible')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'disponible'
                            ? 'bg-green-600 text-white'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}>
                        Disponible ({stats.disponible})
                    </button>
                    <button
                        onClick={() => setFilter('commandé')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'commandé'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                            }`}>
                        Commandé ({stats.commande})
                    </button>
                    <button
                        onClick={() => setFilter('livré')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'livré'
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}>
                        Livré ({stats.livre})
                    </button>
                </div>

                <div className="text-sm text-gray-500">
                    {materielsFiltres.length} matériel(s) affiché(s)
                </div>
            </div>

            {/* Grille des matériels */}
            {materielsFiltres.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {materielsFiltres.map((materiel) => (
                        <div
                            key={materiel.id}
                            className=" bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 relative group">

                            {/* Boutons d'action */}
                            <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleOpenEditModal(materiel)}
                                    className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200">
                                    <Edit fontSize="small" />
                                </button>
                                <button
                                    onClick={() => handleDeleteMateriel(materiel.id)}
                                    className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200">
                                    <Delete fontSize="small" />
                                </button>
                            </div>

                            {/* Image */}
                            <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                                {materiel.image ? (
                                    <img
                                        src={materiel.image}
                                        alt={materiel.nom}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <Computer className="text-gray-400 text-6xl" />
                                )}
                            </div>

                            {/* Informations */}
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{materiel.nom}</h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Category fontSize="small" />
                                    <span className="text-sm">{materiel.categorie}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <AttachMoney fontSize="small" />
                                    <span className="text-sm">
                                        {materiel.prix.toLocaleString()} FCFA x {materiel.quantite}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    {getStatutIcon(materiel.statut)}
                                    <span className={`text-sm font-medium px-2 py-0.5 rounded-full ${getStatutColor(materiel.statut)}`}>
                                        {materiel.statut}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            {materiel.description && (
                                <p className="text-sm text-gray-500 border-t pt-3">
                                    {materiel.description}
                                </p>
                            )}

                            {/* Total */}
                            <div className="mt-3 text-right font-bold text-blue-600">
                                Total: {(materiel.prix * materiel.quantite).toLocaleString()} FCFA
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <Inventory className="text-gray-400 text-6xl mx-auto mb-4" />
                    <h3 className="text-xl text-gray-600 font-medium mb-2">Aucun matériel</h3>
                    <p className="text-gray-500 mb-6">Commencez par ajouter des matériels au projet</p>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        disabled={!peutAjouter}
                        className={`px-6 py-2 rounded-lg font-semibold transition-all inline-flex items-center gap-2 ${peutAjouter
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            }`}>
                        <Add /> Ajouter un matériel
                    </button>
                    {!peutAjouter && (
                        <p className="text-red-500 text-sm mt-4">
                            <Warning className="inline mr-1" fontSize="small" />
                            Budget insuffisant pour ajouter du matériel
                        </p>
                    )}
                </div>
            )}

            {/* Modals */}
            <ModalAddMateriel
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleAddMateriel}
                budgetRestant={budgetRestant}
            />

            <ModalEditMateriel
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setMaterielToEdit(null);
                }}
                onSave={handleEditMateriel}
                materielToEdit={materielToEdit}
                budgetRestant={budgetRestant + (materielToEdit?.prix * materielToEdit?.quantite || 0)}
            />
        </div>
    );
};

export default MaterielList;