import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Close, Save, Campaign, LocationOn,
    Category, AttachMoney, CalendarToday,
    Description, Person, Flag, Photo
} from "@mui/icons-material";

const ModalEditCampagne = ({ isOpen, onClose, onSave, campagneToEdit }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (campagneToEdit) {
            reset({
                nom: campagneToEdit.nom || '',
                ville: campagneToEdit.ville || '',
                secteur: campagneToEdit.secteur || '',
                cout: campagneToEdit.cout || '',
                date_debut: campagneToEdit.date_debut || '',
                date_fin: campagneToEdit.date_fin || '',
                status: campagneToEdit.status || 'inactif',
                description: campagneToEdit.description || '',
                objectif: campagneToEdit.objectif || '',
                responsable: campagneToEdit.responsable || '',
                image: campagneToEdit.image || ''
            });
        }
    }, [campagneToEdit, reset]);

    const onSubmit = (data) => {
        const updatedCampagne = {
            ...campagneToEdit,
            ...data,
            cout: Number(data.cout)
        };
        onSave(updatedCampagne);
        onClose();
    };

    if (!isOpen) return null;

    // Liste des secteurs
    const secteurs = [
        'Technologie', 'Environnement', 'Éducation', 'Santé',
        'Agriculture', 'Commerce', 'Industrie', 'Tourisme',
        'Culture', 'Sport', 'Social', 'Autre'
    ];

    // Villes du Cameroun
    const villes = [
        'Douala', 'Yaoundé', 'Garoua', 'Bamenda', 'Bafoussam',
        'Maroua', 'Ngaoundéré', 'Bertoua', 'Ebolowa', 'Kribi',
        'Limbe', 'Kumbo', 'Buea', 'Foumban', 'Dschang'
    ];

    return (
        <div className="fixed inset-0  bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold">Modifier la campagne</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Campaign className="inline mr-2 text-blue-600" />
                            Nom de la campagne
                        </label>
                        <input
                            type="text"
                            {...register('nom', {
                                required: 'Le nom est requis',
                                minLength: { value: 3, message: 'Minimum 3 caractères' }
                            })}
                            className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.nom ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.nom && (
                            <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
                        )}
                    </div>

                    {/* Ville et Secteur */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <LocationOn className="inline mr-2 text-blue-600" />
                                Ville
                            </label>
                            <select
                                {...register('ville', { required: 'La ville est requise' })}
                                className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.ville ? 'border-red-500' : 'border-gray-300'
                                    }`}>
                                <option value="">Sélectionnez une ville</option>
                                {villes.map(ville => (
                                    <option key={ville} value={ville}>{ville}</option>
                                ))}
                            </select>
                            {errors.ville && (
                                <p className="text-red-500 text-sm mt-1">{errors.ville.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Category className="inline mr-2 text-blue-600" />
                                Secteur
                            </label>
                            <select
                                {...register('secteur', { required: 'Le secteur est requis' })}
                                className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.secteur ? 'border-red-500' : 'border-gray-300'
                                    }`}>
                                <option value="">Sélectionnez un secteur</option>
                                {secteurs.map(secteur => (
                                    <option key={secteur} value={secteur}>{secteur}</option>
                                ))}
                            </select>
                            {errors.secteur && (
                                <p className="text-red-500 text-sm mt-1">{errors.secteur.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Coût */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <AttachMoney className="inline mr-2 text-blue-600" />
                            Budget (FCFA)
                        </label>
                        <input
                            type="number"
                            {...register('cout', {
                                required: 'Le budget est requis',
                                min: { value: 1000, message: 'Minimum 1000 FCFA' }
                            })}
                            className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.cout ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.cout && (
                            <p className="text-red-500 text-sm mt-1">{errors.cout.message}</p>
                        )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-green-600" />
                                Date de début
                            </label>
                            <input
                                type="date"
                                {...register('date_debut', {
                                    required: 'La date de début est requise'
                                })}
                                className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.date_debut ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.date_debut && (
                                <p className="text-red-500 text-sm mt-1">{errors.date_debut.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-red-600" />
                                Date de fin
                            </label>
                            <input
                                type="date"
                                {...register('date_fin', {
                                    required: 'La date de fin est requise',
                                    validate: (value, formValues) => {
                                        return !formValues.date_debut || value >= formValues.date_debut ||
                                            'La date de fin doit être après la date de début';
                                    }
                                })}
                                className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.date_fin ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.date_fin && (
                                <p className="text-red-500 text-sm mt-1">{errors.date_fin.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Statut */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Statut
                        </label>
                        <select
                            {...register('status')}
                            className="w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 focus:ring-2 focus:ring-blue-500">
                            <option value="inactif">Inactif</option>
                            <option value="en_cours">En cours</option>
                            <option value="en_pause">En pause</option>
                            <option value="termine">Terminé</option>
                        </select>
                    </div>

                    {/* Responsable */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Person className="inline mr-2 text-blue-600" />
                            Responsable
                        </label>
                        <input
                            type="text"
                            {...register('responsable', {
                                required: 'Le responsable est requis'
                            })}
                            className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.responsable ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.responsable && (
                            <p className="text-red-500 text-sm mt-1">{errors.responsable.message}</p>
                        )}
                    </div>

                    {/* Objectif */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Flag className="inline mr-2 text-blue-600" />
                            Objectif
                        </label>
                        <input
                            type="text"
                            {...register('objectif', {
                                required: "L'objectif est requis"
                            })}
                            className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.objectif ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.objectif && (
                            <p className="text-red-500 text-sm mt-1">{errors.objectif.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Description className="inline mr-2 text-blue-600" />
                            Description
                        </label>
                        <textarea
                            {...register('description', {
                                required: 'La description est requise',
                                minLength: { value: 10, message: 'Minimum 10 caractères' }
                            })}
                            rows="4"
                            className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
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


                    {/* Planification */}
                    <div className="border rounded-lg p-4">
                        <h3 className="font-medium text-gray-700 mb-4">Planification</h3>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-2">Type de planification</label>
                            <select {...register('planification.type')} className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600">
                                <option value="continue">Continue</option>
                                <option value="par_etapes">Par étapes</option>
                                <option value="evenement">Événement</option>
                                <option value="saisonniere">Saisonnière</option>
                                <option value="formation">Formation</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-600 mb-2">Dates réelles</label>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-xs text-gray-500">Début réel</span>
                                    <input
                                        type="date"
                                        {...register('date_debut_reelle')}
                                        className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                                    />
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Fin réelle</span>
                                    <input
                                        type="date"
                                        {...register('date_fin_reelle')}
                                        className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Budget alloué */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <AttachMoney className="inline mr-2 text-blue-600" />
                            Budget alloué (FCFA)
                        </label>
                        <input
                            type="number"
                            {...register('budgetAlloue', { required: 'Le budget est requis' })}
                            className="w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                        />
                    </div>

                    {/* Objectifs détaillés */}
                    <div className="border rounded-lg p-4">
                        <h3 className="font-medium text-gray-700 mb-4">Objectifs détaillés</h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Objectif quantitatif</label>
                                <input
                                    type="text"
                                    {...register('objectif_quantitatif')}
                                    className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                                    placeholder="Ex: 1000 ventes"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-600 mb-1">Cible (personnes)</label>
                                <input
                                    type="number"
                                    {...register('cible_personnes')}
                                    className="w-full p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 hover:bg-gray-50 transition-colors">
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <Save /> Modifier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalEditCampagne;