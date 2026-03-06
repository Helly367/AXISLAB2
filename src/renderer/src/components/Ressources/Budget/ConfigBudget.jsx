import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
    Close, Save, AttachMoney, Business, Savings,
    CurrencyExchange, NotificationsActive
} from "@mui/icons-material";

const ConfigBudget = ({ isOpen, onClose, onSave, phases = [], currentConfig = {} }) => {

    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
        defaultValues: currentConfig
    });

    const [repartitionType, setRepartitionType] = useState('auto');

    const watchType = watch('type', 'interne');
    const watchMontantTotal = watch('montantTotal', 0);
    const watchReserve = watch('reserve', 0);
    const watchSeuilAlerte = watch('alertes.seuilAlerte', 80);

    const calculerRepartitionAuto = (montant, reserve) => {

        if (!phases || phases.length === 0) return {};

        const montantNet = montant - ((montant * reserve) / 100);

        if (montantNet <= 0) return {};

        const montantParPhase = montantNet / phases.length;

        const repartition = {};

        phases.forEach(phase => {
            repartition[phase.id] = Math.round(montantParPhase * 100) / 100;
        });

        return repartition;
    };

    const onSubmit = (data) => {

        let repartition = data.repartition || {};

        if (repartitionType === 'auto') {
            repartition = calculerRepartitionAuto(
                Number(data.montantTotal || 0),
                Number(data.reserve || 0)
            );
        }

        const budgetConfig = {
            ...data,
            repartition,
            deviseOrigine: data.devise,
            tauxConversion: 1,
            depenses: currentConfig?.depenses || []
        };

        onSave(budgetConfig);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">

                <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 flex justify-between items-center sticky top-0">
                    <h2 className="text-xl text-white font-bold">
                        Configuration du budget
                    </h2>

                    <button onClick={onClose} className="text-white hover:bg-blue-700 p-1 rounded-full">
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

                            <label className={`border rounded-lg p-4 cursor-pointer ${watchType === 'interne' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}>
                                <input type="radio" {...register('type')} value="interne" className="hidden" />
                                <div className="flex items-center gap-3">
                                    <Savings className={watchType === 'interne' ? 'text-green-600' : 'text-gray-400'} />
                                    <div>
                                        <p className="font-medium">Fonds propres</p>
                                        <p className="text-xs text-gray-500">Budget interne</p>
                                    </div>
                                </div>
                            </label>

                            <label className={`border rounded-lg p-4 cursor-pointer ${watchType === 'investissement' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'}`}>
                                <input type="radio" {...register('type')} value="investissement" className="hidden" />
                                <div className="flex items-center gap-3">
                                    <Business className={watchType === 'investissement' ? 'text-purple-600' : 'text-gray-400'} />
                                    <div>
                                        <p className="font-medium">Investissement</p>
                                        <p className="text-xs text-gray-500">Budget externe</p>
                                    </div>
                                </div>
                            </label>

                        </div>
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
                                {...register('montantTotal', { required: true, min: 0 })}
                                className="w-full p-3 border rounded-lg border-gray-300"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <CurrencyExchange className="inline mr-2 text-blue-600" />
                                Devise
                            </label>

                            <select {...register('devise')} className="w-full p-3 border border-gray-300 rounded-lg">
                                <option value="XOF">FCFA</option>
                                <option value="EUR">Euro</option>
                                <option value="USD">Dollar</option>
                                <option value="GBP">Livre</option>
                                <option value="CHF">CHF</option>
                            </select>
                        </div>

                    </div>

                    {/* Réserve */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Réserve pour imprévus (%)
                        </label>

                        <input
                            type="range"
                            min="0"
                            max="20"
                            step="1"
                            value={watchReserve}
                            onChange={(e) => setValue('reserve', Number(e.target.value))}
                            className="w-full"
                        />

                        <p className="text-sm text-gray-500 mt-1">
                            Montant réservé :
                            {((watchMontantTotal * watchReserve) / 100).toLocaleString()}
                            {watch('devise')}
                        </p>
                    </div>

                    {/* Alertes */}
                    <div className="border rounded-lg p-4">
                        <h3 className="font-medium flex items-center gap-2 mb-4">
                            <NotificationsActive className="text-blue-600" />
                            Paramètres d'alerte
                        </h3>

                        <input
                            type="range"
                            min="50"
                            max="95"
                            step="5"
                            value={watchSeuilAlerte}
                            onChange={(e) => setValue('alertes.seuilAlerte', Number(e.target.value))}
                            className="w-full"
                        />

                        <label className="flex items-center gap-2 mt-3 text-sm">
                            <input type="checkbox" {...register('alertes.notifications')} />
                            Activer les notifications
                        </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 border-t pt-4">
                        <button type="button" onClick={onClose}
                            className="px-6 py-2 border rounded-lg hover:bg-gray-50">
                            Annuler
                        </button>

                        <button type="submit"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                            <Save /> Enregistrer
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default ConfigBudget;