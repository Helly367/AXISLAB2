import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Close, Save, CalendarToday, Description, Title, Group, Task } from "@mui/icons-material";

const ModalCreatePhase = ({ isOpen, onClose, onSave }) => {
    const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            title: '',
            description_phase: '',
            date_debut: '',
            date_fin: '',
            taches: [''],
            membres: ['']
        }
    });

    const { fields: tacheFields, append: appendTache, remove: removeTache } = useFieldArray({
        control,
        name: 'taches'
    });

    const { fields: membreFields, append: appendMembre, remove: removeMembre } = useFieldArray({
        control,
        name: 'membres'
    });

    const onSubmit = (data) => {
        const newPhase = {
            id: Date.now(),
            ...data,
            taches: data.taches.filter(t => t.trim() !== ''),
            membres: data.membres.filter(m => m.trim() !== '')
        };
        onSave(newPhase);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0  bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue to-blue-800 p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold">Nouvelle phase</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                {/* Formulaire */}
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
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.title ? 'border-red-500' : 'border-gray-300'
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
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.description_phase ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Description détaillée de la phase..."
                        />
                        {errors.description_phase && (
                            <p className="text-red-500 text-sm mt-1">{errors.description_phase.message}</p>
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
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.date_debut ? 'border-red-500' : 'border-gray-300'
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
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.date_fin ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.date_fin && (
                                <p className="text-red-500 text-sm mt-1">{errors.date_fin.message}</p>
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
                                        {...register(`taches.${index}`, {
                                            required: 'La tâche est requise'
                                        })}
                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                                        {...register(`membres.${index}`, {
                                            required: 'Le membre est requis'
                                        })}
                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <Save /> Créer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCreatePhase;