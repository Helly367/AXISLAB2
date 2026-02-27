import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Close,
    Save,
    Warning,
    Assignment,
    Person,
    CalendarToday,
    Category,
    TrendingUp,
    PriorityHigh
} from "@mui/icons-material";

const ModalEditRisk = ({ isOpen, onClose, onSave, riskToEdit }) => {
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (riskToEdit) {
            reset({
                nom: riskToEdit.nom || '',
                description: riskToEdit.description || '',
                categorie: riskToEdit.categorie || 'technique',
                probabilite: riskToEdit.probabilite || 0.5,
                impact: riskToEdit.impact || 0.5,
                plan_mitigation: riskToEdit.plan_mitigation || '',
                plan_contingence: riskToEdit.plan_contingence || '',
                responsable: riskToEdit.responsable || '',
                date_identification: riskToEdit.date_identification || '',
                date_revision: riskToEdit.date_revision || '',
                statut: riskToEdit.statut || 'actif',
                commentaires: riskToEdit.commentaires || ''
            });
        }
    }, [riskToEdit, reset]);

    const onSubmit = (data) => {
        const updatedRisk = {
            ...riskToEdit,
            ...data,
            probabilite: parseFloat(data.probabilite),
            impact: parseFloat(data.impact)
        };
        onSave(updatedRisk);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-600 to-red-800 p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold flex items-center gap-2">
                        <Warning />
                        Modifier le risque
                    </h2>
                    <button onClick={onClose} className="text-white hover:bg-red-700 p-1 rounded-full">
                        <Close />
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Mêmes champs que ModalAddRisk */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Warning className="inline mr-2 text-red-600" />
                            Nom du risque
                        </label>
                        <input
                            type="text"
                            {...register('nom', { required: 'Le nom est requis' })}
                            className={`w-full p-3 focus:outline-red-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.nom ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Description
                        </label>
                        <textarea
                            {...register('description', { required: 'La description est requise' })}
                            rows="3"
                            className={`w-full p-3 focus:outline-red-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Category className="inline mr-2 text-blue-600" />
                            Catégorie
                        </label>
                        <select
                            {...register('categorie')}
                            className="w-full p-3 focus:outline-red-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600">
                            <option value="technique">Technique</option>
                            <option value="financier">Financier</option>
                            <option value="ressources">Ressources humaines</option>
                            <option value="externe">Externe</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <TrendingUp className="inline mr-2 text-blue-600" />
                                Probabilité (0-1)
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                {...register('probabilite')}
                                className="w-full"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <PriorityHigh className="inline mr-2 text-orange-600" />
                                Impact (0-1)
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                {...register('impact')}
                                className="w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Assignment className="inline mr-2 text-green-600" />
                            Plan de mitigation
                        </label>
                        <textarea
                            {...register('plan_mitigation', { required: 'Le plan de mitigation est requis' })}
                            rows="2"
                            className={`w-full p-3 focus:outline-red-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.plan_mitigation ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Assignment className="inline mr-2 text-purple-600" />
                            Plan de contingence
                        </label>
                        <textarea
                            {...register('plan_contingence')}
                            rows="2"
                            className="w-full p-3 focus:outline-red-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Person className="inline mr-2 text-blue-600" />
                                Responsable
                            </label>
                            <input
                                type="text"
                                {...register('responsable', { required: 'Le responsable est requis' })}
                                className={`w-full p-3 focus:outline-red-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.responsable ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-green-600" />
                                Date de révision
                            </label>
                            <input
                                type="date"
                                {...register('date_revision')}
                                className="w-full p-3 focus:outline-red-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Statut
                        </label>
                        <select
                            {...register('statut')}
                            className="w-full p-3 focus:outline-red-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600">
                            <option value="actif">Actif</option>
                            <option value="en_traitement">En traitement</option>
                            <option value="resolu">Résolu</option>
                            <option value="ignore">Ignoré</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Commentaires
                        </label>
                        <textarea
                            {...register('commentaires')}
                            rows="2"
                            className="w-full p-3 focus:outline-red-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2">
                            <Save /> Modifier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalEditRisk;