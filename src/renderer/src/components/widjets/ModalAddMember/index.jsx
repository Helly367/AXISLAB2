import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Close, Save, Person, Work, Email, School, Photo } from "@mui/icons-material";

const ModalAddMember = ({ isOpen, onClose, onSave }) => {
    const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            nom: '',
            poste: '',
            email: '',
            photo: '',
            competences: ['']
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'competences'
    });

    const onSubmit = (data) => {
        const newMember = {
            id: Date.now(),
            ...data,
            competences: data.competences.filter(c => c.trim() !== '')
        };
        onSave(newMember);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue to-blue-800 p-2 flex justify-between items-center sticky top-0">
                    <h2 className="text-[18px] text-white font-bold">Ajouter un membre</h2>
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
                            <Person className="inline mr-2 text-blue" />
                            Nom complet
                        </label>
                        <input
                            type="text"
                            {...register('nom', {
                                required: 'Le nom est requis',
                                minLength: { value: 2, message: 'Minimum 2 caractères' }
                            })}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.nom ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Ex: Jean Dupont"
                        />
                        {errors.nom && (
                            <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
                        )}
                    </div>

                    {/* Poste */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Work className="inline mr-2 text-blue" />
                            Poste dans le projet
                        </label>
                        <input
                            type="text"
                            {...register('poste', {
                                required: 'Le poste est requis',
                                minLength: { value: 2, message: 'Minimum 2 caractères' }
                            })}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.poste ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Ex: Chef de projet, Développeur, Designer..."
                        />
                        {errors.poste && (
                            <p className="text-red-500 text-sm mt-1">{errors.poste.message}</p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Email className="inline mr-2 text-blue" />
                            Email (optionnel)
                        </label>
                        <input
                            type="email"
                            {...register('email', {
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: 'Email invalide'
                                }
                            })}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Ex: jean.dupont@email.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Photo URL */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Photo className="inline mr-2 text-blue" />
                            URL de la photo (optionnel)
                        </label>
                        <input
                            type="url"
                            {...register('photo')}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="https://example.com/photo.jpg"
                        />
                    </div>

                    {/* Compétences */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <School className="inline mr-2 text-blue" />
                            Compétences
                        </label>
                        <div className="space-y-2">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <input
                                        type="text"
                                        {...register(`competences.${index}`, {
                                            required: 'La compétence est requise'
                                        })}
                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                        placeholder={`Compétence ${index + 1}`}
                                    />
                                    {fields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => append('')}
                            className="mt-2 text-blue hover:text-blue-800 text-sm font-medium">
                            + Ajouter une compétence
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
                            <Save /> Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalAddMember;