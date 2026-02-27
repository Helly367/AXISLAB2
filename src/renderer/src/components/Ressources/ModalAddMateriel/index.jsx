import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Close, Save, Computer, Category,
    AttachMoney, Description, Inventory,
    Warning, Photo
} from "@mui/icons-material";

const ModalAddMateriel = ({ isOpen, onClose, onSave, budgetRestant }) => {
    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            nom: '',
            categorie: 'informatique',
            prix: '',
            quantite: 1,
            statut: 'disponible',
            description: '',
            image: '',
            fournisseur: ''
        }
    });

    const watchPrix = watch('prix', 0);
    const watchQuantite = watch('quantite', 1);
    const totalEstime = watchPrix * watchQuantite;

    const onSubmit = (data) => {
        if (totalEstime > budgetRestant) {
            alert(`Budget insuffisant ! Il manque ${(totalEstime - budgetRestant).toLocaleString()} FCFA`);
            return;
        }

        const newMateriel = {
            ...data,
            prix: Number(data.prix),
            quantite: Number(data.quantite),
            dateAjout: new Date().toISOString()
        };

        onSave(newMateriel);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-primary p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold">Ajouter un matériel</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Budget restant */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-blue-800">Budget restant:</span>
                            <span className="text-xl font-bold text-blue-600">
                                {budgetRestant.toLocaleString()} USD
                            </span>
                        </div>
                        {totalEstime > 0 && (
                            <div className="mt-2 flex justify-between items-center text-sm">
                                <span className="text-gray-600">Total estimation:</span>
                                <span className={`font-bold ${totalEstime > budgetRestant ? 'text-red-600' : 'text-green-600'}`}>
                                    {totalEstime.toLocaleString()} FCFA
                                    {totalEstime > budgetRestant && ' (dépassement)'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Computer className="inline mr-2 text-blue-600" />
                            Nom du matériel
                        </label>
                        <input
                            type="text"
                            {...register('nom', {
                                required: 'Le nom est requis',
                                minLength: { value: 2, message: 'Minimum 2 caractères' }
                            })}
                            className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.nom ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Ex: Ordinateur portable Dell XPS"
                        />
                        {errors.nom && (
                            <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
                        )}
                    </div>

                    {/* Catégorie */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Category className="inline mr-2 text-blue-600" />
                            Catégorie
                        </label>
                        <select
                            {...register('categorie', { required: 'La catégorie est requise' })}
                            className="w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600">
                            <option value="informatique">Informatique</option>
                            <option value="bureau">Mobilier de bureau</option>
                            <option value="reseau">Réseau</option>
                            <option value="logiciel">Logiciel</option>
                            <option value="securite">Sécurité</option>
                            <option value="autre">Autre</option>
                        </select>
                    </div>

                    {/* Prix et Quantité */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <AttachMoney className="inline mr-2 text-blue-600" />
                                Prix unitaire (USD)
                            </label>
                            <input
                                type="number"
                                {...register('prix', {
                                    required: 'Le prix est requis',
                                    min: { value: 0, message: 'Prix invalide' }
                                })}
                                className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.prix ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="0"
                            />
                            {errors.prix && (
                                <p className="text-red-500 text-sm mt-1">{errors.prix.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Inventory className="inline mr-2 text-blue-600" />
                                Quantité
                            </label>
                            <input
                                type="number"
                                {...register('quantite', {
                                    required: 'La quantité est requise',
                                    min: { value: 1, message: 'Minimum 1' }
                                })}
                                className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.quantite ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.quantite && (
                                <p className="text-red-500 text-sm mt-1">{errors.quantite.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Statut */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Statut
                        </label>
                        <select
                            {...register('statut')}
                            className="w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600">
                            <option value="disponible">Disponible</option>
                            <option value="commandé">Commandé</option>
                            <option value="livré">Livré</option>
                        </select>
                    </div>

                    {/* Fournisseur */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Fournisseur (optionnel)
                        </label>
                        <input
                            type="text"
                            {...register('fournisseur')}
                            className="w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                            placeholder="Nom du fournisseur"
                        />
                    </div>

                    {/* Photo URL */}
                    <div className='flex flex-col gap-3'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Photo className="inline mr-2 text-primary" />
                            URL de la photo (optionnel)
                        </label>

                        <div className='flex items-center gap-6 self-center'>
                            <img src="" alt="" className='w-40 h-40 rounded-full border border-gray-400 shadow-sm' />
                            <label htmlFor="photo"
                                className='bg-blue-600 p-2 rounded-xl text-white cursor-pointer'>selctionner un photo</label>
                            <input
                                id='photo'
                                type="file"
                                {...register('photo')}
                                className="hidden "
                                accept='image/*'
                            />
                        </div>

                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Description className="inline mr-2 text-blue-600" />
                            Description (optionnel)
                        </label>
                        <textarea
                            {...register('description')}
                            rows="3"
                            className="w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                            placeholder="Description du matériel..."
                        />
                    </div>

                    {/* Alerte budget */}
                    {totalEstime > budgetRestant && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                            <div className="flex items-center gap-2 text-red-700">
                                <Warning />
                                <p className="font-medium">Budget insuffisant !</p>
                            </div>
                            <p className="text-sm text-red-600 mt-1">
                                Il manque {(totalEstime - budgetRestant).toLocaleString()} FCFA pour ajouter ce matériel.
                                Réduisez la quantité ou le prix, ou augmentez le budget global.
                            </p>
                        </div>
                    )}

                    {/* Boutons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={totalEstime > budgetRestant}
                            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${totalEstime > budgetRestant
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}>
                            <Save /> Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalAddMateriel;