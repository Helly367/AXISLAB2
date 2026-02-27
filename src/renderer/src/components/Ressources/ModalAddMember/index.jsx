import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Close, Save, Person, Work, Email, School, Photo } from "@mui/icons-material";

const ModalAddMember = ({ isOpen, onClose, onSave }) => {
    const { register, control, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            nom: '',
            poste: '',
            role: '',
            email: '',
            photo: '',
            disponibilite: 100,
            chargeMax: 40,
            competences: [''],
            competencesRequises: ''
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'competences'
    });

    const onSubmit = (data) => {
        // Convertir les compétences requises en tableau
        const competencesRequisesArray = data.competencesRequises
            ? data.competencesRequises.split(',').map(c => c.trim()).filter(c => c)
            : [];

        const newMember = {
            id: Date.now(),
            ...data,
            competences: data.competences.filter(c => c.trim() !== ''),
            competencesRequises: competencesRequisesArray,
            chargeActuelle: 0,
            dateDebut: new Date().toISOString().split('T')[0],
            historique: []
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
                <div className="bg-primary p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold">Ajouter un membre</h2>
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
                            <Person className="inline mr-2 text-primary" />
                            Nom complet
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
                            placeholder="Ex: Jean Dupont"
                        />
                        {errors.nom && (
                            <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
                        )}
                    </div>

                    {/* Poste */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Work className="inline mr-2 text-primary" />
                            Poste dans le projet
                        </label>
                        <input
                            type="text"
                            {...register('poste', {
                                required: 'Le poste est requis',
                                minLength: { value: 2, message: 'Minimum 2 caractères' }
                            })}
                            className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.poste ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Ex: Chef de projet, Développeur, Designer..."
                        />
                        {errors.poste && (
                            <p className="text-red-500 text-sm mt-1">{errors.poste.message}</p>
                        )}
                    </div>

                    {/* Rôle spécifique */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rôle spécifique
                        </label>
                        <input
                            type="text"
                            {...register('role', { required: 'Le rôle est requis' })}
                            className="w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                            placeholder="Ex: Lead développeur, Architecte..."
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Email className="inline mr-2 text-primary" />
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
                            className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Ex: jean.dupont@email.com"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    {/* Disponibilité et charge */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Disponibilité (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                {...register('disponibilite', {
                                    valueAsNumber: true,
                                    min: 0,
                                    max: 100
                                })}
                                className="w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                                defaultValue={100}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Charge max (heures/semaine)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="60"
                                {...register('chargeMax', {
                                    valueAsNumber: true,
                                    min: 0,
                                    max: 60
                                })}
                                className="w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                                defaultValue={40}
                            />
                        </div>
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

                    {/* Compétences */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <School className="inline mr-2 text-primary" />
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
                                        className="flex-1 p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-400"
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
                            className="mt-2 text-primary hover:text-blue-800 text-sm font-medium">
                            + Ajouter une compétence
                        </button>
                    </div>

                    {/* Compétences requises */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Compétences requises (séparées par des virgules)
                        </label>
                        <input
                            type="text"
                            {...register('competencesRequises')}
                            className="w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                            placeholder="React, Node.js, TypeScript..."
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Indiquez les compétences nécessaires pour ce poste
                        </p>
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
                            className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <Save /> Ajouter
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalAddMember;