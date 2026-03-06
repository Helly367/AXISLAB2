import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Close, Save, CalendarToday, Description, Title, Group, Task } from "@mui/icons-material";
import { usePhases } from '../../../../hooks/usePhase';
import { motion } from "framer-motion";

const ModalCreatePhase = ({ isOpen, onClose, project }) => {
    const { createPhase } = usePhases();
    const [loading, setLoading] = useState(false)

    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
        reset,
        watch
    } = useForm({
        defaultValues: {
            title: '',
            description_phase: '',
            date_debut: '',
            date_fin: '',
            taches: [''],
            membres: ['']
        }
    });

    const { fields: tacheFields, append: appendTache, remove: removeTache } =
        useFieldArray({ control, name: 'taches' });

    const { fields: membreFields, append: appendMembre, remove: removeMembre } =
        useFieldArray({ control, name: 'membres' });

    useEffect(() => {
        if (isOpen) {
            reset({
                title: '',
                description_phase: '',
                date_debut: '',
                date_fin: '',
                taches: [''],
                membres: ['']
            });
        }
    }, [isOpen, reset]);

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data) => {
        setLoading(true)

        const cleanedPhase = {
            ...data,
            project_id: project.projet_id,
            date_debut: new Date(data.date_debut).toISOString(),
            date_fin: new Date(data.date_fin).toISOString(),
            taches: (data.taches || []).map(t => t.trim()).filter(Boolean),
            membres: (data.membres || []).map(m => m.trim()).filter(Boolean)
        };

        await new Promise(resolve => setTimeout(resolve, 3000));

        const result = await createPhase(cleanedPhase);

        if (!result.success) {
            console.error(result.error || result.errors);
            setLoading(false);
            return;
        }

        handleClose();
    };

    const dateDebut = watch('date_debut');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                <div className="bg-primary p-4 flex justify-between items-center ">
                    <h2 className="text-xl text-white font-bold">Nouvelle phase</h2>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-blue p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                    {/* Titre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Title className="inline mr-2 text-blue" />
                            Titre de la phase
                        </label>
                        <input
                            type="text"
                            {...register('title', {
                                required: 'Le titre est requis',
                                minLength: { value: 2, message: 'Minimum 2 caractères' }
                            })}
                            className={`w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                           focus:outline-none focus:bg-white focus:border-blue-500
                           transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${errors.title ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Ex: ANALYSE, CONCEPTION..."
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Description className="inline mr-2 text-blue" />
                            Description
                        </label>
                        <textarea
                            {...register('description_phase', {
                                required: 'La description est requise',
                                minLength: { value: 10, message: 'Minimum 10 caractères' }
                            })}
                            rows="4"
                            className={`w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                        focus:outline-none focus:bg-white focus:border-blue-500
                                        transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${errors.description_phase ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Description détaillée de la phase..."
                        />
                        {errors.description_phase && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description_phase.message}
                            </p>
                        )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                className={`w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                            focus:outline-none focus:bg-white focus:border-blue-500
                                            transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${errors.date_debut ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.date_debut && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.date_debut.message}
                                </p>
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
                                    validate: value =>
                                        !dateDebut || value >= dateDebut ||
                                        'La date de fin doit être après la date de début'
                                })}
                                className={`w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                            focus:outline-none focus:bg-white focus:border-blue-500
                                            transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${errors.date_fin ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.date_fin && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.date_fin.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tâches */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Task className="inline mr-2 text-blue" />
                            Tâches
                        </label>

                        <div className="space-y-2">
                            {tacheFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <input
                                        type="text"
                                        {...register(`taches.${index}`)}
                                        className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                                focus:outline-none focus:bg-white focus:border-blue-500
                                                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder={`Tâche ${index + 1}`}
                                    />
                                    {tacheFields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTache(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => appendTache('')}
                            className="mt-2 text-blue hover:text-blue-800 text-sm font-medium">
                            + Ajouter une tâche
                        </button>
                    </div>

                    {/* Membres */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Group className="inline mr-2 text-blue" />
                            Membres
                        </label>

                        <div className="space-y-2">
                            {membreFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <input
                                        type="text"
                                        {...register(`membres.${index}`)}
                                        className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                                    focus:outline-none focus:bg-white focus:border-blue-500
                                                    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        placeholder={`Membre ${index + 1}`}
                                    />
                                    {membreFields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeMembre(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={() => appendMembre('')}
                            className="mt-2 text-blue hover:text-blue-800 text-sm font-medium">
                            + Ajouter un membre
                        </button>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Annuler
                        </button>

                        <motion.button
                            type="submit"
                            disabled={loading || Object.keys(errors).length > 0}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
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
                                    <Save /> Créer

                                </>
                            )}

                        </motion.button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ModalCreatePhase;