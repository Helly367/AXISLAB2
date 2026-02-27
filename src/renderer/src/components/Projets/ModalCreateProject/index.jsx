import React from 'react';
import { useForm } from 'react-hook-form';
import {
    Close,
    Save,
    Folder,
    Person,
    AttachMoney,
    CalendarToday,
    Description,
    Flag
} from "@mui/icons-material";

const ModalCreateProject = ({ isOpen, onClose, onSave }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: {
            nom: '',
            description: '',
            client: '',
            chef_projet: '',
            date_debut: new Date().toISOString().split('T')[0],
            date_fin_prevue: '',
            budget_total: '',
            priorite: 'moyenne',
            statut: 'planifie'
        }
    });

    const onSubmit = (data) => {
        onSave({
            ...data,
            budget_total: parseInt(data.budget_total)
        });
        reset();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold flex items-center gap-2">
                        <Folder />
                        Créer un nouveau projet
                    </h2>
                    <button onClick={onClose} className="text-white hover:bg-blue-700 p-1 rounded-full">
                        <Close />
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Nom du projet */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nom du projet
                        </label>
                        <input
                            type="text"
                            {...register('nom', { required: 'Le nom est requis' })}
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.nom ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="Ex: Développement Application Mobile"
                        />
                        {errors.nom && (
                            <p className="text-red-500 text-sm mt-1">{errors.nom.message}</p>
                        )}
                    </div>

                    {/* Description */}
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
                            placeholder="Description détaillée du projet..."
                        />
                    </div>

                    {/* Client et Chef de projet */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Client
                            </label>
                            <input
                                type="text"
                                {...register('client', { required: 'Le client est requis' })}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.client ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Nom du client"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Person className="inline mr-2 text-blue-600" />
                                Chef de projet
                            </label>
                            <input
                                type="text"
                                {...register('chef_projet', { required: 'Le chef de projet est requis' })}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.chef_projet ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Nom du responsable"
                            />
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-green-600" />
                                Date de début
                            </label>
                            <input
                                type="date"
                                {...register('date_debut', { required: 'La date de début est requise' })}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.date_debut ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-red-600" />
                                Date de fin prévue
                            </label>
                            <input
                                type="date"
                                {...register('date_fin_prevue', { required: 'La date de fin est requise' })}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.date_fin_prevue ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Budget et Priorité */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <AttachMoney className="inline mr-2 text-green-600" />
                                Budget total (FCFA)
                            </label>
                            <input
                                type="number"
                                {...register('budget_total', {
                                    required: 'Le budget est requis',
                                    min: { value: 0, message: 'Budget invalide' }
                                })}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.budget_total ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="0"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Flag className="inline mr-2 text-orange-600" />
                                Priorité
                            </label>
                            <select
                                {...register('priorite')}
                                className="w-full p-3 border border-gray-300 rounded-lg">
                                <option value="basse">Basse</option>
                                <option value="moyenne">Moyenne</option>
                                <option value="haute">Haute</option>
                            </select>
                        </div>
                    </div>

                    {/* Statut initial */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Statut initial
                        </label>
                        <select
                            {...register('statut')}
                            className="w-full p-3 border border-gray-300 rounded-lg">
                            <option value="planifie">Planifié</option>
                            <option value="en_cours">En cours</option>
                            <option value="en_pause">En pause</option>
                        </select>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Save /> Créer le projet
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalCreateProject;