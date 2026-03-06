import React, { useState } from 'react';
import {
    CurrencyExchange,
    SwapHoriz,
    Info
} from "@mui/icons-material";

// Taux de conversion approximatifs
const tauxDeConversion = {
    EUR: { XOF: 655.957, USD: 1.08, GBP: 0.86, CHF: 0.98 },
    USD: { XOF: 605, EUR: 0.92, GBP: 0.79, CHF: 0.91 },
    GBP: { XOF: 765, EUR: 1.16, USD: 1.26, CHF: 1.15 },
    CHF: { XOF: 665, EUR: 1.02, USD: 1.10, GBP: 0.87 },
    XOF: { EUR: 0.0015, USD: 0.00165, GBP: 0.0013, CHF: 0.0015 }
};

const CurrencyConverter = ({ budgetConfig = {}, onConvert, formatMontant }) => {

    const [targetDevise, setTargetDevise] = useState('EUR');
    const [montantTest, setMontantTest] = useState(1000);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const deviseActuelle = budgetConfig.devise || 'USD';
    const montantTotal = budgetConfig.montantTotal || 0;

    const devisesDisponibles = ['XOF', 'EUR', 'USD', 'GBP', 'CHF'];
    const autresDevises = devisesDisponibles.filter(d => d !== deviseActuelle);

    const taux = targetDevise && deviseActuelle !== targetDevise
        ? tauxDeConversion[deviseActuelle]?.[targetDevise] || 1
        : 1;

    const montantConverti = montantTest * taux;

    const handleConvert = () => {
        if (targetDevise === deviseActuelle) return;
        setShowConfirmation(true);
    };

    const confirmConversion = () => {
        if (onConvert) {
            onConvert(targetDevise, taux);
        }
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
                <p className="text-sm text-blue-600">Devise actuelle</p>
                <p className="text-2xl font-bold text-blue-700">
                    {deviseActuelle}
                </p>

                <p className="text-sm text-gray-600 mt-2">
                    Budget total : {formatMontant?.(montantTotal) || montantTotal}
                </p>
            </div>

            {/* Sélecteur devise */}
            <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                    Convertir vers
                </label>

                <select
                    value={targetDevise}
                    onChange={(e) => setTargetDevise(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                >
                    {autresDevises.map(devise => (
                        <option key={devise} value={devise}>
                            {devise}
                        </option>
                    ))}
                </select>
            </div>

            {/* Preview taux */}
            {deviseActuelle !== targetDevise && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between">
                        <span>Taux conversion</span>
                        <strong>
                            1 {deviseActuelle} = {taux.toFixed(3)} {targetDevise}
                        </strong>
                    </div>

                    <div className="mt-3 flex justify-between">
                        <span>Budget après conversion</span>
                        <strong className="text-blue-600">
                            {(montantTotal * taux).toLocaleString()} {targetDevise}
                        </strong>
                    </div>
                </div>
            )}

            {/* Test conversion */}
            <div className="border rounded-lg p-4 mb-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                    <SwapHoriz className="text-blue-600" />
                    Test conversion
                </h3>

                <div className="flex gap-4 items-center">
                    <input
                        type="number"
                        value={montantTest}
                        onChange={(e) => setMontantTest(Number(e.target.value))}
                        className="flex-1 p-2 border rounded-lg"
                    />

                    <span>{deviseActuelle}</span>
                    <span>→</span>

                    <div className="flex-1 p-2 bg-gray-100 rounded-lg">
                        {montantConverti.toLocaleString()} {targetDevise}
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                    <Info className="text-yellow-600" />
                    <div className="text-sm text-yellow-700">
                        La conversion affecte le budget total, la réserve et les dépenses.
                    </div>
                </div>
            </div>

            {/* Button */}
            <button
                onClick={handleConvert}
                disabled={deviseActuelle === targetDevise}
                className={`w-full py-3 rounded-lg flex justify-center gap-2 ${deviseActuelle === targetDevise
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
            >
                <CurrencyExchange />
                Convertir le budget
            </button>

            {/* Confirmation */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full">

                        <h3 className="text-xl font-bold mb-4">
                            Confirmer conversion
                        </h3>

                        <p className="text-sm text-gray-600 mb-4">
                            Convertir le budget de {deviseActuelle} vers {targetDevise}.
                            Action irréversible.
                        </p>

                        <div className="bg-gray-50 p-4 rounded-lg mb-4">
                            <p className="text-sm">Nouveau budget</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {(montantTotal * taux).toLocaleString()} {targetDevise}
                            </p>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Annuler
                            </button>

                            <button
                                onClick={confirmConversion}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                            >
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