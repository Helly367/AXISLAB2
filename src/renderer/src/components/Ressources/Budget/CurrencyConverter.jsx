import React, { useState, useEffect } from 'react';
import {
    CurrencyExchange,
    SwapHoriz,
    Info,
    Warning,
    Edit,
    Check,
    Close
} from "@mui/icons-material";
import { formateDate, formatMontant, getCodesDevises } from '../../../Services/functions';
import { tauxDeConversion, devises } from '../../../Services/listes';
import { alertService } from '../../../Services/alertService';
import { motion } from 'framer-motion';

const CurrencyConverter = ({ budget = {}, convertionBudget, projet_id }) => {

    const [newDevise, setNewDevise] = useState('');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [taux, setTaux] = useState(1);
    const [tauxPersonnalise, setTauxPersonnalise] = useState(null);
    const [modeEditionTaux, setModeEditionTaux] = useState(false);
    const [tauxSaisie, setTauxSaisie] = useState('');
    const [error, setError] = useState('');
    const [infoMessage, setInfoMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const deviseActuelle = budget.devise || 'USD';
    const montantTotal = budget.budget_total || 0;
    const tauxInitial = budget.taux_conversion || 1;

    const autresDevises = devises.filter(d => d.code !== deviseActuelle);

    useEffect(() => {
        if (autresDevises.length > 0 && !newDevise) {
            setNewDevise(autresDevises[0].code);
        }
    }, [autresDevises, newDevise]);

    const getTauxAuto = () => {
        if (!deviseActuelle || !newDevise || deviseActuelle === newDevise) return 1;

        try {
            if (!tauxDeConversion[deviseActuelle]) return 1;

            const tauxDirect = tauxDeConversion[deviseActuelle][newDevise];
            if (tauxDirect) return tauxDirect;

            if (tauxDeConversion[newDevise]?.[deviseActuelle]) {
                return 1 / tauxDeConversion[newDevise][deviseActuelle];
            }

            return 1;
        } catch {
            return 1;
        }
    };

    const tauxAuto = getTauxAuto();

    useEffect(() => {
        setTaux(
            tauxPersonnalise !== null && tauxPersonnalise > 0
                ? tauxPersonnalise
                : tauxAuto
        );
    }, [tauxAuto, tauxPersonnalise]);

    const montantConverti = montantTotal * taux;

    const differenceTaux =
        tauxPersonnalise !== null && tauxAuto > 0
            ? Number(((tauxPersonnalise - tauxAuto) / tauxAuto * 100).toFixed(2))
            : 0;

    const handleDeviseChange = (e) => {
        const nouvelleDevise = e.target.value;
        setNewDevise(nouvelleDevise);
        setTauxPersonnalise(null);
        setModeEditionTaux(false);
        setError('');
        setInfoMessage('');
    };

    const activerEditionTaux = () => {
        setTauxSaisie(
            tauxPersonnalise !== null ? tauxPersonnalise.toString() : taux.toString()
        );
        setModeEditionTaux(true);
        setError('');
    };

    const validerTauxPersonnalise = () => {
        const valeur = tauxSaisie.replace(',', '.');
        const nouveauTaux = parseFloat(valeur);

        if (isNaN(nouveauTaux)) {
            setError("Veuillez saisir un nombre valide");
            return;
        }

        if (nouveauTaux <= 0) {
            setError("Le taux doit être supérieur à 0");
            return;
        }

        if (nouveauTaux > 10000) {
            setError("Taux anormalement élevé");
            return;
        }

        setTauxPersonnalise(nouveauTaux);
        setModeEditionTaux(false);
        setError('');
        setInfoMessage('Taux personnalisé appliqué');

        setTimeout(() => setInfoMessage(''), 3000);
    };

    const annulerEditionTaux = () => {
        setModeEditionTaux(false);
        setTauxSaisie('');
        setError('');
    };

    const resetTauxAuto = () => {
        setTauxPersonnalise(null);
        setModeEditionTaux(false);
        setInfoMessage('Retour au taux automatique');

        setTimeout(() => setInfoMessage(''), 3000);
    };

    const isConversionPossible =
        deviseActuelle !== newDevise && newDevise && taux > 0;

    const formatNumber = (number, decimals = 2) => {
        if (number === undefined || number === null) return '0';
        return new Intl.NumberFormat('fr-FR', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }).format(number);
    };

    const handleConvertClick = () => {
        if (!isConversionPossible) return;
        setShowConfirmation(true);
    };

    const confirmConversion = async () => {
        setLoading(true);

        try {
            const conversionData = {
                taux_conversion: taux,
                budget_total: montantConverti,
                budget_restant: montantConverti,
                devise: newDevise,
            };

            const response = await convertionBudget(projet_id, conversionData);

            alertService.handleBackendResponse(response);

            if (response.success) {
                alertService.success("Budget converti avec succès");
                setShowConfirmation(false);
            } else {
                if (response.errors) {
                    response.errors.forEach(err => {
                        setError(err.message);
                    });
                }
            }
        } catch (error) {
            alertService.error(error.message || "erreur de conversion du budget");
        }

        setLoading(false);
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 m-6 max-w-3xl w-300">
            {/* En-tête */}
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                <CurrencyExchange className="text-blue-600" />
                Conversion de devise
            </h2>

            {/* Messages d'information */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="flex gap-3 items-center">
                        <Warning className="text-red-600" />
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                </div>
            )}

            {infoMessage && !error && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex gap-3 items-center">
                        <Check className="text-green-600" />
                        <p className="text-sm text-green-700">{infoMessage}</p>
                    </div>
                </div>
            )}

            {/* Section des devises */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Devise actuelle */}
                <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-600 font-medium mb-1">Devise actuelle</p>
                    <div className="flex items-baseline justify-between">
                        <p className="text-2xl font-bold text-blue-700">
                            {deviseActuelle}
                        </p>
                        <span className="text-sm text-gray-500">
                            {devises.find(d => d.code === deviseActuelle)?.symbole}
                        </span>
                    </div>

                    <div className="mt-3">
                        <p className="text-xs text-gray-500">Budget total</p>
                        <p className="text-lg font-semibold text-gray-800">
                            {formatNumber(montantTotal)} {deviseActuelle}
                        </p>
                    </div>

                    {tauxInitial !== 1 && (
                        <p className="text-xs text-gray-400 mt-2">
                            Taux actuel: 1 {deviseActuelle} = {formatNumber(tauxInitial, 3)} {newDevise || '?'}
                        </p>
                    )}
                </div>

                {/* Sélecteur devise cible */}
                <div className="bg-gray-50 rounded-lg p-4">
                    <label className="block text-sm font-medium mb-2 text-gray-700">
                        Convertir vers
                    </label>

                    <select
                        value={newDevise}
                        onChange={handleDeviseChange}
                        className="w-full px-4 py-3 bg-white border-2 rounded-lg 
                                 focus:outline-none focus:border-blue-500 
                                 transition-colors duration-300"
                        disabled={autresDevises.length === 0}
                    >
                        {autresDevises.length > 0 ? (
                            autresDevises.map((devise) => (
                                <option key={devise.code} value={devise.code}>
                                    {devise.code} - {devise.nom}
                                </option>
                            ))
                        ) : (
                            <option value="">Aucune devise disponible</option>
                        )}
                    </select>

                    {deviseActuelle !== newDevise && newDevise && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
                            <SwapHoriz fontSize="small" />
                            <span>Conversion {deviseActuelle} → {newDevise}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Section Taux de conversion */}
            {deviseActuelle !== newDevise && newDevise && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-gray-700">
                            Taux de conversion
                        </span>

                        {/* Boutons d'action */}
                        {!modeEditionTaux ? (
                            <div className="flex gap-2">
                                <button
                                    onClick={activerEditionTaux}
                                    className="text-sm text-blue-600 hover:text-blue-800 
                                             flex items-center gap-1 px-2 py-1 rounded
                                             hover:bg-blue-100 transition-colors"
                                    title="Saisir un taux personnalisé"
                                >
                                    <Edit fontSize="small" />
                                    {tauxPersonnalise !== null ? 'Modifier' : 'Personnaliser'}
                                </button>

                                {tauxPersonnalise !== null && (
                                    <button
                                        onClick={resetTauxAuto}
                                        className="text-sm text-gray-600 hover:text-gray-800 
                                                 px-2 py-1 rounded hover:bg-gray-200"
                                    >
                                        Auto
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={validerTauxPersonnalise}
                                    className="text-sm text-green-600 hover:text-green-800 
                                             flex items-center gap-1 px-2 py-1 rounded
                                             hover:bg-green-100"
                                >
                                    <Check fontSize="small" />
                                    Valider
                                </button>
                                <button
                                    onClick={annulerEditionTaux}
                                    className="text-sm text-gray-600 hover:text-gray-800 
                                             flex items-center gap-1 px-2 py-1 rounded
                                             hover:bg-gray-200"
                                >
                                    <Close fontSize="small" />
                                    Annuler
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Zone de saisie du taux (visible seulement en mode édition) */}
                    {modeEditionTaux ? (
                        <div className="bg-white p-4 rounded-lg border-2 border-blue-200">
                            <label className="block text-sm font-medium mb-2">
                                Saisissez votre taux personnalisé
                            </label>
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-medium">1 {deviseActuelle} =</span>
                                <input
                                    type="number"
                                    value={tauxSaisie}
                                    onChange={(e) => setTauxSaisie(e.target.value)}
                                    step="0.001"
                                    min="0.001"
                                    className="w-32 px-3 py-2 border-2 rounded-lg 
                                             focus:outline-none focus:border-blue-500
                                             text-right"
                                    placeholder={tauxAuto.toFixed(4)}
                                    autoFocus
                                />
                                <span className="text-sm font-medium">{newDevise}</span>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                                Taux automatique de référence : 1 {deviseActuelle} = {formatNumber(tauxAuto, 4)} {newDevise}
                            </p>
                        </div>
                    ) : (
                        /* Affichage normal du taux */
                        <div>
                            <div className="flex justify-between items-center bg-white p-3 rounded-lg">
                                <div>
                                    <p className="text-lg font-bold">
                                        1 {deviseActuelle} = {formatNumber(taux, 4)} {newDevise}
                                    </p>

                                    {tauxPersonnalise !== null && (
                                        <span className="inline-block mt-1 text-xs px-2 py-1 
                                                       bg-yellow-100 text-yellow-700 rounded-full">
                                            Taux personnalisé
                                            {Math.abs(parseFloat(differenceTaux)) > 0.01 && (
                                                <span className="ml-1">
                                                    ({differenceTaux > 0 ? '+' : ''}{differenceTaux}%)
                                                </span>
                                            )}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Taux inversé */}
                            <p className="text-xs text-gray-500 mt-2">
                                1 {newDevise} = {formatNumber(1 / taux, 4)} {deviseActuelle}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Aperçu du montant converti */}
            {deviseActuelle !== newDevise && newDevise && (
                <div className="bg-linear-to-r from-blue-50 to-indigo-50 
                              border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-600">Budget après conversion</p>
                            <p className="text-xs text-gray-500">
                                Taux {tauxPersonnalise !== null ? 'personnalisé' : 'automatique'} appliqué
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-blue-600">
                                {formatNumber(montantConverti)} {newDevise}
                            </p>
                            <p className="text-xs text-gray-500">
                                (était {formatNumber(montantTotal)} {deviseActuelle})
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Message d'information important */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex gap-3">
                    <Info className="text-yellow-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-yellow-700">
                        <p className="font-medium mb-1">Information importante :</p>
                        <ul className="list-disc list-inside space-y-1">
                            <li>La conversion affecte le budget total, les réserves et les dépenses</li>
                            <li>Vous pouvez utiliser le taux automatique ou saisir un taux personnalisé</li>
                            <li>Cette action est irréversible</li>
                            <li>Un historique de conversion sera créé</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bouton de conversion */}
            <button
                onClick={handleConvertClick}
                disabled={!isConversionPossible || loading}
                className={`w-full py-4 rounded-lg flex items-center justify-center gap-2 
                           font-medium text-lg transition-all duration-300
                           ${!isConversionPossible || loading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'}`}>
                <CurrencyExchange />

            </button>

            {/* Modal de confirmation */}
            {showConfirmation && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 
                              p-4 overflow-y-auto">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
                        <h3 className="text-2xl font-bold mb-2">
                            Confirmer la conversion
                        </h3>

                        <p className="text-sm text-gray-600 mb-6">
                            Vous êtes sur le point de convertir le budget de <strong>{deviseActuelle}</strong> vers <strong>{newDevise}</strong>.
                        </p>

                        {/* Résumé de la conversion */}
                        <div className="space-y-4 mb-6">
                            {/* Taux utilisé */}
                            <div className={`p-4 rounded-lg ${tauxPersonnalise !== null ? 'bg-yellow-50' : 'bg-gray-50'
                                }`}>
                                <p className="text-sm font-medium mb-2">
                                    Taux appliqué :
                                </p>
                                <p className="text-lg font-bold">
                                    1 {deviseActuelle} = {formatNumber(taux, 4)} {newDevise}
                                </p>
                                {tauxPersonnalise !== null && (
                                    <div className="mt-2 text-xs">
                                        <span className="text-yellow-700">
                                            ⚠️ Taux personnalisé
                                            {Math.abs(parseFloat(differenceTaux)) > 0.01 && (
                                                <span> (différence de {differenceTaux}% par rapport au marché)</span>
                                            )}
                                        </span>
                                        <p className="text-gray-500 mt-1">
                                            Taux automatique: 1 {deviseActuelle} = {formatNumber(tauxAuto, 4)} {newDevise}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Montants */}
                            <div className="bg-blue-50 p-4 rounded-lg">
                                <p className="text-sm text-blue-600 mb-1">Montant actuel</p>
                                <p className="text-lg text-gray-700">
                                    {formatNumber(montantTotal)} {deviseActuelle}
                                </p>

                                <div className="border-t border-blue-200 my-3 pt-3">
                                    <p className="text-sm text-blue-600 mb-1">Nouveau montant</p>
                                    <p className="text-2xl font-bold text-blue-700">
                                        {formatNumber(montantConverti)} {newDevise}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Avertissement */}
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                            <p className="text-xs text-red-700 flex items-start gap-2">
                                <Warning className="text-red-600 shrink-0" fontSize="small" />
                                <span>
                                    Cette action est irréversible. Assurez-vous d'avoir choisi le bon taux
                                    et la bonne devise avant de confirmer.
                                </span>
                            </p>
                        </div>

                        {/* Boutons d'action */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmation(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg 
                                         hover:bg-gray-50 transition-colors"
                            >
                                Annuler
                            </button>

                            <motion.button
                                type="button"
                                disabled={loading}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => confirmConversion()}
                                className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2'
                            >

                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        conversion en cours...
                                    </>
                                ) : (
                                    <>
                                        <CurrencyExchange fontSize="small" />
                                        Confirmer la conversion

                                    </>
                                )}

                            </motion.button>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CurrencyConverter;