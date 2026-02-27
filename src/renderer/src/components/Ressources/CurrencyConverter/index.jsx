import React, { useState } from 'react';
import {
    CurrencyExchange,
    SwapHoriz,
    Info,
    Warning
} from "@mui/icons-material";

// Taux de conversion approximatifs (à remplacer par une API réelle)
const tauxDeConversion = {
    EUR: { XOF: 655.957, USD: 1.08, GBP: 0.86, CHF: 0.98 },
    USD: { XOF: 605, EUR: 0.92, GBP: 0.79, CHF: 0.91 },
    GBP: { XOF: 765, EUR: 1.16, USD: 1.26, CHF: 1.15 },
    CHF: { XOF: 665, EUR: 1.02, USD: 1.10, GBP: 0.87 },
    XOF: { EUR: 0.0015, USD: 0.00165, GBP: 0.0013, CHF: 0.0015 }
};

const CurrencyConverter = ({ budgetConfig, onConvert, formatMontant }) => {
    const [targetDevise, setTargetDevise] = useState('EUR');
    const [montantTest, setMontantTest] = useState(1000);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const devisesDisponibles = ['XOF', 'EUR', 'USD', 'GBP', 'CHF'];
    const autresDevises = devisesDisponibles.filter(d => d !== budgetConfig.devise);

    const taux = targetDevise && budgetConfig.devise !== targetDevise
        ? tauxDeConversion[budgetConfig.devise]?.[targetDevise] || 1
        : 1;

    const montantConverti = montantTest * taux;

    const handleConvert = () => {
        if (targetDevise === budgetConfig.devise) return;
        setShowConfirmation(true);
    };

    const confirmConversion = () => {
        onConvert(targetDevise, taux);
        setShowConfirmation(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 m-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                <CurrencyExchange className="text-blue-600" />
                Conversion de devise
            </h2>

            {/* Devise actuelle */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-600 mb-1">Devise actuelle</p>
                <p className="text-2xl font-bold text-blue-700">{budgetConfig.devise}</p>
                <p className="text-sm text-gray-600 mt-2">
                    Budget total: {formatMontant(budgetConfig.montantTotal)}
                </p>
            </div>

            {/* Sélecteur de devise cible */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Convertir vers
                </label>
                <select
                    value={targetDevise}
                    onChange={(e) => setTargetDevise(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                    {autresDevises.map(devise => (
                        <option key={devise} value={devise}>{devise}</option>
                    ))}
                </select>
            </div>

            {/* Aperçu du taux */}
            {budgetConfig.devise !== targetDevise && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600">Taux de conversion</span>
                        <span className="font-bold">
                            1 {budgetConfig.devise} = {taux.toFixed(3)} {targetDevise}
                        </span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Budget après conversion</span>
                        <span className="text-xl font-bold text-blue-600">
                            {(budgetConfig.montantTotal * taux).toLocaleString()} {targetDevise}
                        </span>
                    </div>
                </div>
            )}

            {/* Test de conversion */}
            <div className="border rounded-lg p-4 mb-6">
                <h3 className="font-medium text-gray-700 mb-4 flex items-center gap-2">
                    <SwapHoriz className="text-blue-600" />
                    Test de conversion
                </h3>
                <div className="flex items-center gap-4">
                    <input
                        type="number"
                        value={montantTest}
                        onChange={(e) => setMontantTest(Number(e.target.value))}
                        className="flex-1 p-2 border border-gray-300 rounded-lg"
                    />
                    <span className="text-gray-600">{budgetConfig.devise}</span>
                    <span className="text-gray-400">→</span>
                    <span className="flex-1 p-2 bg-gray-100 rounded-lg">
                        {montantConverti.toLocaleString()} {targetDevise}
                    </span>
                </div>
            </div>

            {/* Informations importantes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                    <Info className="text-yellow-600" />
                    <div>
                        <p className="font-medium text-yellow-800">Important</p>
                        <p className="text-sm text-yellow-700">
                            La conversion affectera :
                        </p>
                        <ul className="list-disc list-inside text-sm text-yellow-700 mt-2">
                            <li>Le budget total</li>
                            <li>La réserve pour imprévus</li>
                            <li>La répartition par phase</li>
                            <li>Toutes les dépenses enregistrées</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bouton de conversion */}
            <button
                onClick={handleConvert}
                disabled={budgetConfig.devise === targetDevise}
                className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 ${budgetConfig.devise === targetDevise
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}>
                <CurrencyExchange /> Convertir le budget
            </button>

            {/* Modal de confirmation */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmer la conversion</h3>
                        <p className="text-gray-600 mb-4">
                            Vous êtes sur le point de convertir tout le budget de {budgetConfig.devise} vers {targetDevise}.
                            Cette action est irréversible.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <p className="text-sm text-gray-600">Nouveau budget</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {(budgetConfig.montantTotal * taux).toLocaleString()} {targetDevise}
                            </p>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                Annuler
                            </button>
                            <button
                                onClick={confirmConversion}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                Confirmer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrencyConverter;