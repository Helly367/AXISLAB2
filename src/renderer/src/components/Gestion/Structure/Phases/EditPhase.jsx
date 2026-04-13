import React, { useEffect, useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import {
    Close, Save, CalendarToday, Description, Title, Group, Task, PersonAdd,
    AttachMoney
} from "@mui/icons-material";
import { motion } from 'framer-motion';
import { usePhases } from "../../../../hooks/usePhase"
import { styleChamps, verifieChamps, formateDateChamps, formateMontantSimple } from '../../../../Services/functions';
import { useMembres } from '../../../../hooks/useMembers';
import { alertService } from '../../../../Services/alertService';
import { useBudgets } from '../../../../hooks/useBudgets';



const ModalEditPhase = ({ isOpen, onClose, phaseToEdit, project, budget }) => {
    const [loading, setLoading] = useState(false);
    const { setBudget } = useBudgets();
    const { updatePhase } = usePhases();
    const { membres, loadMembres } = useMembres();
    const [erreurDepassement, setErreurDepassement] = useState('');
    const [isdepassement, setIsDepassement] = useState(false);
    const [loadingMembres, setLoadingMembres] = useState(false);
    const [isAddMembreModalOpen, setIsAddMembreModalOpen] = useState(false); // ✅ AJOUTÉ
    const [isTachesError, setIsTachesError] = useState(false);
    const [tachesError, setTachesError] = useState('');
    const { register, control, handleSubmit, formState: { errors, isDirty }, watch, reset, setError } = useForm({
        defaultValues: {
            title: '',
            description_phase: '',
            date_debut: '',
            date_fin: '',
            taches: [''],
            membres: [''],
            budget_phase: 0
        }
    });


    const { fields: tacheFields, append: appendTache, remove: removeTache, } = useFieldArray({
        control,
        name: 'taches',
    });

    const { fields: membreFields, append: appendMembre, remove: removeMembre } = useFieldArray({
        control,
        name: 'membres'
    });

    const dateDebut = watch('date_debut');
    const watchMontant = watch('budget_phase', 0);
    const watchedFields = watch();




    const style = styleChamps();

    const safeBudget = useMemo(() => ({
        budget_total: budget?.budget_total || 0,
        reserve: budget?.reserve || 0,
        devise: budget?.devise || '',
        type: budget?.type || ''
    }), [budget]);

    const deviseSymbole = safeBudget.devise; // ✅ AJOUTÉ

    // ✅ DÉPLACÉ avant son utilisation

    // Charger les membres quand la modale s'ouvre
    useEffect(() => {
        if (isOpen && project?.projet_id) {
            const fetchMembres = async () => {
                setLoadingMembres(true);
                await loadMembres();
                setLoadingMembres(false);
            };
            fetchMembres();
            setErreurDepassement("");
            setIsDepassement(false);
            setIsTachesError(false);
            setLoading(false);
        }
    }, [isOpen, project?.projet_id, loadMembres]);

    // Remplir le formulaire avec les données existantes
    useEffect(() => {
        if (phaseToEdit) {
            reset({
                title: phaseToEdit.title || '',
                description_phase: phaseToEdit.description_phase || '',
                date_debut: formateDateChamps(phaseToEdit.date_debut) || '',
                date_fin: formateDateChamps(phaseToEdit.date_fin) || '',
                taches: phaseToEdit.taches?.length ? phaseToEdit.taches : [''],
                membres: phaseToEdit.membres?.length ? phaseToEdit.membres : [''],
                budget_phase: ''
            });
        }
    }, [phaseToEdit, reset]);


    // Filtrer les membres du projet en cours
    const membresDuProjet = useMemo(() => {
        if (!membres || !project?.projet_id) return [];
        return membres.filter(m => m.projet_id === project.projet_id);
    }, [membres, project?.projet_id]);

    const onSubmit = async (data) => {

        // Récupérer les tâches originales
        const originalTaches = phaseToEdit?.taches?.length ? phaseToEdit.taches : [''];
        const currentTaches = data.taches || [];

        // Vérifier si les tâches ont changé
        const hasTachesChanged =
            currentTaches.length !== originalTaches.length ||
            currentTaches.some((tache, index) =>
                tache?.trim() !== originalTaches[index]?.trim()
            );

        // Vérifier modification globale OU modification des tâches
        if (!isDirty && !hasTachesChanged) {
            alertService.info("Aucune modification détectée");
            setLoading(false);
            return;
        }

        // Vérifier qu'il y a au moins une tâche remplie
        const hasTache = currentTaches.some(t => t && t.trim() !== '');
        if (!hasTache) {
            setIsTachesError(true);
            setTachesError("Ajoute au moins une tâche");
            setLoading(false);
            return;
        }


        setIsTachesError(false);
        setTachesError('');

        setLoading(true);

        const membresSelectionnes = (data.membres || [])
            .map(m => m?.toString().trim())
            .filter(Boolean);

        const updatedPhaseData = {
            ...data,
            phase_id: phaseToEdit.phase_id,
            budget_phase: data.montant,
            taches: (data.taches || []).map(t => t.trim()).filter(Boolean),
            membres: membresSelectionnes,
            budget_phase: data.budget_phase || 0,
        };

        await new Promise(resolve => setTimeout(resolve, 3000))
        const result = await updatePhase(project.projet_id, updatedPhaseData);

        if (result.data !== null) {
            setBudget(result.data);

        }

        handleClose();

        if (!result.success) {
            console.error(result.error || result.errors);
            setLoading(false);
            return;
        }


    };

    const handleClose = () => {
        setLoading(false);
        reset();
        onClose();
    };




    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-primary p-2 flex justify-between items-center ">
                    <h2 className="text-2xd text-white font-bold">Modifier la phase</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                    {/* Titre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Title className="inline mr-2 text-blue" />
                            Titre de la phase
                        </label>
                        <input
                            type="text"
                            {...register('title', {
                                required: 'Le titre est requis',
                                minLength: { value: 2, message: 'Minimum 2 caractères' }
                            })}
                            maxLength={80}
                            onChange={(e) => {
                                if (e.target.value.length > 80) {
                                    e.target.value = e.target.value.slice(0, 80);
                                }
                                register('title').onChange(e)
                            }}
                            className={`${style} ${verifieChamps(errors, watchedFields, 'title')} `}
                            placeholder="Ex: ANALYSE, CONCEPTION..."
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Description className="inline mr-2 text-blue" />
                            Description
                        </label>
                        <textarea
                            {...register('description_phase', {
                                required: 'La description est requise',
                                minLength: { value: 10, message: 'Minimum 10 caractères' }
                            })}
                            rows="4"
                            maxLength={150}
                            onChange={(e) => {
                                if (e.target.value.length > 150) {
                                    e.target.value = e.target.value.slice(0, 150);
                                }
                                register('description_phase').onChange(e)
                            }}
                            className={`${style} ${verifieChamps(errors, watchedFields, 'description_phase')} `}
                            placeholder="Description détaillée de la phase..."
                        />
                        {errors.description_phase && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.description_phase.message}
                            </p>
                        )}
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-green-600" />
                                Date de début
                            </label>
                            <input
                                type="date"
                                {...register('date_debut', {
                                    required: 'La date de début est requise'
                                })}
                                className={`${style} ${verifieChamps(errors, watchedFields, 'date_debut')} `}
                            />
                            {errors.date_debut && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.date_debut.message}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CalendarToday className="inline mr-2 text-red-600" />
                                Date de fin
                            </label>
                            <input
                                type="date"
                                {...register('date_fin', {
                                    required: 'La date de fin est requise',
                                    validate: value =>
                                        !dateDebut || value >= dateDebut ||
                                        'La date de fin doit être après la date de début'
                                })}
                                className={`${style} ${verifieChamps(errors, watchedFields, "date_fin")} `}
                            />
                            {errors.date_fin && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.date_fin.message}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Tâches */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Task className="inline mr-2 text-blue" />
                            Tâches (obligatoire)
                        </label>

                        <div className="space-y-2">
                            {tacheFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <input
                                        type="text"
                                        {...register(`taches.${index}`)}
                                        maxLength={100}
                                        onChange={(e) => {
                                            if (e.target.value.length > 100) {
                                                e.target.value = e.target.value.slice(0, 100);
                                            }
                                            register(`taches.${index}`).onChange(e)
                                        }}
                                        className={`${style} ${verifieChamps(errors, watchedFields, `taches.${index}`)} `}
                                        placeholder={`Tâche ${index + 1}`}
                                    />
                                    {tacheFields.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeTache(index)}
                                            className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                            ×
                                        </button>
                                    )}
                                </div>
                            ))}


                        </div>

                        <button
                            type="button"
                            onClick={() => appendTache('')}
                            className="mt-2 text-blue hover:text-blue-800 text-sm font-medium">
                            + Ajouter une tâche
                        </button>

                        {isTachesError && (
                            <p className="text-red-500 text-sm mt-1">
                                {tachesError}
                            </p>
                        )}
                    </div>


                    {/* Membres */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Group className="inline mr-2 text-blue" />
                            Membres assignés à la phase
                        </label>

                        {loadingMembres ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="text-gray-500 mt-2">Chargement des membres...</p>
                            </div>
                        ) : membresDuProjet.length === 0 ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                                <p className="text-yellow-700 text-lg font-medium mb-3">
                                    Aucun membre dans ce projet
                                </p>
                                <p className="text-sm text-yellow-600 mb-4">
                                    Vous devez d'abord ajouter des membres à l'équipe avant de pouvoir les assigner à une phase.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => setIsAddMembreModalOpen(true)}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                                >
                                    <PersonAdd /> Ajouter un membre maintenant
                                </button>
                            </div>
                        ) : (
                            <>
                                        <div className="space-y-2">
                                            {membreFields.map((field, index) => (
                                                <div key={field.id} className="flex gap-2 items-center">
                                                    <select
                                                        {...register(`membres.${index}`)}
                                                        className={`${style} ${verifieChamps(errors, watchedFields, `membres.${index}`)} `}
                                                    >
                                                        <option value="">Sélectionner un membre...</option>
                                                        {membresDuProjet.map(member => (
                                                            <option
                                                                key={member.membre_id}
                                                                value={member.membre_id}
                                                            >
                                                                {member.nomComplet} - {member.poste}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    {membreFields.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeMembre(index)}
                                                            className="px-3 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                                            ×
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => appendMembre('')}
                                            className="mt-4 text-blue hover:text-blue-800 text-sm font-medium">
                                            + Ajouter ou modifier un membre
                                        </button>




                                        <p className="text-2xd text-gray-500 mt-2">
                                    {membresDuProjet.length} membre(s) disponible(s) dans l'équipe
                                </p>
                            </>
                        )}
                    </div>

                    {/* Budget_phase */}
                    <div className="flex flex-col gap-4 w-full mt-10">

                        <div className='flex items-center gap-2 border-b-2 border-black pb-3'>
                            <span className='text-2xd font-medium text-gray-600'>Budget actuel de cette phase :</span>
                            <span className='text-2xd font-medium text-primary'>
                                {formateMontantSimple(phaseToEdit.budget_phase)} {budget.devise}
                            </span>
                        </div>


                        <div className='w-full'>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ajouter le Montant (facultatif)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                placeholder='Ex: 8000'
                                {...register('budget_phase', {
                                    min: { value: 0, message: 'Le montant doit être positif' },

                                })}
                                maxLength={16}
                                onChange={(e) => {
                                    if (e.target.value.length > 16) {
                                        e.target.value = e.target.value.slice(0, 16);
                                    }
                                    register('budget_phase').onChange(e);
                                }}
                                className={`${style} ${verifieChamps(errors, watchedFields, 'budget_phase')}`} // ✅ CORRIGÉ
                            />
                            {errors.budget_phase && (
                                <p className="text-red-500 text-sm mt-1">{errors.budget_phase.message}</p>
                            )}

                        </div>
                    </div>

                    {/* Boutons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                            Annuler
                        </button>

                        <motion.button
                            type="submit"
                            disabled={loading || Object.keys(errors).length > 0}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:cursor-not-allowed disabled:bg-gray-400'
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Modification en cours ...
                                </>
                            ) : (
                                <>
                                    <Save /> Modifier
                                </>
                            )}
                        </motion.button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ModalEditPhase;