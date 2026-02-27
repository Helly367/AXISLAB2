import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Close,
    Save,
    Person2Rounded,
    Description,
    Flag,
    CalendarToday,
    GroupAdd,
    Category,
    AccessTime,
    PriorityHigh,
    TrendingUp,
    CheckBox,
    CheckBoxOutlineBlank
} from '@mui/icons-material';

const ModifierProjet = ({ isOpen, onClose, projectData, onSave }) => {
    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    // État local pour les prospects sélectionnés
    const [selectedProspects, setSelectedProspects] = useState([]);

    // Liste des prospects disponibles
    const availableProspects = [
        "Élèves",
        "Étudiant(e)s",
        "Commerçant(e)s",
        "Salariés",
        "Entreprises",
        "Particuliers",
        "Professionnels libéraux",
        "Administrations",
        "Associations",
        "Artisans"
    ];

    useEffect(() => {
        if (projectData) {
            // Initialiser les prospects sélectionnés
            setSelectedProspects(projectData.prospects || []);

            reset({
                name: projectData.name || '',
                description: projectData.description || '',
                shortTerm: projectData.shortTerm || '',
                shortStart: projectData.shortStart || '',
                shortEnd: projectData.shortEnd || '',
                longTerm: projectData.longTerm || '',
                longStart: projectData.longStart || '',
                longEnd: projectData.longEnd || '',
                dateDebut: projectData.dateDebut || '',
                dateFinPrevue: projectData.dateFinPrevue || '',
                dateFinReelle: projectData.dateFinReelle || '',
                statut: projectData.statut || 'en_cours',
                priorite: projectData.priorite || 'moyenne',
                progression: projectData.progression || 0,
                chefProjet: projectData.chefProjet || '',
                typeProjet: projectData.typeProjet || '',
                descriptionType: projectData.descriptionType || ''
            });
        }
    }, [projectData, reset]);

    // Gérer la sélection/désélection des prospects
    const handleProspectToggle = (prospect) => {
        setSelectedProspects(prev => {
            if (prev.includes(prospect)) {
                return prev.filter(p => p !== prospect);
            } else {
                return [...prev, prospect];
            }
        });
    };

    // Sélectionner tous les prospects
    const handleSelectAll = () => {
        if (selectedProspects.length === availableProspects.length) {
            setSelectedProspects([]);
        } else {
            setSelectedProspects([...availableProspects]);
        }
    };

    const onSubmit = (data) => {
        const updatedData = {
            ...projectData,
            ...data,
            prospects: selectedProspects,
            progression: parseInt(data.progression) || 0
        };

        onSave(updatedData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold">Modifier le projet</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Informations générales */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Person2Rounded className="inline mr-2 text-blue-600" />
                                Nom du projet
                            </label>
                            <input
                                type="text"
                                {...register('name', { required: 'Le nom est requis' })}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Person2Rounded className="inline mr-2 text-blue-600" />
                                Chef de projet
                            </label>
                            <input
                                type="text"
                                {...register('chefProjet', { required: 'Le chef de projet est requis' })}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.chefProjet ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.chefProjet && (
                                <p className="text-red-500 text-sm mt-1">{errors.chefProjet.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Statut, Priorité, Progression */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <AccessTime className="inline mr-2 text-blue-600" />
                                Statut
                            </label>
                            <select
                                {...register('statut')}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="en_cours">En cours</option>
                                <option value="termine">Terminé</option>
                                <option value="en_pause">En pause</option>
                                <option value="annule">Annulé</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <PriorityHigh className="inline mr-2 text-blue-600" />
                                Priorité
                            </label>
                            <select
                                {...register('priorite')}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="haute">Haute</option>
                                <option value="moyenne">Moyenne</option>
                                <option value="basse">Basse</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <TrendingUp className="inline mr-2 text-blue-600" />
                                Progression (%)
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                {...register('progression', {
                                    min: 0,
                                    max: 100,
                                    valueAsNumber: true
                                })}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Dates du projet */}
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-green-600" />
                                Date de début
                            </label>
                            <input
                                type="date"
                                {...register('dateDebut')}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-blue-600" />
                                Date de fin prévue
                            </label>
                            <input
                                type="date"
                                {...register('dateFinPrevue')}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-red-600" />
                                Date de fin réelle
                            </label>
                            <input
                                type="date"
                                {...register('dateFinReelle')}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Description className="inline mr-2 text-blue-600" />
                            Description du projet
                        </label>
                        <textarea
                            {...register('description', { required: 'La description est requise' })}
                            rows="4"
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                        )}
                    </div>

                    {/* Objectifs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Flag className="inline mr-2 text-yellow-600" />
                                Objectif court terme
                            </label>
                            <textarea
                                {...register('shortTerm')}
                                rows="3"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Description de l'objectif à court terme..."
                            />
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <span className="text-xs text-gray-500">Début</span>
                                    <input
                                        type="date"
                                        {...register('shortStart')}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Fin</span>
                                    <input
                                        type="date"
                                        {...register('shortEnd')}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Flag className="inline mr-2 text-green-600" />
                                Objectif long terme
                            </label>
                            <textarea
                                {...register('longTerm')}
                                rows="3"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Description de l'objectif à long terme..."
                            />
                            <div className="grid grid-cols-2 gap-2 mt-2">
                                <div>
                                    <span className="text-xs text-gray-500">Début</span>
                                    <input
                                        type="date"
                                        {...register('longStart')}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                                <div>
                                    <span className="text-xs text-gray-500">Fin</span>
                                    <input
                                        type="date"
                                        {...register('longEnd')}
                                        className="w-full p-2 border border-gray-300 rounded-lg text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Prospects avec cases à cocher */}
                    <div>
                        <div className="flex justify-between items-center mb-3">
                            <label className="block text-sm font-medium text-gray-700">
                                <GroupAdd className="inline mr-2 text-red-600" />
                                Prospects cibles
                            </label>
                            <button
                                type="button"
                                onClick={handleSelectAll}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                {selectedProspects.length === availableProspects.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                            </button>
                        </div>

                        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                {availableProspects.map((prospect) => (
                                    <label
                                        key={prospect}
                                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${selectedProspects.includes(prospect)
                                            ? 'bg-red-50 border border-red-200'
                                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                                            }`}>
                                        <input
                                            type="checkbox"
                                            checked={selectedProspects.includes(prospect)}
                                            onChange={() => handleProspectToggle(prospect)}
                                            className="hidden"
                                        />
                                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${selectedProspects.includes(prospect)
                                            ? 'bg-red-600 text-white'
                                            : 'bg-white border-2 border-gray-300'
                                            }`}>
                                            {selectedProspects.includes(prospect) && (
                                                <span className="text-xs">✓</span>
                                            )}
                                        </div>
                                        <span className={`text-sm ${selectedProspects.includes(prospect)
                                            ? 'font-medium text-red-700'
                                            : 'text-gray-700'
                                            }`}>
                                            {prospect}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <p className="text-xs text-gray-500 mt-2">
                            {selectedProspects.length} prospect(s) sélectionné(s)
                        </p>
                    </div>

                    {/* Type de projet */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Category className="inline mr-2 text-gray-600" />
                                Type de projet
                            </label>
                            <input
                                type="text"
                                {...register('typeProjet')}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Ex: Projet ouvrage"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Description className="inline mr-2 text-gray-600" />
                                Description du type
                            </label>
                            <input
                                type="text"
                                {...register('descriptionType')}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                placeholder="Brève description"
                            />
                        </div>
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
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                            <Save /> Enregistrer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModifierProjet;