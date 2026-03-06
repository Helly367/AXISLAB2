import React, { useEffect, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Close, Save, Person, Work, Email, School, Photo } from "@mui/icons-material";

const ModifyMembre = ({ isOpen, onClose, onSave, memberToEdit }) => {

    const [preview, setPreview] = useState("");

    const { register, control, handleSubmit, formState: { errors }, reset, watch } = useForm({
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

    /* ===============================
       INIT FORM WHEN EDIT DATA CHANGE
    =============================== */

    useEffect(() => {

        if (memberToEdit) {

            setPreview(memberToEdit.photo || "");

            reset({
                nom: memberToEdit.nom || '',
                poste: memberToEdit.poste || '',
                role: memberToEdit.role || '',
                email: memberToEdit.email || '',
                photo: memberToEdit.photo || '',
                disponibilite: memberToEdit.disponibilite ?? 100,
                chargeMax: memberToEdit.chargeMax ?? 40,
                competences: memberToEdit.competences?.length
                    ? memberToEdit.competences
                    : [''],
                competencesRequises:
                    memberToEdit.competencesRequises?.join(', ') || ''
            });
        }

    }, [memberToEdit, reset]);

    /* ===============================
       SUBMIT
    =============================== */

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
            : preview;

        const updatedMember = {
            ...memberToEdit,
            ...data,
            photo: photoUrl,
            disponibilite: Number(data.disponibilite) || 100,
            chargeMax: Number(data.chargeMax) || 40,
            competences: data.competences.filter(c => c.trim() !== ''),
            competencesRequises: competencesRequisesArray
        };

        onSave(updatedMember);
        onClose();
    };

    if (!isOpen) return null;

    /* ===============================
       UI
    =============================== */

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="bg-primary p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold">
                        Modifier le membre
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-700 p-1 rounded-full">
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
                            {...register('nom', { required: 'Le nom est requis' })}
                            className="w-full p-3 border-2 border-gray-400 rounded-md"
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
                        />
                    </div>

                    {/* Photo Preview */}
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
                                className="hidden"
                                accept="image/*"
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
                                    {...register(`competences.${index}`)}
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
                            <Save /> Modifier
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default ModifyMembre;