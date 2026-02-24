import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
    Close, Save, AttachMoney, Business, Savings,
    Euro, CurrencyExchange, Warning
} from "@mui/icons-material";

const ModalConfigBudget = ({ isOpen, onClose, onSave, phases, currentConfig }) => {
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: currentConfig
    });

    const [repartitionType, setRepartitionType] = useState('auto'); // 'auto' ou 'manuel'
    const watchType = watch('type', 'interne');
    const watchMontantTotal = watch('montantTotal', 0);
    const watchReserve = watch('reserve', 0);

    // Calculer la répartition automatique
    const calculerRepartitionAuto = (montant, reserve) => {
        const montantNet = montant - reserve;
        const montantParPhase = montantNet / phases.length;
        const repartition = {};
        phases.forEach(phase => {
            repartition[phase.id] = Math.round(montantParPhase * 100) / 100;
        });
        return repartition;
    };

    const onSubmit = (data) => {
        // Ajouter la répartition
        let repartition = data.repartition || {};

        if (repartitionType === 'auto') {
            repartition = calculerRepartitionAuto(data.montantTotal, data.reserve);
        }

        const budgetConfig = {
            ...data,
            repartition,
            depenses: currentConfig?.depenses || []
        };

        onSave(budgetConfig);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold">Configuration du budget</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:bg-blue-700 p-1 rounded-full transition-colors">
                        <Close />
                    </button>
                </div>

                {/* Formulaire */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                    {/* Type de projet */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Type de financement
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`border rounded-lg p-4 cursor-pointer transition-all ${watchType === 'interne'
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    {...register('type')}
                                    value="interne"
                                    className="hidden"
                                />
                                <div className="flex items-center gap-3">
                                    <Savings className={watchType === 'interne' ? 'text-green-600' : 'text-gray-400'} />
                                    <div>
                                        <p className="font-medium">Fonds propres</p>
                                        <p className="text-xs text-gray-500">Budget interne de l'entreprise</p>
                                    </div>
                                </div>
                            </label>

                            <label className={`border rounded-lg p-4 cursor-pointer transition-all ${watchType === 'investissement'
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}>
                                <input
                                    type="radio"
                                    {...register('type')}
                                    value="investissement"
                                    className="hidden"
                                />
                                <div className="flex items-center gap-3">
                                    <Business className={watchType === 'investissement' ? 'text-purple-600' : 'text-gray-400'} />
                                    <div>
                                        <p className="font-medium">Investissement</p>
                                        <p className="text-xs text-gray-500">Budget alloué par investisseurs</p>
                                    </div>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Montant total et devise */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <AttachMoney className="inline mr-2 text-blue-600" />
                                Montant total
                            </label>
                            <input
                                type="number"
                                {...register('montantTotal', {
                                    required: 'Le montant est requis',
                                    min: { value: 0, message: 'Montant invalide' }
                                })}
                                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.montantTotal ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="0"
                            />
                            {errors.montantTotal && (
                                <p className="text-red-500 text-sm mt-1">{errors.montantTotal.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CurrencyExchange className="inline mr-2 text-blue-600" />
                                Devise
                            </label>
                            <select
                                {...register('devise')}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                                <option value="EUR">Euro (€)</option>
                                <option value="USD">Dollar ($)</option>
                                <option value="GBP">Livre (£)</option>
                                <option value="CHF">Franc suisse (CHF)</option>
                                <option value="XAF">Franc CFA (FCFA)</option>
                            </select>
                        </div>
                    </div>

                    {/* Réserve pour imprévus */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Réserve pour imprévus
                        </label>
                        <div className="flex gap-4 items-center">
                            <input
                                type="range"
                                min="0"
                                max="20"
                                step="1"
                                value={watchReserve}
                                onChange={(e) => setValue('reserve', Number(e.target.value))}
                                className="flex-1"
                            />
                            <span className="text-lg font-bold text-blue-600 min-w-[80px]">
                                {watchReserve}%
                            </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            Montant réservé: {((watchMontantTotal * watchReserve) / 100).toLocaleString()} {watch('devise')}
                        </p>
                    </div>

                    {/* Type de répartition */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Répartition du budget
                        </label>
                        <div className="flex gap-4 mb-4">
                            <button
                                type="button"
                                onClick={() => setRepartitionType('auto')}
                                className={`px-4 py-2 rounded-lg font-medium ${repartitionType === 'auto'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}>
                                Automatique
                            </button>
                            <button
                                type="button"
                                onClick={() => setRepartitionType('manuel')}
                                className={`px-4 py-2 rounded-lg font-medium ${repartitionType === 'manuel'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}>
                                Manuel
                            </button>
                        </div>

                        {repartitionType === 'manuel' && (
                            <div className="space-y-3 border rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-2">Attribuer un budget à chaque phase</p>
                                {phases.map((phase) => (
                                    <div key={phase.id} className="flex items-center gap-3">
                                        <span className="flex-1 font-medium">{phase.title}</span>
                                        <input
                                            type="number"
                                            {...register(`repartition.${phase.id}`, {
                                                required: 'Montant requis',
                                                min: 0
                                            })}
                                            className="w-32 p-2 border border-gray-300 rounded-lg"
                                            placeholder="Montant"
                                        />
                                        <span className="text-gray-500 w-16">{watch('devise')}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Avertissement */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <div className="flex gap-3">
                            <Warning className="text-yellow-600" />
                            <div>
                                <p className="font-medium text-yellow-800">Note importante</p>
                                <p className="text-sm text-yellow-700">
                                    La configuration du budget peut être modifiée à tout moment.
                                    Les dépenses déjà enregistrées ne seront pas affectées.
                                </p>
                            </div>
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

export default ModalConfigBudget;