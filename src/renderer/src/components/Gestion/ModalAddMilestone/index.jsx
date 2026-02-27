import React from 'react';
import { useForm } from 'react-hook-form';
import { Close, Save, Flag, Description, CalendarToday, Category } from "@mui/icons-material";

const ModalAddMilestone = ({ isOpen, onClose, onSave, phases }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            title: '',
            description: '',
            date: '',
            phaseId: '',
            type: 'validation'
        }
    });

    const onSubmit = (data) => {
        onSave({
            ...data,
            phaseId: parseInt(data.phaseId)
        });
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center">
                    <h2 className="text-xl text-white font-bold">Ajouter un jalon</h2>
                    <button onClick={onClose} className="text-white hover:bg-blue-700 p-1 rounded-full">
                        <Close />
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Flag className="inline mr-2 text-blue-600" />
                            Titre du jalon
                        </label>
                        <input
                            type="text"
                            {...register('title', { required: 'Le titre est requis' })}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
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
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
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
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-500' : 'border-gray-300'
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
                                {...register('phaseId', { required: 'La phase est requise' })}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.phaseId ? 'border-red-500' : 'border-gray-300'
                                    }`}>
                                <option value="">Sélectionnez</option>
                                {phases.map(phase => (
                                    <option key={phase.id} value={phase.id}>
                                        {phase.title}
                                    </option>
                                ))}
                            </select>
                            {errors.phaseId && (
                                <p className="text-red-500 text-sm mt-1">{errors.phaseId.message}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Type de jalon
                        </label>
                        <select
                            {...register('type')}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                            <option value="validation">Validation</option>
                            <option value="revue">Revue</option>
                            <option value="livrable">Livrable</option>
                        </select>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                            Annuler
                        </button>
                        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Save /> Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalAddMilestone;