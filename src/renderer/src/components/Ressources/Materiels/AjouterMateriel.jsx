import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
    Close, Save, Computer, Category, Numbers, AttachMoney, Description, Warning, Timeline,
    Shop
} from "@mui/icons-material";
import { categorieMateriels } from '../../../Services/listes';
import { usePhases } from "../../../hooks/usePhase";
import { useMateriels } from '../../../hooks/useMateriels';
import { styleChamps, verifieChamps, formateMontantSimple } from '../../../Services/functions';
import { alertService } from '../../../Services/alertService';
import { motion } from 'framer-motion';

const AjouterMateriel = ({ isOpen, onClose, project, budget }) => {

    const [preview, setPreview] = useState("");
    const { phases, loadPhases, setPhases } = usePhases();
    const { createMateriel } = useMateriels();
    const [loadingPhases, setLoadingPhases] = useState(false);
    const [phaseId, setPhaseId] = useState(null);
    const [budgetErreur, setBudgetErreur] = useState('');
    const [isbudgetErreur, setISbudgetErreur] = useState(false);
    const [loading, setLoading] = useState(false);

    const PhasesDuProjet = useMemo(() => {
        if (!phases || !project?.projet_id) return [];
        return phases.filter(m => m?.projet_id === project.projet_id);
    }, [phases, project?.projet_id]);


    const { register, handleSubmit, watch, formState: { errors, isDirty }, reset } = useForm({
        defaultValues: {
            nom: '',
            categorie: categorieMateriels[0],
            prix: '',
            quantite: 1,
            description: '',
            fournisseur: '',
            phase_id: PhasesDuProjet[0]?.phase_id,
            statut: 'en_attente',
        }
    });

    // Charger les membres quand la modale s'ouvre
    useEffect(() => {
        if (isOpen && project?.projet_id) {
            const fetchPhases = async () => {
                setLoadingPhases(true);
                await loadPhases();
                setLoadingPhases(false);
                setISbudgetErreur(false);
                reset();
                setLoading(false);
            };
            fetchPhases();
        }
    }, [isOpen, project?.projet_id, loadPhases]);


    const watchPrix = watch('prix', 0);
    const watchQuantite = watch('quantite', 1);
    const watchedFields = watch();
    const style = styleChamps();


    const filterBudgetPhase = useMemo(() => {
        if (!phases || !phaseId) return null;
        const phase = phases.find(m => Number(m.phase_id) === Number(phaseId));
        return phase;

    }, [phases, phaseId])

    const devise = budget?.devise;
    const budget_restant = Number(filterBudgetPhase?.budget_restant);
    const totalEstime = Number(watchPrix || 0) * Number(watchQuantite || 1);

    const handleClose = () => {
        setLoading(false);
        reset();
        onClose();

    }

    const statusVal = [
        "attente",
        "disponible",
        "suspendu"
    ]


    const onSubmit = async (data) => {

        if (!isDirty) {
            alertService.info("Aucune modification détectée")
        }

        if (totalEstime > budget_restant) {
            setISbudgetErreur(true);
            setBudgetErreur(`Le prix du materiel ${formateMontantSimple(totalEstime)} ${devise} depasse le budget de la phase ${formateMontantSimple(budget_restant)} ${devise}`);
            setLoading(false);
        }

        setLoading(true);
        try {
            const newMateriel = {
                ...data,
                projet_id: project?.projet_id,
                prix: Number(data.prix),
                quantite: Number(data.quantite),
                fournisseur: data.fournisseur || 'non defini',
                statut: 'en_attente',


            };

            console.log(newMateriel);
            await new Promise(resolve => setTimeout(resolve, 3000));
            const result = await createMateriel(newMateriel);



            if (!result || !result.success) {
                setISbudgetErreur(true);
                setBudgetErreur(result?.error || result?.errors || "Erreur inconnue")
                console.error(result?.error || result?.errors || "Erreur inconnue");
                setLoading(false); // ← Important : arrêter le loading même en cas d'erreur
                return;
            }

            setPhases(result.data);

            setLoading(false);
            handleClose();

        } catch (error) {
            console.error("Erreur inattendue:", error);
            setLoading(false); // ← Arrêter le loading en cas d'exception
        }





    };




    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                {/* Header */}
                <div className="bg-primary p-2 flex justify-between items-center sticky top-0">
                    <h2 className="text-2xd text-white font-bold">
                        Ajouter un matériel
                    </h2>

                    <button
                        onClick={handleClose}
                        className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">



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
                            placeholder='Ex: Ordinateur portable HP'
                            maxLength={80} // limite stricte
                            onChange={(e) => {
                                if (e.target.value.length > 80) {
                                    e.target.value = e.target.value.slice(0, 80);
                                }
                                // mettre à jour React Hook Form
                                register('nom').onChange(e)
                            }}
                            className={`${style} ${verifieChamps(errors, watchedFields, 'nom')} `}
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
                            className={`${style} ${verifieChamps(errors, watchedFields, 'categorie')} `}
                        >
                            {categorieMateriels.map((categorie) => (
                                <option key={categorie} value={categorie}>{categorie}</option>
                            ))}
                        </select>
                    </div>



                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Description className="inline mr-2 text-blue-600" />
                            Description
                        </label>

                        <textarea
                            {...register('description')}
                            rows="3"
                            maxLength={120} // limite stricte
                            onChange={(e) => {
                                if (e.target.value.length > 120) {
                                    e.target.value = e.target.value.slice(0, 120);
                                }
                                // mettre à jour React Hook Form
                                register('description').onChange(e)
                            }}
                            className={`${style} ${verifieChamps(errors, watchedFields, 'description')} `}
                            placeholder="Description du matériel..."
                        />


                    </div>

                    {/* Nom */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Shop className="inline mr-2 text-blue-600" />
                            Fornisseur ou lieu d'achat
                        </label>

                        <input
                            type="text"
                            {...register('fournisseur', {

                            })}
                            placeholder='Ex: Centre commercial'
                            maxLength={100} // limite stricte
                            onChange={(e) => {
                                if (e.target.value.length > 100) {
                                    e.target.value = e.target.value.slice(0, 100);
                                }
                                // mettre à jour React Hook Form
                                register('fournisseur').onChange(e)
                            }}
                            className={`${style} ${verifieChamps(errors, watchedFields, 'fournisseur')} `}
                        />

                        {errors.fournisseur && (
                            <p className="text-red-500 text-sm mt-1">{errors.fournisseur.message}</p>
                        )}
                    </div>



                    {/* Phases - Version avec sélection ET possibilité d'ajouter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Timeline className="inline mr-2 text-blue-600" />
                            Veuillez sélectionner une phase pour ce matériel
                        </label>

                        {loadingPhases ? (
                            <div className="text-center py-4">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="text-gray-500 mt-2">Chargement des phases...</p>
                            </div>
                        ) : PhasesDuProjet.length === 0 ? (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                                <p className="text-yellow-700 text-lg font-medium mb-3">
                                        Aucune phase disponible dans ce projet
                                </p>
                                <p className="text-sm text-yellow-600 mb-4">
                                        Vous devez d'abord ajouter des phases dans ce projet.
                                </p>
                                <button
                                    type="button"

                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                                >
                                    <PersonAdd /> Ajouter une phase maintenant
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-2">

                                    <select
                                        {...register('phase_id')}
                                        onChange={(e) => setPhaseId(e.target.value)}
                                        className={`${style} ${verifieChamps(errors, watchedFields, "phase_id")} `}
                                    >
                                        {PhasesDuProjet.map(phase => (
                                            <option key={phase.phase_id} value={phase.phase_id}>
                                                {phase.title}
                                            </option>
                                        ))}
                                    </select>


                                </div>


                            </>
                        )}
                    </div>

                    {/* Prix + Quantité */}
                    <div className="grid grid-cols-2 gap-4">

                        <div className='flex flex-col'>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <AttachMoney className="inline mr-2 text-blue-600" />
                                Prix
                            </label>

                            <input
                                type="number"
                                placeholder="Ex: 986000"
                                {...register('prix')}
                                maxLength={16} // limite stricte
                                onChange={(e) => {
                                    if (e.target.value.length > 16) {
                                        e.target.value = e.target.value.slice(0, 16);
                                    }
                                    // mettre à jour React Hook Form
                                    register('prix').onChange(e)
                                }}
                                className={`${style} ${verifieChamps(errors, watchedFields, 'prix')} `}
                            />

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <Numbers className="inline mr-2 text-blue-600" />
                                Quantité
                            </label>

                            <input
                                type="number"
                                placeholder="Quantité"
                                {...register('quantite')}
                                maxLength={16} // limite stricte
                                onChange={(e) => {
                                    if (e.target.value.length > 16) {
                                        e.target.value = e.target.value.slice(0, 16);
                                    }
                                    // mettre à jour React Hook Form
                                    register('quantite').onChange(e)
                                }}
                                className={`${style} ${verifieChamps(errors, watchedFields, 'quantite')} `}
                            />

                        </div>

                    </div>

                    {phaseId && (
                        <div className='flex items-center gap-4 text-sm'>
                            <div className='flex items-center gap-2'>
                                <span className='text-gray-600 font-medium'>Prix total :</span>
                                <span className='font-medium text-orange-600'>
                                    {formateMontantSimple(totalEstime)} {devise}
                                </span>
                            </div>
                            <span className='text-gray-500'>|</span>
                            <div className='flex items-center gap-2'>
                                <span className='text-gray-600 font-medium'>Budget phase : </span>
                                <span className='font-medium text-green-600'>
                                    {formateMontantSimple(filterBudgetPhase?.budget_restant)} {devise}
                                </span>

                            </div>
                        </div>
                    )}

                    {/* Alert budget */}
                    {isbudgetErreur && (
                        <div className="p-4 m-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className='text-2xd text-red-700 font-medium'>
                                {budgetErreur}
                            </p>

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

                        <motion.button
                            type="submit"
                            disabled={loading || Object.keys(errors).length > 0}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
                        >

                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Ajout en cours ...
                                </>
                            ) : (
                                <>
                                    <Save /> Ajouter

                                </>
                            )}

                        </motion.button>

                    </div>

                </form>
            </div>
        </div>
    );
};

export default AjouterMateriel;