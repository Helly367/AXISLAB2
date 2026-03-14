import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import {
    Close, Save, AttachMoney, Business, Savings,
    CurrencyExchange, Warning
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useBudgets } from '../../../hooks/useBudgets';

const ConfigBudget = ({ isOpen, onClose, phases }) => {

    const { createGlobalBudget } = useBudgets();

    const [openRepartitionManuel, setOpenRepartitionManuel] = useState(false);
    const [erreurDepassement, setErreurDepassement] = useState('');
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset
    } = useForm({
        defaultValues: {
            type: 'interne',
            montant_total: 0,
            devise: 'USD',
            reserve: 0,
            phasesBudget: 0,
            materielsBudget: 0,
            campagnesBudget: 0,
        }
    });

    const watchType = watch('type', 'interne');
    const watchMontantTotal = Number(watch('montant_total') || 0);
    const watchReserve = Number(watch('reserve') || 0);
    const watchDevise = watch('devise', 'USD');
    const watchPhasesBudget = Number(watch('phasesBudget') || 0);
    const watchMaterielsBudget = Number(watch('materielsBudget') || 0);
    const watchCampagnesBudget = Number(watch('campagnesBudget') || 0);

    // Calcul du total des budgets
    const totalBudgets = useMemo(() => {
        return watchPhasesBudget + watchMaterielsBudget + watchCampagnesBudget;
    }, [watchPhasesBudget, watchMaterielsBudget, watchCampagnesBudget]);

    // Calcul montant réserve
    const montantReserve = useMemo(() => {
        return (watchMontantTotal * watchReserve) / 100;
    }, [watchMontantTotal, watchReserve]);

    // Montant disponible après réserve
    const montantApresReserve = useMemo(() => {
        return watchMontantTotal - montantReserve;
    }, [watchMontantTotal, montantReserve]);

    // Vérification dépassement
    useEffect(() => {

        if (montantApresReserve <= 0) {
            setErreurDepassement('');
            return;
        }

        if (totalBudgets > montantApresReserve) {
            setErreurDepassement(
                `Le total des budgets (${totalBudgets.toLocaleString()} ${watchDevise}) ` +
                `dépasse le montant disponible après réserve (${montantApresReserve.toLocaleString()} ${watchDevise})`
            );
        } else {
            setErreurDepassement('');
        }

    }, [totalBudgets, montantApresReserve, watchDevise]);

    // Reset du formulaire à l'ouverture
    useEffect(() => {

        if (isOpen) {
            reset({
                type: 'interne',
                montant_total: 0,
                devise: 'USD',
                reserve: 0,
                phasesBudget: 0,
                materielsBudget: 0,
                campagnesBudget: 0,
            });

            setOpenRepartitionManuel(false);
            setErreurDepassement('');
            setLoading(false);
        }

    }, [isOpen, reset]);

    const onSubmit = async (data) => {

        if (loading) return;

        if (totalBudgets > montantApresReserve) {
            alert(`Erreur : ${erreurDepassement}`);
            return;
        }

        if (totalBudgets > watchMontantTotal) {
            alert("Le total des budgets ne peut pas dépasser le montant total");
            return;
        }

        try {

            setLoading(true);

            const budgetConfig = {
                ...data,
                montant_total: Number(data.montant_total),
                phasesBudget: Number(data.phasesBudget),
                materielsBudget: Number(data.materielsBudget),
                campagnesBudget: Number(data.campagnesBudget),
                reserve: Number(data.reserve)
            };

            const result = await createGlobalBudget(budgetConfig);

            console.log(result);

            if (!result || !result.success) {

                console.error(result?.error || result?.errors || "Erreur inconnue");
                setLoading(false);
                return;

            }

            setLoading(false);
            onClose();

        } catch (error) {

            console.error("Erreur inattendue:", error);
            setLoading(false);

        }

    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold">
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

                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">

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
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <AttachMoney className="inline mr-2 text-blue-600" />
                                Montant total
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                {...register('montant_total', {
                                    required: 'Le montant est requis',
                                    min: { value: 0, message: 'Le montant doit être positif' },
                                    valueAsNumber: true
                                })}
                                className={`w-full px-5 py-3 bg-gray-50 border-2 rounded-xl 
                                    focus:outline-none focus:bg-white focus:border-blue-500
                                    transition-all duration-300 ${errors.montant_total ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.montant_total && (
                                <p className="text-red-500 text-sm mt-1">{errors.montant_total.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CurrencyExchange className="inline mr-2 text-blue-600" />
                                Devise
                            </label>
                            <select
                                {...register('devise')}
                                className="w-full px-5 py-3 bg-gray-50 border-2 border-gray-300 rounded-xl 
                                    focus:outline-none focus:bg-white focus:border-blue-500
                                    transition-all duration-300"
                            >
                                <option value="XOF">FCFA (XOF)</option>
                                <option value="EUR">Euro (€)</option>
                                <option value="USD">Dollar ($)</option>
                                <option value="GBP">Livre (£)</option>
                                <option value="CDF">Franc Congolais (CDF)</option>
                            </select>
                        </div>
                    </div>

                    {/* Répartition du budget */}
                    <div>
                        <div className='flex justify-between items-center mb-4'>
                            <label className="block text-sm font-medium text-gray-700">
                                Répartition du budget
                            </label>

                            <div className="text-sm bg-gray-100 p-2 rounded-lg">
                                <span className="text-gray-600">Total alloué : </span>
                                <span className={`font-semibold ${totalBudgets > montantApresReserve
                                    ? 'text-red-600'
                                    : 'text-green-600'
                                    }`}>
                                    {(totalBudgets || 0).toLocaleString()} {watchDevise}
                                </span>
                                <span className="text-gray-400 mx-2">/</span>
                                <span className="font-semibold text-gray-700">
                                    {(montantApresReserve || 0).toLocaleString()} {watchDevise}
                                </span>
                            </div>
                        </div>

                        {erreurDepassement && (
                            <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                                <Warning className="text-red-500 mt-0.5" />
                                <div>
                                    <p className="text-red-700 font-medium">Budget dépassé</p>
                                    <p className="text-sm text-red-600">{erreurDepassement}</p>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4 rounded-lg p-4 bg-gray-50">

                            {/* Phases */}
                            <div className="flex items-center gap-3">
                                <label className="inline-flex items-center gap-2 w-32 font-bold text-gray-700">
                                    Phases
                                </label>
                                <div className='flex-1'>
                                    <input
                                        {...register('phasesBudget', {
                                            required: 'Le budget pour les phases est requis',
                                            min: { value: 0, message: 'Le montant doit être positif' },
                                            valueAsNumber: true
                                        })}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder='Montant'
                                        className={`w-full px-5 py-3 bg-white border-2 rounded-xl 
                        focus:outline-none focus:border-blue-500
                        transition-all duration-300 ${errors.phasesBudget ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.phasesBudget && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.phasesBudget.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Matériels */}
                            <div className="flex items-center gap-3">
                                <label className="inline-flex items-center gap-2 w-32 font-bold text-gray-700">
                                    Matériels
                                </label>
                                <div className='flex-1'>
                                    <input
                                        {...register('materielsBudget', {
                                            required: 'Le budget pour les matériels est requis',
                                            min: { value: 0, message: 'Le montant doit être positif' },
                                            valueAsNumber: true
                                        })}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder='Montant'
                                        className={`w-full px-5 py-3 bg-white border-2 rounded-xl 
                        focus:outline-none focus:border-blue-500
                        transition-all duration-300 ${errors.materielsBudget ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.materielsBudget && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.materielsBudget.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Campagnes */}
                            <div className="flex items-center gap-3">
                                <label className="inline-flex items-center gap-2 w-32 font-bold text-gray-700">
                                    Campagnes
                                </label>
                                <div className='flex-1'>
                                    <input
                                        {...register('campagnesBudget', {
                                            required: 'Le budget pour les campagnes est requis',
                                            min: { value: 0, message: 'Le montant doit être positif' },
                                            valueAsNumber: true
                                        })}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        placeholder='Montant'
                                        className={`w-full px-5 py-3 bg-white border-2 rounded-xl 
                        focus:outline-none focus:border-blue-500
                        transition-all duration-300 ${errors.campagnesBudget ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />
                                    {errors.campagnesBudget && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.campagnesBudget.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Réserve (%) */}
                            <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                                <label className="inline-flex items-center gap-2 w-32 font-bold text-gray-700">
                                    Réserve (%)
                                </label>
                                <div className='flex-1'>
                                    <input
                                        {...register('reserve', {
                                            required: 'Le pourcentage de réserve est requis',
                                            min: { value: 0, message: 'La réserve doit être au moins 0%' },
                                            max: { value: 100, message: 'La réserve ne peut pas dépasser 100%' },
                                            valueAsNumber: true
                                        })}
                                        type="number"
                                        step="1"
                                        min="0"
                                        max="100"
                                        placeholder='Pourcentage'
                                        className={`w-full px-5 py-3 bg-white border-2 rounded-xl 
                        focus:outline-none focus:border-blue-500
                        transition-all duration-300 ${errors.reserve ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                    />

                                    {errors.reserve && (
                                        <p className="text-red-500 text-sm mt-1">
                                            {errors.reserve.message}
                                        </p>
                                    )}

                                    {watchReserve > 0 && watchMontantTotal > 0 && (
                                        <p className="text-sm text-gray-500 mt-1">
                                            Montant réservé : {((watchMontantTotal * watchReserve) / 100).toLocaleString()} {watchDevise}
                                        </p>
                                    )}
                                </div>
                            </div>

                        </div>

                        {/* Barre de progression */}
                        {montantApresReserve > 0 && (
                            <div className="mt-4">

                                {(() => {
                                    const percent = montantApresReserve
                                        ? Math.min(100, (totalBudgets / montantApresReserve) * 100)
                                        : 0;

                                    return (
                                        <>
                                            <div className="flex justify-between text-xs text-gray-500 mb-1">
                                                <span>0</span>
                                                <span>{Math.round(percent)}% utilisé</span>
                                                <span>{montantApresReserve.toLocaleString()} {watchDevise}</span>
                                            </div>

                                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                <div
                                                    className={`h-2.5 rounded-full transition-all duration-300 ${totalBudgets > montantApresReserve
                                                        ? 'bg-red-600'
                                                        : totalBudgets > montantApresReserve * 0.9
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'
                                                        }`}
                                                    style={{
                                                        width: `${percent}%`
                                                    }}
                                                />
                                            </div>
                                        </>
                                    );
                                })()}

                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 border-t pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>

                        {loading ? (<CircularProgress />) : null}

                        <button
                            type="submit"
                            disabled={totalBudgets > montantApresReserve || loading}
                            className={`px-6 py-2 rounded-lg transition-colors flex items-center gap-2 ${totalBudgets > montantApresReserve
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                        >
                            {loading
                                ? (<><CircularProgress size={18} /> Enregistrer</>)
                                : (<><Save /> Enregistrer</>)
                            }
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ConfigBudget;