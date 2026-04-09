import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
    Close, Save, Business, Savings,
    Warning
} from "@mui/icons-material";
import { useBudgets } from '../../../hooks/useBudgets';
import { alertService } from '../../../Services/alertService';
import { motion } from 'framer-motion';
import { verifieChamps, styleChamps, getDeviseNom, getDeviseSymbol, formateMontantSimple } from '../../../Services/functions';
import { devises } from '../../../Services/listes';

const ConfigBudget = ({ isOpen, onClose, project }) => {

    const { budget, configureBudget } = useBudgets();

    const [erreurDepassement, setErreurDepassement] = useState('');
    const [isdepassement, setIsDepassement] = useState(false);
    const [loading, setLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState([]);
    const [typeConfig, setTypeConfig] = useState(true);
    const [reserveEtat, setReserveEtat] = useState(true);

    // Sécurisation budget
    const safeBudget = useMemo(() => ({
        budget_total: budget?.budget_total || 0,
        reserve: budget?.reserve || 0,
        devise: budget?.devise || '',
        type: budget?.type || ''
    }), [budget]);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isDirty },
        reset
    } = useForm({
        defaultValues: {
            type: '',
            montant: 0,
            reserve: 0,
        }
    });

    const watchType = watch('type', safeBudget.type || '');
    const watchMontant = watch('montant', 0);
    const watchReserve = watch('reserve', 0);

    const style = styleChamps();
    const deviseNom = getDeviseNom(safeBudget.devise, devises);
    const deviseSymbole = getDeviseSymbol(safeBudget.devise, devises);

    // Reset propre
    useEffect(() => {
        if (isOpen) {
            reset({
                type: safeBudget.type || '',
                montant: 0,
                reserve: 0,
            });
            setIsDepassement(false);
            setErreurDepassement('');
            setLoading(false);
            setValidationErrors([]);
            setTypeConfig(true);
            setReserveEtat(true);
        }
    }, [isOpen, safeBudget, reset]);

    // Calcul centralisé
    const calculerSimulation = (montant = 0, reserve = 0, typeCfg = true, reserveCfg = true) => {
        let nouveauBudgetTotal = safeBudget.budget_total;
        let nouvelleReserve = safeBudget.reserve;

        if (montant > 0) {
            nouveauBudgetTotal = typeCfg
                ? nouveauBudgetTotal + montant
                : nouveauBudgetTotal - montant;
        }

        if (reserve > 0) {
            nouvelleReserve = reserveCfg
                ? nouvelleReserve + reserve
                : nouvelleReserve - reserve;
        }

        return { nouveauBudgetTotal, nouvelleReserve };
    };

    // Validation unique
    const verifierDepassement = (montant, reserve, typeCfg, reserveCfg) => {
        const { nouveauBudgetTotal, nouvelleReserve } =
            calculerSimulation(montant, reserve, typeCfg, reserveCfg);

        if (!typeCfg && montant > 0 && nouveauBudgetTotal < 0) {
            setErreurDepassement(
                `Retrait (${formateMontantSimple(montant)} ${deviseSymbole}) > budget (${formateMontantSimple(safeBudget.budget_total)} ${deviseSymbole})`
            );
            setIsDepassement(true);
            return true;
        }

        if (!reserveCfg && reserve > 0 && nouvelleReserve < 0) {
            setErreurDepassement(
                `Retrait réserve (${formateMontantSimple(reserve)} ${deviseSymbole}) > réserve (${formateMontantSimple(safeBudget.reserve)} ${deviseSymbole})`
            );
            setIsDepassement(true);
            return true;
        }

        if (nouvelleReserve > nouveauBudgetTotal) {
            setErreurDepassement(
                `Réserve (${formateMontantSimple(nouvelleReserve)} ${deviseSymbole}) > budget (${formateMontantSimple(nouveauBudgetTotal)} ${deviseSymbole})`
            );
            setIsDepassement(true);
            return true;
        }

        setErreurDepassement('');
        setIsDepassement(false);
        return false;
    };

    // Simulation affichage
    const { nouveauBudgetTotal, nouvelleReserve } = useMemo(() => {
        return calculerSimulation(
            Number(watchMontant) || 0,
            Number(watchReserve) || 0,
            typeConfig,
            reserveEtat
        );
    }, [watchMontant, watchReserve, typeConfig, reserveEtat, safeBudget]);

    const onSubmit = async (data) => {

        if (!isDirty) {
            alertService.info("Aucune modification détectée");
            setLoading(false);
            return;
        }

        const montant = Number(data.montant) || 0;
        const reserve = Number(data.reserve) || 0;



        if (verifierDepassement(montant, reserve, typeConfig, reserveEtat)) {
            return;
        }

        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 3000))
            const response = await configureBudget(project?.projet_id, {
                type: data.type,
                montant,
                reserve,
                typeConfig,
                reserveEtat
            });

            if (!response?.success) {
                const message =
                    response?.errors?.map(e => `${e.field}: ${e.message}`).join('\n') ||
                    response?.message ||
                    "Erreur lors de la configuration";

                alertService.error(message);
                setValidationErrors(response?.errors || []);
                return;
            }

            alertService.success("Budget configuré avec succès");
            handleClose();

        } catch (error) {
            alertService.error(error.message || "Erreur");
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        reset();
        setValidationErrors([]);
        setIsDepassement(false);
        setErreurDepassement('');
        setTypeConfig(true);
        setReserveEtat(true);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                <div className="bg-primary p-3 flex justify-between items-center sticky top-0">
                    <h2 className="text-2xd text-white font-bold">
                        Configuration du budget
                    </h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors"
                    >
                        <Close />
                    </button>
                </div>

                {isdepassement && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 w-120 m-auto mt-3">
                        <p className="text-2xd text-red-700 flex items-start gap-2">
                            <Warning className="text-red-600 shrink-0" fontSize="small" />
                            <span>{erreurDepassement}</span>
                        </p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

                    <div className='flex items-start border-b-2 border-blue-600 pb-3 text-lg'>
                        <span className='flex items-center gap-3 font-bold text-primary'>
                            Budget du Projet actuel : <span>{formateMontantSimple(safeBudget.budget_total)} {safeBudget.devise}</span>
                        </span>
                    </div>

                    {/* Type financement */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Type de financement
                        </label>

                        <div className="grid grid-cols-2 gap-4">
                            <label className={`border rounded-lg p-4 cursor-pointer transition-colors ${watchType === 'interne'
                                ? 'border-green-500 bg-green-50 ring-2 ring-green-200'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    {...register('type', { required: 'Le type de financement est requis' })}
                                    value="interne"
                                    className="hidden"
                                />
                                <div className="flex items-center gap-3">
                                    <Savings className={watchType === 'interne' ? 'text-green-600' : 'text-gray-400'} />
                                    <div>
                                        <p className="font-medium">Fonds propres</p>
                                        <p className="text-xs text-gray-500">Budget interne</p>
                                    </div>
                                </div>
                            </label>

                            <label className={`border rounded-lg p-4 cursor-pointer transition-colors ${watchType === 'investissement'
                                ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    {...register('type', { required: 'Le type de financement est requis' })}
                                    value="investissement"
                                    className="hidden"
                                />
                                <div className="flex items-center gap-3">
                                    <Business className={watchType === 'investissement' ? 'text-purple-600' : 'text-gray-400'} />
                                    <div>
                                        <p className="font-medium">Investissement</p>
                                        <p className="text-xs text-gray-500">Budget externe</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                        {errors.type && (
                            <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>
                        )}
                    </div>

                    {/* Montant + devise */}
                    <div className="flex flex-col gap-4 w-full mt-8">
                        <div className='flex items-start gap-4'>
                            <div className='flex gap-1 text-blue-600 font-medium'>
                                <input
                                    type="radio"
                                    className='bg-blue-600 choix1'
                                    name='choix'
                                    checked={typeConfig === true}
                                    onChange={(e) => setTypeConfig(true)}
                                />
                                <span>+ ajouter du budget</span>
                            </div>

                            <div className='flex gap-1 text-blue-600 font-medium'>
                                <input
                                    type="radio"
                                    name="choix"
                                    className='bg-black text-black choix1'
                                    checked={typeConfig === false}
                                    onChange={(e) => setTypeConfig(false)}
                                />
                                <span>- retirer du budget</span>
                            </div>
                        </div>

                        <div className='w-full'>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Entrez le Montant (facultatif)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                {...register('montant', {
                                    min: { value: 0, message: 'Le montant doit être positif' },
                                    validate: value => {
                                        const montant = Number(value) || 0;
                                        if (!typeConfig && montant > 0 && montant > safeBudget.budget_total) {
                                            return `Le montant à retirer ne peut pas dépasser ${formateMontantSimple(safeBudget.budget_total)} ${deviseSymbole}`;
                                        }
                                        if (typeConfig && montant > 0) {
                                            const { nouveauBudgetTotal } = calculerSimulation(montant, 0, true, reserveEtat);
                                            if (nouveauBudgetTotal < 0) {
                                                return `Opération non valide`;
                                            }
                                        }
                                        return true;
                                    }
                                })}
                                maxLength={16}
                                onChange={(e) => {
                                    if (e.target.value.length > 16) {
                                        e.target.value = e.target.value.slice(0, 16);
                                    }
                                    register('montant').onChange(e);
                                }}
                                className={`${style} ${verifieChamps(errors, watch, 'montant')}`}
                            />
                            {errors.montant && (
                                <p className="text-red-500 text-sm mt-1">{errors.montant.message}</p>
                            )}
                            {watchMontant > 0 && (
                                <p className="text-sm text-gray-600 mt-1">
                                    {typeConfig ? 'Nouveau budget total :' : 'Budget après retrait :'} {' '}
                                    <span className="font-semibold text-blue-600">
                                        {formateMontantSimple(nouveauBudgetTotal)} {deviseSymbole}
                                    </span>
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Réserve */}
                    <div className="flex flex-col gap-3 pt-4 w-full">
                        <div className='text-2xd text-black font-medium border-b-2 border-black pb-3'>
                            <span>Budget de réserve actuel : {formateMontantSimple(safeBudget.reserve)} {safeBudget.devise}</span>
                        </div>

                        <div className='flex items-start gap-4'>
                            <div className='flex gap-1 text-black font-medium'>
                                <input
                                    type="radio"
                                    className='bg-blue-600'
                                    name='choixReserve'
                                    checked={reserveEtat === true}
                                    onChange={(e) => setReserveEtat(true)}
                                />
                                <span>+ ajouter</span>
                            </div>

                            <div className='flex gap-1 text-black font-medium'>
                                <input
                                    type="radio"
                                    name="choixReserve"
                                    className='bg-black text-black'
                                    checked={reserveEtat === false}
                                    onChange={(e) => setReserveEtat(false)}
                                />
                                <span>- retirer</span>
                            </div>
                        </div>

                        <label className="block text-sm font-medium text-gray-700">
                            Montant réservé (facultatif)
                        </label>

                        <input
                            {...register('reserve', {
                                min: { value: 0, message: 'Le montant doit être positif' },
                                validate: value => {
                                    const reserve = Number(value) || 0;
                                    if (!reserveEtat && reserve > 0 && reserve > safeBudget.reserve) {
                                        return `Le montant à retirer de la réserve ne peut pas dépasser ${formateMontantSimple(safeBudget.reserve)} ${deviseSymbole}`;
                                    }
                                    if (reserveEtat && reserve > 0) {
                                        const { nouveauBudgetTotal, nouvelleReserve } = calculerSimulation(
                                            watchMontant || 0,
                                            reserve,
                                            typeConfig,
                                            true
                                        );
                                        if (nouvelleReserve > nouveauBudgetTotal) {
                                            return `La nouvelle réserve ne peut pas dépasser le budget total (${formateMontantSimple(nouveauBudgetTotal)} ${deviseSymbole})`;
                                        }
                                    }
                                    return true;
                                }
                            })}
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="Montant réserve"
                            maxLength={16}
                            onChange={(e) => {
                                if (e.target.value.length > 16) {
                                    e.target.value = e.target.value.slice(0, 16);
                                }
                                register('reserve').onChange(e);
                            }}
                            className={`${style} ${verifieChamps(errors, watch, 'reserve')}`}
                        />

                        {errors.reserve && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.reserve.message}
                            </p>
                        )}

                        {watchReserve > 0 && (
                            <p className="text-sm text-gray-600 mt-1">
                                {reserveEtat ? 'Nouvelle réserve :' : 'Réserve après retrait :'} {' '}
                                <span className="font-semibold text-blue-600">
                                    {formateMontantSimple(nouvelleReserve)} {deviseSymbole}
                                </span>
                            </p>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-4 mt-10">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
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
                                    Enregistrement en cours ...
                                </>
                            ) : (
                                <>
                                    <Save /> Enregistrer
                                </>
                            )}
                        </motion.button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ConfigBudget;