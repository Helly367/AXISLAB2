import React, { useEffect, useState, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Close, Save, CalendarToday, Description, Title, Group, Task, PersonAdd, AttachMoney, Warning } from "@mui/icons-material";
import { usePhases } from '../../../../hooks/usePhase';
import { useMembres } from '../../../../hooks/useMembers';
import { motion } from "framer-motion";
import AjouterMembre from '../../../Ressources/Equipe/AjouteMembre';
import { styleChamps, verifieChamps, formateMontantSimple } from "../../../../Services/functions";
import { alertService } from '../../../../Services/alertService';

const ModalCreatePhase = ({ isOpen, onClose, project, budget, setBudget }) => {
    const { createPhase } = usePhases();
    const { membres, loadMembres } = useMembres();
    const [loading, setLoading] = useState(false);
    const [loadingMembres, setLoadingMembres] = useState(false);
    const [isAddMembreModalOpen, setIsAddMembreModalOpen] = useState(false); // État pour le modal d'ajout
    const [erreurDepassement, setErreurDepassement] = useState('');
    const [isdepassement, setIsDepassement] = useState(false);

    // Charger les membres quand la modale s'ouvre
    useEffect(() => {
        if (isOpen && project?.projet_id) {
            const fetchMembres = async () => {
                setLoadingMembres(true);
                await loadMembres();
                setLoadingMembres(false);
            };
            fetchMembres();
        }
    }, [isOpen, project?.projet_id, loadMembres]);

    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isDirty },
        reset,
        watch
    } = useForm({
        defaultValues: {
            title: '',
            description_phase: '',
            date_debut: '',
            date_fin: '',
            budget_phase: '',
            taches: [''],
            membres: []
        }
    });

    const { fields: tacheFields, append: appendTache, remove: removeTache } =
        useFieldArray({ control, name: 'taches' });

    const { fields: membreFields, append: appendMembre, remove: removeMembre } =
        useFieldArray({ control, name: 'membres' });



    useEffect(() => {
        if (isOpen) {
            reset({
                title: '',
                description_phase: '',
                date_debut: '',
                date_fin: '',
                budget_phase: '',
                taches: [''],
                membres: []
            });
            setLoading(false);
            setErreurDepassement("");
            setIsDepassement(false);
        }
    }, [isOpen, reset]);

    // ✅ FIX logique (plus de loading ici)
    const depassement = (budget_phase, totalmontant, devise) => {
        if (Number(budget_phase) > Number(totalmontant)) {
            setIsDepassement(true);
            setErreurDepassement(
                `Le budget saisi ${formateMontantSimple(budget_phase)} ${devise} dépasse le budget tatal du projet
                    ${formateMontantSimple(totalmontant)} ${devise}`
            );
            return true;
        } else {
            setIsDepassement(false);
            setErreurDepassement('');
            return false;
        }
    }

    const handleClose = () => {
        setLoading(false);
        reset();
        onClose();

    };

    const watchedFields = watch();
    const style = styleChamps();

    const onSubmit = async (data) => {

        const result = depassement(data.budget_phase, budget.budget_total, budget.devise);
        if (result) return;

        setLoading(true);
        const membresSelectionnes = (data.membres || [])
            .map(m => m?.toString().trim())
            .filter(Boolean);

        const cleanedPhase = {
            ...data,
            budget_restant: Number(data.budget_phase),
            budget_consomme: 0,
            status: 'encours',
            projet_id: project.projet_id,
            taches: (data.taches || []).map(t => t.trim()).filter(Boolean),
            membres: membresSelectionnes
        };


        await new Promise(resolve => setTimeout(resolve, 3000))
        const response = await createPhase(cleanedPhase);
        setBudget(response.data?.budget);

        console.log("response", response);

        if (!response.success) {
            console.error(response.error || response.errors);
            setLoading(false);
            return;
        }

        setLoading(false);
        handleClose();
    };

    const dateDebut = watch('date_debut');

    // Filtrer les membres du projet en cours
    const membresDuProjet = useMemo(() => {
        if (!membres || !project?.projet_id) return [];
        return membres.filter(m => m.project_id === project.projet_id);
    }, [membres, project?.projet_id]);



    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                <div className="bg-primary p-2 flex justify-between items-center ">
                    <h2 className="text-2xd text-white font-bold">Nouvelle phase</h2>
                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-blue-600 p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

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
                            maxLength={80} // limite stricte
                            onChange={(e) => {
                                if (e.target.value.length > 80) {
                                    e.target.value = e.target.value.slice(0, 80);
                                }
                                // mettre à jour React Hook Form
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
                            maxLength={150} // limite stricte
                            onChange={(e) => {
                                if (e.target.value.length > 150) {
                                    e.target.value = e.target.value.slice(0, 150);
                                }
                                // mettre à jour React Hook Form
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
                            Tâches (facultative pour la création)
                        </label>

                        <div className="space-y-2">
                            {tacheFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <input
                                        type="text"
                                        {...register(`taches.${index}`)}
                                        maxLength={100} // limite stricte
                                        onChange={(e) => {
                                            if (e.target.value.length > 100) {
                                                e.target.value = e.target.value.slice(0, 100);
                                            }
                                            // mettre à jour React Hook Form
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
                    </div>

                    {/* Membres - Version avec sélection ET possibilité d'ajouter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Group className="inline mr-2 text-blue" />
                            Membres assignés à la phase (facultatif pour la création)
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
                                                                value={member.nomComplet}
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

                                        <div className="flex gap-2 mt-2">
                                            <button
                                                type="button"
                                                onClick={() => appendMembre('')}
                                                className="text-blue hover:text-blue-800 text-sm font-medium">
                                                + Ajouter un autre membre
                                            </button>

                                            <span className="text-gray-300 mx-2">|</span>

                                            <button
                                                type="button"
                                                onClick={() => setIsAddMembreModalOpen(true)}
                                                className="text-green-600 hover:text-green-800 text-sm font-medium flex items-center gap-1">
                                                <PersonAdd fontSize="small" /> Ajouter un nouveau membre
                                            </button>
                                </div>

                                {/* Petit rappel du nombre de membres disponibles */}
                                <p className="text-xs text-gray-500 mt-2">
                                    {membresDuProjet.length} membre(s) disponible(s) dans l'équipe
                                </p>
                            </>
                        )}
                    </div>


                    {/* Budget_phase */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <AttachMoney className="inline mr-2 text-blue" />
                            Budget de la phase /
                            <span className='text-orange-600 ml-3'>
                                Budget du projet : {formateMontantSimple(budget.budget_restant)} {budget.devise}
                            </span>
                        </label>
                        <input
                            type="number"
                            {...register('budget_phase', {
                                required: 'Le Budget est requis',
                                minLength: { value: 2, message: 'Minimum 2 caractères' }
                            })}
                            maxLength={16} // limite stricte
                            onChange={(e) => {
                                if (e.target.value.length > 16) {
                                    e.target.value = e.target.value.slice(0, 16);
                                }
                                // mettre à jour React Hook Form
                                register("budget_phase").onChange(e)
                            }}
                            className={`${style} ${verifieChamps(errors, watchedFields, "budget_phase")} `}
                            placeholder="Ex: 800000"
                        />
                        {errors.budget_phase && (
                            <p className="text-red-500 text-sm mt-1">{errors.budget_phase.message}</p>
                        )}

                        {isdepassement && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4  m-auto mt-3">
                                <p className="text-2xd text-red-700 flex items-start gap-2 flex-wrap">
                                    <Warning className="text-red-600 shrink-0" fontSize="small" />
                                    <span className=''>
                                        {erreurDepassement}
                                    </span>
                                </p>
                            </div>
                        )}
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
                            className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed'
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Création en cours ...
                                </>
                            ) : (
                                <>
                                        <Save /> Créer
                                </>
                            )}
                        </motion.button>
                    </div>

                </form>
            </div>

            {/* Modal d'ajout de membre */}
            <AjouterMembre
                isOpen={isAddMembreModalOpen}
                onClose={() => {
                    setIsAddMembreModalOpen(false);
                    // Recharger les membres après ajout
                    loadMembres();
                }}
                project={project}
            />
        </div>
    );
};

export default ModalCreatePhase;