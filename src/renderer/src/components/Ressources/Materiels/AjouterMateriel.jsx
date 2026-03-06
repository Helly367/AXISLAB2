import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Close, Save, Computer, Category,
    AttachMoney, Description, Inventory,
    Warning, Photo
} from "@mui/icons-material";

const AjouterMateriel = ({ isOpen, onClose, onSave, budgetRestant }) => {

    const [preview, setPreview] = useState("");

    const { register, handleSubmit, watch, formState: { errors }, reset } = useForm({
        defaultValues: {
            nom: '',
            categorie: 'informatique',
            prix: '',
            quantite: 1,
            statut: 'disponible',
            description: '',
            photo: '',
            fournisseur: ''
        }
    });

    const watchPrix = watch('prix', 0);
    const watchQuantite = watch('quantite', 1);

    const totalEstime = Number(watchPrix || 0) * Number(watchQuantite || 1);

    const onSubmit = (data) => {

        if (totalEstime > budgetRestant) {
            alert(`Budget insuffisant ! Il manque ${(totalEstime - budgetRestant).toLocaleString()} FCFA`);
            return;
        }

        const photoFile = data.photo?.[0];

        const photoUrl = photoFile
            ? URL.createObjectURL(photoFile)
            : preview;

        const newMateriel = {
            ...data,
            prix: Number(data.prix),
            quantite: Number(data.quantite),
            photo: photoUrl,
            dateAjout: new Date().toISOString()
        };

        onSave(newMateriel);

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
                        Ajouter un matériel
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                    {/* Budget restant */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-blue-800">Budget restant:</span>
                            <span className="text-xl font-bold text-blue-600">
                                {budgetRestant.toLocaleString()} FCFA
                            </span>
                        </div>

                        {totalEstime > 0 && (
                            <div className="mt-2 flex justify-between items-center text-sm">
                                <span className="text-gray-600">Total estimation:</span>
                                <span className={`font-bold ${totalEstime > budgetRestant ? 'text-red-600' : 'text-green-600'}`}>
                                    {totalEstime.toLocaleString()} FCFA
                                    {totalEstime > budgetRestant && ' (dépassement)'}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Computer className="inline mr-2 text-blue-600" />
                            Nom du matériel
                        </label>

                        <input
                            type="text"
                            {...register('nom', {
                                required: 'Le nom est requis',
                                minLength: { value: 2, message: 'Minimum 2 caractères' }
                            })}
                            className="w-full p-3 border-2 border-gray-300 rounded-md"
                        />

                        {errors.nom && (
                            <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
                        )}
                    </div>

                    {/* Catégorie */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Category className="inline mr-2 text-blue-600" />
                            Catégorie
                        </label>

                        <select
                            {...register('categorie')}
                            className="w-full p-3 border-2 border-gray-300 rounded-md">
                            <option value="informatique">Informatique</option>
                            <option value="bureau">Mobilier de bureau</option>
                            <option value="reseau">Réseau</option>
                            <option value="logiciel">Logiciel</option>
                            <option value="securite">Sécurité</option>
                            <option value="autre">Autre</option>
                        </select>
                    </div>

                    {/* Prix + Quantité */}
                    <div className="grid grid-cols-2 gap-4">

                        <input
                            type="number"
                            placeholder="Prix unitaire FCFA"
                            {...register('prix')}
                            className="p-3 border-2 border-gray-300 rounded-md"
                        />

                        <input
                            type="number"
                            placeholder="Quantité"
                            {...register('quantite')}
                            className="p-3 border-2 border-gray-300 rounded-md"
                        />
                    </div>

                    {/* Photo */}
                    <div className="flex flex-col gap-3">

                        <label className="text-sm font-medium">
                            <Photo className="inline mr-2 text-primary" />
                            Photo (optionnel)
                        </label>

                        <div className="flex items-center gap-6 self-center">

                            <img
                                src={preview || "https://via.placeholder.com/150"}
                                alt="preview"
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

                    {/* Description */}
                    <textarea
                        {...register('description')}
                        rows="3"
                        className="w-full p-3 border-2 border-gray-300 rounded-md"
                        placeholder="Description du matériel..."
                    />

                    {/* Alert budget */}
                    {totalEstime > budgetRestant && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-2 text-red-700">
                            <Warning />
                            Budget insuffisant
                        </div>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 border-t pt-4">

                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border rounded-lg hover:bg-gray-100">
                            Annuler
                        </button>

                        <button
                            type="submit"
                            disabled={totalEstime > budgetRestant}
                            className={`px-6 py-2 rounded-lg flex items-center gap-2 ${totalEstime > budgetRestant
                                ? 'bg-gray-300 text-gray-500'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}>
                            <Save /> Ajouter
                        </button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default AjouterMateriel;