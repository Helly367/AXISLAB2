import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Close, Save, Flag, Description, CalendarToday, Category } from "@mui/icons-material";
import { useJalon } from '../../../../hooks/useJalon';
import { motion } from 'framer-motion';

const AddJalon = ({ isOpen, onClose, phases, project }) => {
    const { ajouteJalon } = useJalon();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            title: '',
            description: '',
            date: '',
            phase_id: '',
            projet_id: '',
            type: 'validation'
        }
    });

    // Reset automatique à l'ouverture
    useEffect(() => {
        if (isOpen) {
            reset({
                title: '',
                description: '',
                date: '',
                phase_id: '',
                projet_id: '',
                type: 'validation'
            });
        }
    }, [isOpen, reset]);

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toISOString().split('T')[0];
    };

    const onSubmit = async (data) => {
        setLoading(true);

        const formattedData = {
            ...data,
            date: formatDate(data.date),
            phase_id: Number(data.phase_id),
            projet_id: Number(project.projet_id)
        };


        await new Promise(resolve => setTimeout(resolve, 3000));
        const result = await ajouteJalon(formattedData);


        if (!result.success) {
            console.error(result.error || result.errors);
            setLoading(false);
            return;
        }

        setLoading(false);
        handleClose();


    };

    const handleClose = () => {
        reset();
        onClose();
    };



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">

                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center">
                    <h2 className="text-xl text-white font-bold">Ajouter un jalon</h2>
                    <button onClick={handleClose} className="text-white hover:bg-blue-700 p-1 rounded-full">
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Flag className="inline mr-2 text-blue-600" />
                            Titre du jalon
                        </label>
                        <input
                            type="text"
                            {...register('title', { required: 'Le titre est requis' })}
                            className={`w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                focus:outline-none focus:bg-white focus:border-blue-500
                                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${errors.title ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Ex: Validation du cahier des charges"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Description className="inline mr-2 text-blue-600" />
                            Description
                        </label>
                        <textarea
                            {...register('description', { required: 'La description est requise' })}
                            rows="3"
                            className={`w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                focus:outline-none focus:bg-white focus:border-blue-500
                                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Description du jalon..."
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-blue-600" />
                                Date
                            </label>
                            <input
                                type="date"
                                {...register('date', { required: 'La date est requise' })}
                                className={`w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                    focus:outline-none focus:bg-white focus:border-blue-500
                                    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${errors.date ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.date && (
                                <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Category className="inline mr-2 text-blue-600" />
                                Phase
                            </label>
                            <select
                                {...register('phase_id', { required: 'La phase est requise' })}
                                className={`w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                    focus:outline-none focus:bg-white focus:border-blue-500
                                    transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${errors.phaseId ? 'border-red-500' : 'border-gray-300'
                                    }`}>
                                <option value="">Sélectionnez</option>
                                {phases.map(phase => (
                                    <option key={phase.phase_id} value={phase.phase_id}>
                                        {phase.title}
                                    </option>
                                ))}
                            </select>
                            {errors.phaseId && (
                                <p className="text-red-500 text-sm mt-1">{errors.phase_id.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type de jalon
                        </label>
                        <select
                            {...register('type')}
                            className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                focus:outline-none focus:bg-white focus:border-blue-500
                                transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                            <option value="validation">Validation</option>
                            <option value="revue">Revue</option>
                            <option value="livrable">Livrable</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 border rounded-lg hover:bg-gray-50">
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
                                    Ajoute en cours...
                                </>
                            ) : (
                                <>
                                    <Save /> Ajouter

                                </>
                            )}

                        </motion.button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default AddJalon;