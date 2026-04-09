import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Close,
    Save,
    Person2Rounded,
    Description,
    Flag,
    CalendarToday,
    GroupAdd,
    Category,
    AccessTime,

} from '@mui/icons-material';
import { typesProjets, availableProspects } from '../../../Services/listes';
import { useProjects } from '../../../hooks/useProjets';
import { alertService } from '../../../Services/alertService';
import { motion, AnimatePresence } from 'framer-motion'
import { verifieChamps, styleChamps } from '../../../Services/functions';

const ProfileModify = ({ isOpen, onClose, project }) => {
    const { register, handleSubmit, formState: { errors, isDirty }, reset, setValue, setError, watch, clearErrors } = useForm();
    const { updateProject } = useProjects();
    const [loading, setLoading] = useState(false)
    const [isProspectChanged, setIsProspectChanged] = useState(false);

    // Fonction pour mettre à jour les données du projet

    // État local pour les prospects sélectionnés
    const [selectedProspects, setSelectedProspects] = useState([]);
    const watchedFields = watch()



    useEffect(() => {
        if (project) {

            if (!project) return;

            let prospects = [];

            if (Array.isArray(project.prospects_cibles)) {
                prospects = project.prospects_cibles;

            } else if (typeof project.prospects_cibles === "string") {
                try {
                    prospects = JSON.parse(project.prospects_cibles);
                } catch {
                    prospects = [];
                }
            }

            setSelectedProspects(prospects);


            reset({
                nom_projet: project.nom_projet || '',
                description: project.description || '',
                chef_projet: project.chef_projet || '',
                objectif_court_terme: project.objectif_court_terme || '',
                objectif_court_terme_debut: formatDate(project.objectif_court_terme_debut),
                objectif_court_terme_fin: formatDate(project.objectif_court_terme_fin),
                objectif_long_terme: project.objectif_long_terme || '',
                objectif_long_terme_debut: formatDate(project.objectif_long_terme_debut),
                objectif_long_terme_fin: formatDate(project.objectif_long_terme_fin),
                date_debut: formatDate(project.date_debut),
                date_fin: formatDate(project.date_fin),
                status: project.status || 'planification',
                type_projet: project.type_projet || '',

            });

        }
    }, [project?.projet_id]);

    // Gérer la sélection/désélection des prospects
    const handleProspectToggle = (prospects_cibles) => {
        setIsProspectChanged(true)
        setSelectedProspects(prev => {
            if (prev.includes(prospects_cibles)) {
                return prev.filter(p => p !== prospects_cibles);

            } else {

                return [...prev, prospects_cibles];
            }

        });
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
    };

    const isDirtyVerify = (prospectChanged, dirty) => {

        if (!prospectChanged && !dirty) {
            alertService.info("Aucune modification détectée");
            setLoading(false);
            return false;
        }

        return true;
    }

    // Sélectionner tous les prospects
    const handleSelectAll = () => {
        if (selectedProspects.length === availableProspects.length) {
            setSelectedProspects([]);
        } else {
            setSelectedProspects([...availableProspects]);
        }
    };

    const style = styleChamps();


    const onSubmit = async (data) => {

        const vf = isDirtyVerify(isProspectChanged, isDirty)

        console.log("vf", vf);


        if (!vf) {
            return null;
        }

        try {

            setLoading(true)
            // Convertir les dates au format ISO
            const formattedData = {
                ...data,
                prospects_cibles: selectedProspects
            };

            // simulation chargement
            await new Promise(resolve => setTimeout(resolve, 3000))
            const response = await updateProject(project.projet_id, formattedData);

            alertService.handleBackendResponse(response);
            if (response.success) {
                alertService.success("Projet modifié avec succès");
                setIsProspectChanged(false)
                setLoading(false);
                onClose();
            } else {
                if (!response.success) {
                    if (response.errors) {
                        response.errors.forEach(err => {
                            setError(err.field, {
                                type: "manual",
                                message: err.message
                            });
                        });
                    }
                    return;
                }
                setIsProspectChanged(false)
                setLoading(false);

            }


        } catch (error) {
            console.log(error.message);
            setIsProspectChanged(false)
            setLoading(false);


        }

    };

    const handlerClose = () => {
        setLoading(false);
        clearErrors();
        onClose();
    };




    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-primary p-2 flex justify-between items-center sticky top-0">
                    <h2 className="text-2xd text-white font-bold">Modifier le projet</h2>
                    <button
                        onClick={handlerClose}
                        className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Informations générales */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Person2Rounded className="inline mr-2 text-blue-600" />
                                Nom du projet
                            </label>
                            <input

                                type="text"
                                {...register('nom_projet', { required: 'Le nom du projet est requis' })}
                                maxLength={80} // limite stricte
                                onChange={(e) => {
                                    if (e.target.value.length > 80) {
                                        e.target.value = e.target.value.slice(0, 80);
                                    }
                                    // mettre à jour React Hook Form
                                    register('nom_projet').onChange(e)
                                }}
                                className={`${style} ${verifieChamps(errors, watchedFields, 'nom_projet')} `}
                            />
                            {errors.nom_projet && (
                                <p className="text-red-500 text-sm mt-1">{errors.nom_projet.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Person2Rounded className="inline mr-2 text-blue-600" />
                                Chef de projet
                            </label>
                            <input
                                type="text"
                                {...register('chef_projet', { required: 'Le chef de projet est requis' })}
                                maxLength={80} // limite stricte
                                onChange={(e) => {
                                    if (e.target.value.length > 80) {
                                        e.target.value = e.target.value.slice(0, 80);
                                    }
                                    // mettre à jour React Hook Form
                                    register('nom_projet').onChange(e)
                                }}
                                className={`${style} ${verifieChamps(errors, watchedFields, 'chef_projet')}`}
                            />
                            {errors.chef_projet && (
                                <p className="text-red-500 text-sm mt-1">{errors.chef_projet.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Dates du projet */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-green-600" />
                                Date de début
                            </label>
                            <input
                                type="date"
                                {...register('date_debut', { required: 'La date de  début est requise' })}
                                className={`${style} ${verifieChamps(errors, watchedFields, 'date_debut')}`}

                            />
                            {errors.date_debut && (
                                <p className="text-red-500 text-sm mt-1">{errors.date_debut.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-blue-600" />
                                Date de fin prévue
                            </label>
                            <input
                                type="date"
                                {...register('date_fin', { required: 'La date de fin est requise' })}
                                className={`${style} ${verifieChamps(errors, watchedFields, 'date_fin')}`}
                            />
                            {errors.date_fin && (
                                <p className="text-red-500 text-sm mt-1">{errors.date_fin.message}</p>
                            )}
                        </div>


                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Description className="inline mr-2 text-blue-600" />
                            Description du projet
                        </label>
                        <textarea
                            {...register('description', { required: 'La description est requise' })}
                            rows="4"
                            maxLength={500} // limite stricte
                            onChange={(e) => {
                                if (e.target.value.length > 80) {
                                    e.target.value = e.target.value.slice(0, 500);
                                }
                                // mettre à jour React Hook Form
                                register('nom_projet').onChange(e)
                            }}
                            className={`${style} ${verifieChamps(errors, watchedFields, 'description')}`}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Objectifs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Flag className="inline mr-2 text-yellow-600" />
                                Objectif court terme
                            </label>
                            <textarea
                                {...register('objectif_court_terme', { required: 'champs requis' })}
                                rows="3"
                                className={`${style} ${verifieChamps(errors, watchedFields, 'objectif_court_terme')}`}
                                maxLength={250} // limite stricte
                                onChange={(e) => {
                                    if (e.target.value.length > 250) {
                                        e.target.value = e.target.value.slice(0, 250);
                                    }
                                    // mettre à jour React Hook Form
                                    register('nom_projet').onChange(e)
                                }}
                                placeholder="Description de l'objectif à court terme..."
                            />
                            {errors.objectif_court_terme && (
                                <p className="text-red-500 text-sm mt-1">{errors.objectif_court_terme.message}</p>
                            )}

                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <span className="text-xs text-gray-500">Début</span>
                                    <input
                                        type="date"
                                        {...register('objectif_court_terme_debut', { required: 'date requise' })}
                                        className={`${style} ${verifieChamps(errors, watchedFields, 'objectif_court_terme_debut')}`}
                                    />
                                    {errors.objectif_court_terme_debut && (
                                        <p className="text-red-500 text-sm mt-1">{errors.objectif_court_terme_debut.message}</p>
                                    )}
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Fin</span>
                                    <input
                                        type="date"
                                        {...register('objectif_court_terme_fin', { required: 'date requise' })}
                                        className={`${style} ${verifieChamps(errors, watchedFields, 'objectif_court_terme_fin')}`}
                                    />
                                    {errors.objectif_court_terme_fin && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.objectif_court_terme_fin.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Flag className="inline mr-2 text-green-600" />
                                Objectif long terme
                            </label>
                            <textarea
                                {...register('objectif_long_terme', { required: 'champs requis' })}
                                rows="3"
                                className={`${style} ${verifieChamps(errors, watchedFields, 'objectif_long_terme')}`}
                                maxLength={250} // limite stricte
                                onChange={(e) => {
                                    if (e.target.value.length > 250) {
                                        e.target.value = e.target.value.slice(0, 250);
                                    }
                                    // mettre à jour React Hook Form
                                    register('nom_projet').onChange(e)
                                }}
                                placeholder="Description de l'objectif à long terme..."
                            />
                            {errors.objectif_long_terme && (
                                <p className="text-red-500 text-sm mt-1">{errors.objectif_long_terme.message}</p>
                            )}


                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <span className="text-xs text-gray-500">Début</span>
                                    <input
                                        type="date"
                                        {...register('objectif_long_terme_debut', { required: 'date requise' })}
                                        className={`${style} ${verifieChamps(errors, watchedFields, 'objectif_long_terme_debut')}`}
                                    />
                                    {errors.objectif_long_terme_debut && (
                                        <p className="text-red-500 text-sm mt-1">{errors.objectif_long_terme_debut.message}</p>
                                    )}
                                </div>

                                <div>
                                    <span className="text-xs text-gray-500">Fin</span>
                                    <input
                                        type="date"
                                        {...register('objectif_long_terme_fin', { required: 'date requise' })}
                                        className={`${style} ${verifieChamps(errors, watchedFields, 'objectif_long_terme_fin')}`}
                                    />
                                    {errors.objectif_long_terme_fin && (
                                        <p className="text-red-500 text-sm mt-1">{errors.objectif_long_terme_fin.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prospects avec cases à cocher */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                <GroupAdd className="inline mr-2 text-red-600" />
                                Prospects cibles
                            </label>
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                {selectedProspects.length === availableProspects.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                            </button>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {availableProspects.map((prospect, index) => (
                                    <label
                                        key={`${prospect}-${index}`}
                                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${selectedProspects.includes(prospect)
                                            ? 'bg-green-50 border border-green-200'
                                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                                            }`}>
                                        <input
                                            type="checkbox"
                                            checked={selectedProspects.includes(prospect)}
                                            onChange={() => handleProspectToggle(prospect)}
                                            className="hidden"
                                        />
                                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${selectedProspects.includes(prospect)
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white border-2 border-gray-300'
                                            }`}>
                                            {selectedProspects.includes(prospect) && (
                                                <span className="text-xs">✓</span>
                                            )}
                                        </div>
                                        <span className={`text-sm ${selectedProspects.includes(prospect)
                                            ? 'font-medium text-green-700'
                                            : 'text-gray-700'
                                            }`}>
                                            {prospect}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            {selectedProspects.length} prospect(s) sélectionné(s)
                        </p>
                    </div>

                    {/* Type de projet */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Category className="inline mr-2 text-gray-600" />
                                Type de projet
                            </label>

                            <select
                                {...register('type_projet', { required: 'champs requise' })}
                                value={typesProjets[0]}
                                className={`${style} ${verifieChamps(errors, watchedFields, 'type_projet')} `}>

                                {typesProjets.map((type, index) => (
                                    <option key={index} value={type}>{type}</option>
                                ))}
                            </select>
                            {errors.type_projet && (
                                <p className="text-red-500 text-sm mt-1">{errors.type_projet.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <AccessTime className="inline mr-2 text-blue-600" />
                                Statut
                            </label>
                            <select
                                {...register('status', { required: 'champs requise' })}
                                className={`${style} ${verifieChamps(errors, watchedFields, 'status')} `}>
                                <option value="planification">Planification</option>
                                <option value="termine">Terminé</option>
                                <option value="en_pause">En pause</option>
                                <option value="annule">Annulé</option>
                            </select>
                            {errors.status && (
                                <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>
                            )}
                        </div>


                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Annuler
                        </button>


                        <motion.button
                            type="submit"
                            disabled={loading || Object.keys(errors).length > 0}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed'
                        >

                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Enregistrement en cours...
                                </>
                            ) : (
                                <>
                                    <Save /> Enregistrer les modifications

                                </>
                            )}

                        </motion.button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileModify;