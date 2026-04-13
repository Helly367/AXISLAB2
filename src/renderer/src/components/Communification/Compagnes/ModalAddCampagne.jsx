import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Close, Save, Campaign, LocationOn,
    Category, AttachMoney, CalendarToday,
    Description, Person, Flag, Warning
} from "@mui/icons-material";
import { formatMontant, styleChamps, verifieChamps } from '../../../Services/functions';
import { motion } from 'framer-motion';
import { useCampagnes } from '../../../hooks/useCampagnes';
import { useBudgets } from '../../../hooks/useBudgets';

const ModalAddCampagne = ({ isOpen, onClose, project }) => {
    const [loading, setLoading] = useState(false);
    const [isDepassement, setisDepassement] = useState(false);
    const [erreurDepassement, setErreurDepassement] = useState('');
    const { createCampagne } = useCampagnes();
    const { setBudget, budget } = useBudgets();


    useEffect(() => {

        if (isOpen) {
            setisDepassement(false);
            setErreurDepassement('');
            setLoading(false);
        }

    }, [isOpen]);

    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
        defaultValues: {
            nom_compagne: '',
            ville: '',
            secteur: '',
            cout: '',
            date_debut: '',
            date_fin: '',
            status: 'inactif',
            description: '',
            objectif: '',
            responsable: '',
            planification: {
                type: "continue",
                etapes: [],
                canaux: [],
                formateurs: []
            },
            resultats: {}
        }


    });

    const watchedFields = watch();
    const style = styleChamps();

    const handleClose = () => {
        setLoading(false);
        reset();
        onClose();

    };


    const onSubmit = async (data) => {

        if (Number(data.cout) > Number(budget.budget_restant)) {

            setisDepassement(true);
            setErreurDepassement(`Attention : le cout   dépasse le budget restant du projet (${budget.budget_restant} ${budget.devise}). Veuillez ajuster le budget ou le coût de la campagne.`);
            setLoading(false);
            return;

        }

        setLoading(true);
        const newCampagne = {
            ...data,
            cout: Number(data.cout),
            date_debut: data.date_debut,
            date_fin: data.date_fin,
            projet_id: project?.projet_id,
        };

        await new Promise(resolve => setTimeout(resolve, 3000))
        const response = await createCampagne(newCampagne);


        console.log(response);

        if (!response.success) {
            console.error(response.error || response.errors);
            setLoading(false);
            return;
        }

        setBudget(response.data?.budget);
        setLoading(false);
        handleClose();

    };

    if (!isOpen) return null;

    // Liste des secteurs
    const secteurs = [
        'Technologie', 'Environnement', 'Éducation', 'Santé',
        'Agriculture', 'Commerce', 'Industrie', 'Tourisme',
        'Culture', 'Sport', 'Social', 'Autre'
    ];



    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-primary p-2 flex justify-between items-center sticky top-0">
                    <h2 className="text-2xd text-white font-bold">Nouvelle campagne</h2>
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
                            {...register('nom_compagne', {
                                required: 'Le nom est requis',
                                minLength: { value: 3, message: 'Minimum 3 caractères' }
                            })}
                            maxLength={50} // limite stricte
                            onChange={(e) => {
                                if (e.target.value.length > 50) {
                                    e.target.value = e.target.value.slice(0, 50);
                                }
                                // mettre à jour React Hook Form
                                register("budget_phase").onChange(e)
                            }}
                            className={`${style} ${verifieChamps(errors, watchedFields, "nom_compagne")} `}
                            placeholder="Ex: Lancement produit X"
                        />
                        {errors.nom_compagne && (
                            <p className="text-red-500 text-sm mt-1">{errors.nom_compagne.message}</p>
                        )}
                    </div>

                    {/* Ville et Secteur */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <LocationOn className="inline mr-2 text-blue-600" />
                                Ville
                            </label>
                            <input
                                type='text'
                                {...register('ville', { required: 'La ville est requise' })}
                                maxLength={30} // limite stricte
                                onChange={(e) => {
                                    if (e.target.value.length > 30) {
                                        e.target.value = e.target.value.slice(0, 30);
                                    }
                                    // mettre à jour React Hook Form
                                    register("ville").onChange(e)
                                }}
                                placeholder='Ex: Kinshasa'
                                className={`${style} ${verifieChamps(errors, watchedFields, "ville")} `} />


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

                                className={`${style} ${verifieChamps(errors, watchedFields, "secteur")} `}>
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

                                className={`${style} ${verifieChamps(errors, watchedFields, "date_debut")} `}
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

                                className={`${style} ${verifieChamps(errors, watchedFields, "date_fin")} `}
                            />
                            {errors.date_fin && (
                                <p className="text-red-500 text-sm mt-1">{errors.date_fin.message}</p>
                            )}
                        </div>
                    </div>



                    {/* Statut */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Statut initial
                        </label>
                        <select
                            {...register('status')}

                            className={`${style} ${verifieChamps(errors, watchedFields, "status")} `}>
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
                            c maxLength={20} // limite stricte
                            onChange={(e) => {
                                if (e.target.value.length > 20) {
                                    e.target.value = e.target.value.slice(0, 20);
                                }
                                // mettre à jour React Hook Form
                                register("responsable").onChange(e)
                            }}
                            className={`${style} ${verifieChamps(errors, watchedFields, "responsable")} `}
                            placeholder="Nom du responsable"
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
                            maxLength={100} // limite stricte
                            onChange={(e) => {
                                if (e.target.value.length > 100) {
                                    e.target.value = e.target.value.slice(0, 100);
                                }
                                // mettre à jour React Hook Form
                                register("objectif").onChange(e)
                            }}
                            className={`${style} ${verifieChamps(errors, watchedFields, "objectif")} `}
                            placeholder="Ex: Atteindre 1000 ventes"
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
                            maxLength={150} // limite stricte
                            onChange={(e) => {
                                if (e.target.value.length > 150) {
                                    e.target.value = e.target.value.slice(0, 150);
                                }
                                // mettre à jour React Hook Form
                                register("description").onChange(e)
                            }}
                            className={`${style} ${verifieChamps(errors, watchedFields, "description")} `}
                            placeholder="Description détaillée de la campagne..."
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>


                    {/* Coût */}
                    <div>
                        <label className="flex gap-3 text-sm font-medium text-gray-700 mb-2">
                            <span>
                                <AttachMoney className="inline mr-2 text-blue-600" />
                                Budget de la campagne
                            </span>
                            <span className='text-green-600'>
                                /  budget du projet : {formatMontant(budget?.budget_restant)} {budget?.devise}
                            </span>

                        </label>
                        <input
                            type="number"
                            {...register('cout', {
                                required: 'Le budget est requis',
                                min: { value: 1000, message: 'Minimum 1000' }
                            })}
                            maxLength={20} // limite stricte
                            onChange={(e) => {
                                if (e.target.value.length > 20) {
                                    e.target.value = e.target.value.slice(0, 20);
                                }
                                // mettre à jour React Hook Form
                                register("cout").onChange(e)
                            }}
                            className={`${style} ${verifieChamps(errors, watchedFields, "cout")} `}
                            placeholder="0"
                        />
                        {errors.cout && (
                            <p className="text-red-500 text-sm mt-1">{errors.cout.message}</p>
                        )}

                        {isDepassement && (

                            <div className="w-full bg-red-50 border border-red-200 rounded-lg p-4  m-auto mt-3">
                                <p className="text-2xd text-red-700 flex items-start gap-2">
                                    <Warning className="text-red-600 shrink-0" fontSize="small" />
                                    <span>{erreurDepassement}</span>
                                </p>
                            </div>

                        )}


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

                        <motion.button
                            type="submit"
                            disabled={loading || Object.keys(errors).length > 0}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed'
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Création en cours ...
                                </>
                            ) : (
                                <>
                                    <Save /> Créer la campagne
                                </>
                            )}
                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalAddCampagne;