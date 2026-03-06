import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Close, Save, Computer, Category,
    AttachMoney, Description, Inventory,
    Warning, Photo
} from "@mui/icons-material";

const ModifyMateriel = ({ isOpen, onClose, onSave, materielToEdit, budgetRestant }) => {

    const { register, handleSubmit, watch, formState: { errors }, reset, setValue } = useForm();

    const [previewImage, setPreviewImage] = useState(null);

    useEffect(() => {
        if (materielToEdit) {

            reset({
                nom: materielToEdit.nom || '',
                categorie: materielToEdit.categorie || 'informatique',
                prix: materielToEdit.prix || '',
                quantite: materielToEdit.quantite || 1,
                statut: materielToEdit.statut || 'disponible',
                description: materielToEdit.description || '',
                fournisseur: materielToEdit.fournisseur || ''
            });

            setPreviewImage(materielToEdit.image || null);
        }

    }, [materielToEdit, reset]);

    const watchPrix = watch('prix', 0);
    const watchQuantite = watch('quantite', 1);

    const totalEstime = Number(watchPrix || 0) * Number(watchQuantite || 1);

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (file) {
            const url = URL.createObjectURL(file);

            setPreviewImage(url);
            setValue('photo', file);
        }
    };

    const onSubmit = (data) => {

        if (totalEstime > budgetRestant) return;

        const updatedMateriel = {
            ...materielToEdit,
            ...data,
            prix: Number(data.prix),
            quantite: Number(data.quantite),
            image: previewImage
        };

        onSave(updatedMateriel);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                <div className="bg-primary p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold">Modifier le matériel</h2>

                    <button onClick={onClose} className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <span className="font-medium text-blue-800">
                            Budget disponible :
                        </span>

                        <span className="ml-3 text-xl font-bold text-blue-600">
                            {budgetRestant.toLocaleString()} USD
                        </span>
                    </div>

                    {/* Image preview */}
                    <div className="flex flex-col items-center gap-4">

                        <div className="w-40 h-40 rounded-full border overflow-hidden flex items-center justify-center bg-gray-50">
                            {previewImage ? (
                                <img
                                    src={previewImage}
                                    alt="preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <Photo className="text-gray-400 text-6xl" />
                            )}
                        </div>

                        <label className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700">
                            Sélectionner une photo
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    </div>

                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            <Computer className="inline mr-2 text-blue-600" />
                            Nom du matériel
                        </label>

                        <input
                            {...register('nom', {
                                required: 'Nom requis',
                                minLength: { value: 2, message: 'Minimum 2 caractères' }
                            })}
                            className="w-full p-3 border rounded-lg border-gray-300"
                        />

                        {errors.nom && (
                            <p className="text-red-500 text-sm">{errors.nom.message}</p>
                        )}
                    </div>

                    {/* Prix + Quantité */}
                    <div className="grid grid-cols-2 gap-4">

                        <input
                            type="number"
                            {...register('prix', { required: true, min: 0 })}
                            placeholder="Prix unitaire"
                            className="p-3 border rounded-lg"
                        />

                        <input
                            type="number"
                            {...register('quantite', { required: true, min: 1 })}
                            placeholder="Quantité"
                            className="p-3 border rounded-lg"
                        />

                    </div>

                    {totalEstime > budgetRestant && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex gap-2 text-red-700">
                            <Warning />
                            Budget insuffisant pour cette modification
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 border-t pt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                            Annuler
                        </button>

                        <button
                            type="submit"
                            disabled={totalEstime > budgetRestant}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 disabled:bg-gray-300">
                            <Save /> Modifier
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default ModifyMateriel;