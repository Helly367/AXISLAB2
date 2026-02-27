import React, { useState } from 'react';
import {
    Settings,
    ArrowBack,
    Save,
    NotificationsActive,
    Email,
    Phone,
    Schedule,
    AttachMoney,
    Warning,
    AccessTime
} from "@mui/icons-material";

const NotificationSettings = ({ settings, onSave, onBack }) => {
    const [localSettings, setLocalSettings] = useState(settings);

    const handleSave = () => {
        onSave(localSettings);
        onBack();
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {/* Header */}
            <div className="flex items-center gap-4 pb-6 border-b mb-6">
                <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowBack />
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Paramètres des notifications</h2>
                    <p className="text-gray-500">Configurez vos préférences de notification</p>
                </div>
            </div>

            <div className="space-y-8">
                {/* Rappels d'échéances */}
                <div>
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <Schedule className="text-blue-600" />
                        Rappels d'échéances
                    </h3>

                    <div className="space-y-4 ml-8">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Activer les rappels</p>
                                <p className="text-sm text-gray-500">Recevoir des notifications avant les échéances</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={localSettings.rappels.echeances}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    rappels: { ...localSettings.rappels, echeances: e.target.checked }
                                })}
                                className="w-5 h-5 text-blue-600"
                            />
                        </label>

                        {localSettings.rappels.echeances && (
                            <>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">
                                            Délai avant échéance (jours)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="30"
                                            value={localSettings.rappels.delai}
                                            onChange={(e) => setLocalSettings({
                                                ...localSettings,
                                                rappels: { ...localSettings.rappels, delai: parseInt(e.target.value) }
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">
                                            Heure de notification
                                        </label>
                                        <input
                                            type="time"
                                            value={localSettings.rappels.heure}
                                            onChange={(e) => setLocalSettings({
                                                ...localSettings,
                                                rappels: { ...localSettings.rappels, heure: e.target.value }
                                            })}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Alertes budgétaires */}
                <div>
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <AttachMoney className="text-green-600" />
                        Alertes budgétaires
                    </h3>

                    <div className="space-y-4 ml-8">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Alertes budget</p>
                                <p className="text-sm text-gray-500">Être alerté en cas de dépassement budgétaire</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={localSettings.alertes.budget}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    alertes: { ...localSettings.alertes, budget: e.target.checked }
                                })}
                                className="w-5 h-5 text-blue-600"
                            />
                        </label>

                        {localSettings.alertes.budget && (
                            <div>
                                <label className="block text-sm text-gray-600 mb-2">
                                    Seuil d'alerte (% du budget)
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="range"
                                        min="50"
                                        max="95"
                                        step="5"
                                        value={localSettings.alertes.seuil}
                                        onChange={(e) => setLocalSettings({
                                            ...localSettings,
                                            alertes: { ...localSettings.alertes, seuil: parseInt(e.target.value) }
                                        })}
                                        className="flex-1"
                                    />
                                    <span className="text-lg font-bold text-blue-600 w-16">
                                        {localSettings.alertes.seuil}%
                                    </span>
                                </div>
                            </div>
                        )}

                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-medium">Alertes de retard</p>
                                <p className="text-sm text-gray-500">Notifications pour les tâches en retard</p>
                            </div>
                            <input
                                type="checkbox"
                                checked={localSettings.alertes.retard}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    alertes: { ...localSettings.alertes, retard: e.target.checked }
                                })}
                                className="w-5 h-5 text-blue-600"
                            />
                        </label>
                    </div>
                </div>

                {/* Canaux de notification */}
                <div>
                    <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                        <NotificationsActive className="text-purple-600" />
                        Canaux de notification
                    </h3>

                    <div className="space-y-3 ml-8">
                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Email className="text-gray-600" />
                                <div>
                                    <p className="font-medium">Notifications par email</p>
                                    <p className="text-sm text-gray-500">Recevoir un email pour chaque alerte</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={localSettings.notifications.email}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    notifications: { ...localSettings.notifications, email: e.target.checked }
                                })}
                                className="w-5 h-5 text-blue-600"
                            />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <NotificationsActive className="text-gray-600" />
                                <div>
                                    <p className="font-medium">Notifications push</p>
                                    <p className="text-sm text-gray-500">Recevoir des notifications dans l'application</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={localSettings.notifications.push}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    notifications: { ...localSettings.notifications, push: e.target.checked }
                                })}
                                className="w-5 h-5 text-blue-600"
                            />
                        </label>

                        <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Phone className="text-gray-600" />
                                <div>
                                    <p className="font-medium">Notifications sonores</p>
                                    <p className="text-sm text-gray-500">Jouer un son pour les alertes importantes</p>
                                </div>
                            </div>
                            <input
                                type="checkbox"
                                checked={localSettings.notifications.son}
                                onChange={(e) => setLocalSettings({
                                    ...localSettings,
                                    notifications: { ...localSettings.notifications, son: e.target.checked }
                                })}
                                className="w-5 h-5 text-blue-600"
                            />
                        </label>
                    </div>
                </div>

                {/* Récapitulatif */}
                <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium text-blue-800 mb-3">Récapitulatif</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-blue-600">Rappels</p>
                            <p className="text-blue-800">
                                {localSettings.rappels.echeances
                                    ? `Actifs (${localSettings.rappels.delai}j avant)`
                                    : 'Désactivés'}
                            </p>
                        </div>
                        <div>
                            <p className="text-blue-600">Alertes</p>
                            <p className="text-blue-800">
                                {localSettings.alertes.budget
                                    ? `Budget: ${localSettings.alertes.seuil}%`
                                    : 'Budget désactivées'}
                                {localSettings.alertes.retard && ' + Retard'}
                            </p>
                        </div>
                        <div>
                            <p className="text-blue-600">Notifications</p>
                            <p className="text-blue-800">
                                {[
                                    localSettings.notifications.email && 'Email',
                                    localSettings.notifications.push && 'Push',
                                    localSettings.notifications.son && 'Son'
                                ].filter(Boolean).join(', ') || 'Aucun canal'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Boutons */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <button
                        onClick={onBack}
                        className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2">
                        <Save /> Enregistrer
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationSettings;