import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Close, Save, Person, Work, Email, School, Photo } from "@mui/icons-material";

const AjouterMembre = ({ isOpen, onClose, onSave }) => {

    const [preview, setPreview] = useState("");

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

        const competencesRequisesArray = data.competencesRequises
            ? data.competencesRequises
                .split(',')
                .map(c => c.trim())
                .filter(Boolean)
            : [];

        const photoFile = data.photo?.[0];

        const photoUrl = photoFile
            ? URL.createObjectURL(photoFile)
            : "";

        const newMember = {
            id: Date.now(),
            nom: data.nom,
            poste: data.poste,
            role: data.role,
            email: data.email,
            photo: photoUrl || preview,
            disponibilite: Number(data.disponibilite) || 100,
            chargeMax: Number(data.chargeMax) || 40,
            chargeActuelle: 0,
            competences: data.competences.filter(c => c.trim() !== ''),
            competencesRequises: competencesRequisesArray,
            dateDebut: new Date().toISOString().split('T')[0],
            historique: []
        };

        onSave(newMember);

        reset();
        setPreview("");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="bg-primary p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold">
                        Ajouter un membre
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <Person className="inline mr-2 text-primary" />
                            Nom complet
                        </label>

                        <input
                            type="text"
                            {...register('nom', {
                                required: 'Le nom est requis',
                                minLength: { value: 2, message: 'Minimum 2 caractères' }
                            })}
                            className="w-full p-3 border-2 border-gray-400 rounded-md"
                            placeholder="Ex: Jean Dupont"
                        />

                        {errors.nom && (
                            <p className="text-red-500 text-sm">{errors.nom.message}</p>
                        )}
                    </div>

                    {/* Poste */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <Work className="inline mr-2 text-primary" />
                            Poste
                        </label>

                        <input
                            type="text"
                            {...register('poste', { required: 'Le poste est requis' })}
                            className="w-full p-3 border-2 border-gray-400 rounded-md"
                            placeholder="Chef projet, Dev..."
                        />
                    </div>

                    {/* Rôle */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Rôle
                        </label>

                        <input
                            type="text"
                            {...register('role', { required: 'Le rôle est requis' })}
                            className="w-full p-3 border-2 border-gray-400 rounded-md"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <Email className="inline mr-2 text-primary" />
                            Email
                        </label>

                        <input
                            type="email"
                            {...register('email')}
                            className="w-full p-3 border-2 border-gray-400 rounded-md"
                        />
                    </div>

                    {/* Disponibilité */}
                    <div className="grid md:grid-cols-2 gap-4">

                        <input
                            type="number"
                            placeholder="Disponibilité %"
                            {...register('disponibilite', { valueAsNumber: true })}
                            className="p-3 border-2 border-gray-400 rounded-md"
                        />

                        <input
                            type="number"
                            placeholder="Charge max (h/semaine)"
                            {...register('chargeMax', { valueAsNumber: true })}
                            className="p-3 border-2 border-gray-400 rounded-md"
                        />

                    </div>

                    {/* Photo */}
                    <div className="flex flex-col gap-3">

                        <label className="text-sm font-medium">
                            <Photo className="inline mr-2 text-primary" />
                            Photo
                        </label>

                        <div className="flex items-center gap-6 self-center">

                            <img
                                src={preview || "https://via.placeholder.com/150"}
                                alt=""
                                className="w-40 h-40 rounded-full border object-cover"
                            />

                            <label
                                htmlFor="photo"
                                className="bg-blue-600 p-2 rounded-xl text-white cursor-pointer">
                                Sélectionner une photo
                            </label>

                            <input
                                id="photo"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                {...register('photo')}
                                onChange={(e) => {

                                    const file = e.target.files?.[0];

                                    if (file) {
                                        setPreview(URL.createObjectURL(file));
                                    }

                                }}
                            />

                        </div>
                    </div>

                    {/* Compétences */}
                    <div>

                        <label className="block text-sm font-medium mb-2">
                            <School className="inline mr-2 text-primary" />
                            Compétences
                        </label>

                        {fields.map((field, index) => (
                            <div key={field.id} className="flex gap-2 mb-2">

                                <input
                                    type="text"
                                    {...register(`competences.${index}`, {
                                        required: 'Compétence requise'
                                    })}
                                    className="flex-1 p-2 border-2 border-gray-400 rounded-md"
                                />

                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="px-3 bg-red-500 text-white rounded-lg">
                                        ×
                                    </button>
                                )}

                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={() => append('')}
                            className="text-primary text-sm mt-2">
                            + Ajouter compétence
                        </button>

                    </div>

                    {/* Compétences requises */}
                    <div>

                        <label className="text-sm font-medium">
                            Compétences requises (séparées par ,)
                        </label>

                        <input
                            type="text"
                            {...register('competencesRequises')}
                            className="w-full p-3 border-2 border-gray-400 rounded-md"
                        />

                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 border-t pt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border rounded-lg">
                            Annuler
                        </button>

                        <button
                            type="submit"
                            className="bg-primary text-white px-6 py-2 rounded-lg flex items-center gap-2">
                            <Save /> Ajouter
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default AjouterMembre;