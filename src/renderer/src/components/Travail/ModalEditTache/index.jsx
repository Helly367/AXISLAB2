import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
    Close,
    Save,
    Assignment,
    Person,
    CalendarToday,
    Flag,
    Description,
    Link,
    Add
} from "@mui/icons-material";

const ModalEditTache = ({ isOpen, onClose, onSave, taskToEdit, members, phases, tasks }) => {
    const { register, control, handleSubmit, formState: { errors }, reset } = useForm();

    useEffect(() => {
        if (taskToEdit) {
            // Convertir les sous-tâches en tableau de strings pour le formulaire
            const subtaskStrings = taskToEdit.sous_taches?.map(st => st.titre) || [''];

            reset({
                titre: taskToEdit.titre || '',
                description: taskToEdit.description || '',
                phaseId: taskToEdit.phaseId || '',
                assigneeId: taskToEdit.assigneeId || '',
                date_debut: taskToEdit.date_debut || '',
                date_echeance: taskToEdit.date_echeance || '',
                priorite: taskToEdit.priorite || 'moyenne',
                estimated_hours: taskToEdit.estimated_hours || 1,
                dependances: taskToEdit.dependances?.[0] || '',
                sous_taches: subtaskStrings
            });
        }
    }, [taskToEdit, reset]);

    const { fields: subtaskFields, append: appendSubtask, remove: removeSubtask } = useFieldArray({
        control,
        name: 'sous_taches'
    });

    const onSubmit = (data) => {
        const filteredSubtasks = data.sous_taches
            .filter(st => st.trim() !== '')
            .map((st, index) => ({
                id: (taskToEdit?.sous_taches?.[index]?.id) || Date.now() + index,
                titre: st,
                completed: taskToEdit?.sous_taches?.[index]?.completed || false
            }));

        const taskData = {
            ...taskToEdit,
            ...data,
            phaseId: parseInt(data.phaseId),
            assigneeId: parseInt(data.assigneeId),
            estimated_hours: parseInt(data.estimated_hours),
            sous_taches: filteredSubtasks,
            dependances: data.dependances ? [parseInt(data.dependances)] : []
        };
        onSave(taskData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold flex items-center gap-2">
                        <Assignment />
                        Modifier la tâche
                    </h2>
                    <button onClick={onClose} className="text-white hover:bg-blue-700 p-1 rounded-full">
                        <Close />
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Mêmes champs que ModalAddTask */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Titre de la tâche
                        </label>
                        <input
                            type="text"
                            {...register('titre', { required: 'Le titre est requis' })}
                            className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.titre ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Description className="inline mr-2 text-blue-600" />
                            Description
                        </label>
                        <textarea
                            {...register('description', { required: 'La description est requise' })}
                            rows="3"
                            className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.description ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Phase
                            </label>
                            <select
                                {...register('phaseId', { required: 'La phase est requise' })}
                                className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.phaseId ? 'border-red-500' : 'border-gray-300'
                                    }`}>
                                <option value="">Sélectionner une phase</option>
                                {phases.map(phase => (
                                    <option key={phase.id} value={phase.id}>{phase.title}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Person className="inline mr-2 text-blue-600" />
                                Assigné à
                            </label>
                            <select
                                {...register('assigneeId', { required: "L'assignation est requise" })}
                                className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.assigneeId ? 'border-red-500' : 'border-gray-300'
                                    }`}>
                                <option value="">Sélectionner un membre</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>{member.nom}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-green-600" />
                                Date de début
                            </label>
                            <input
                                type="date"
                                {...register('date_debut')}
                                className="w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-red-600" />
                                Date d'échéance
                            </label>
                            <input
                                type="date"
                                {...register('date_echeance', { required: "La date d'échéance est requise" })}
                                className={`w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 ${errors.date_echeance ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Flag className="inline mr-2 text-orange-600" />
                                Priorité
                            </label>
                            <select
                                {...register('priorite')}
                                className="w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600">
                                <option value="basse">Basse</option>
                                <option value="moyenne">Moyenne</option>
                                <option value="haute">Haute</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Heures estimées
                            </label>
                            <input
                                type="number"
                                min="1"
                                {...register('estimated_hours', { valueAsNumber: true })}
                                className="w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Link className="inline mr-2 text-blue-600" />
                            Dépend de (optionnel)
                        </label>
                        <select
                            {...register('dependances')}
                            className="w-full p-3 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600">
                            <option value="">Aucune dépendance</option>
                            {tasks.map(task => (
                                <option key={task.id} value={task.id}>{task.titre}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Sous-tâches
                        </label>
                        <div className="space-y-2">
                            {subtaskFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <input
                                        type="text"
                                        {...register(`sous_taches.${index}`)}
                                        className="flex-1 p-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600"
                                    />
                                    {subtaskFields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeSubtask(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => appendSubtask('')}
                            className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-1">
                            <Add fontSize="small" /> Ajouter une sous-tâche
                        </button>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-600 hover:bg-gray-50">
                            Annuler
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Save /> Modifier
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModalEditTache;