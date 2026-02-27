import React, { useState, useEffect } from 'react';
import {
    Notifications,
    Warning,
    CheckCircle,
    Info,
    Schedule,
    AttachMoney,
    Assignment,
    Campaign,
    Person,
    Close,
    Done,
    Delete,
    Settings,
    NotificationsActive,
    NotificationsOff,
    Refresh
} from "@mui/icons-material";
import NotificationSettings from '../NotificationSettings';

const NotificationsList = ({
    tasks = [],
    campagnes = [],
    budgetConfig = {},
    membres = [],
    onMarkAsRead,
    onDeleteNotification
}) => {
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
    const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'alerte', 'rappel', 'info'
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({
        rappels: {
            echeances: true,
            delai: 2, // jours avant
            heure: "09:00"
        },
        alertes: {
            budget: true,
            seuil: 80, // pourcentage
            retard: true
        },
        notifications: {
            email: true,
            push: true,
            son: false
        }
    });

    // Générer les notifications automatiquement
    useEffect(() => {
        const nouvellesNotifications = [];

        // 1. Alertes d'échéance de tâches
        tasks.forEach(task => {
            if (task.statut !== 'termine') {
                const today = new Date();
                const echeance = new Date(task.date_echeance);
                const diffDays = Math.ceil((echeance - today) / (1000 * 60 * 60 * 24));

                // Échéance dans les 2 jours
                if (diffDays <= settings.rappels.delai && diffDays >= 0) {
                    nouvellesNotifications.push({
                        id: `task-${task.id}-echeance`,
                        type: 'rappel',
                        sous_type: 'echeance',
                        titre: `Échéance imminente : ${task.titre}`,
                        description: `Cette tâche est due dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`,
                        date: new Date().toISOString(),
                        lien: `/taches/${task.id}`,
                        lu: false,
                        priorite: diffDays === 0 ? 'haute' : 'moyenne',
                        icon: <Schedule className="text-orange-500" />,
                        data: { taskId: task.id, echeance: task.date_echeance }
                    });
                }

                // Tâche en retard
                if (diffDays < 0) {
                    nouvellesNotifications.push({
                        id: `task-${task.id}-retard`,
                        type: 'alerte',
                        sous_type: 'retard',
                        titre: `Tâche en retard : ${task.titre}`,
                        description: `Retard de ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`,
                        date: new Date().toISOString(),
                        lien: `/taches/${task.id}`,
                        lu: false,
                        priorite: 'critique',
                        icon: <Warning className="text-red-500" />,
                        data: { taskId: task.id, retard: Math.abs(diffDays) }
                    });
                }
            }
        });

        // 2. Alertes budget
        if (budgetConfig && budgetConfig.montantTotal > 0) {
            const totalDepenses = budgetConfig.depenses?.reduce((acc, d) => acc + d.montant, 0) || 0;
            const pourcentageUtilise = (totalDepenses / budgetConfig.montantTotal) * 100;

            // Seuil d'alerte
            if (pourcentageUtilise >= settings.alertes.seuil) {
                nouvellesNotifications.push({
                    id: 'budget-seuil',
                    type: 'alerte',
                    sous_type: 'budget',
                    titre: `Seuil budgétaire atteint : ${pourcentageUtilise.toFixed(1)}%`,
                    description: `Vous avez utilisé ${pourcentageUtilise.toFixed(1)}% du budget total`,
                    date: new Date().toISOString(),
                    lien: '/budget',
                    lu: false,
                    priorite: pourcentageUtilise >= 100 ? 'critique' : 'haute',
                    icon: <AttachMoney className="text-red-500" />,
                    data: { pourcentage: pourcentageUtilise }
                });
            }

            // Dépenses récentes importantes
            const dernieresDepenses = budgetConfig.depenses?.slice(-3) || [];
            dernieresDepenses.forEach(depense => {
                if (depense.montant > budgetConfig.montantTotal * 0.1) { // 10% du budget
                    nouvellesNotifications.push({
                        id: `depense-${depense.id}`,
                        type: 'info',
                        sous_type: 'depense',
                        titre: `Dépense importante : ${depense.libelle}`,
                        description: `${depense.montant.toLocaleString()} ${budgetConfig.devise}`,
                        date: depense.date,
                        lien: '/budget',
                        lu: false,
                        priorite: 'moyenne',
                        icon: <AttachMoney className="text-blue-500" />,
                        data: { depenseId: depense.id }
                    });
                }
            });
        }

        // 3. Alertes campagnes
        campagnes.forEach(campagne => {
            if (campagne.status === 'en_cours') {
                const today = new Date();
                const fin = new Date(campagne.date_fin);
                const diffDays = Math.ceil((fin - today) / (1000 * 60 * 60 * 24));

                // Campagne bientôt terminée
                if (diffDays <= 5 && diffDays >= 0) {
                    nouvellesNotifications.push({
                        id: `campagne-${campagne.id}-fin`,
                        type: 'rappel',
                        sous_type: 'campagne',
                        titre: `Campagne bientôt terminée : ${campagne.nom}`,
                        description: `Se termine dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`,
                        date: new Date().toISOString(),
                        lien: `/campagnes/${campagne.id}`,
                        lu: false,
                        priorite: 'moyenne',
                        icon: <Campaign className="text-purple-500" />,
                        data: { campagneId: campagne.id }
                    });
                }

                // Budget campagne
                if (campagne.budgetAlloue && campagne.depenses_reelles) {
                    const totalDepense = campagne.depenses_reelles.reduce((acc, d) => acc + d.montant, 0);
                    const pourcentage = (totalDepense / campagne.budgetAlloue) * 100;

                    if (pourcentage >= 90) {
                        nouvellesNotifications.push({
                            id: `campagne-${campagne.id}-budget`,
                            type: 'alerte',
                            sous_type: 'campagne_budget',
                            titre: `Budget campagne critique : ${campagne.nom}`,
                            description: `${pourcentage.toFixed(1)}% du budget utilisé`,
                            date: new Date().toISOString(),
                            lien: `/campagnes/${campagne.id}`,
                            lu: false,
                            priorite: 'haute',
                            icon: <Warning className="text-orange-500" />,
                            data: { campagneId: campagne.id, pourcentage }
                        });
                    }
                }
            }
        });

        // 4. Rappels généraux
        // Début de semaine
        const today = new Date();
        if (today.getDay() === 1) { // Lundi
            const tachesSemaine = tasks.filter(t => {
                const echeance = new Date(t.date_echeance);
                const finSemaine = new Date(today);
                finSemaine.setDate(today.getDate() + 7);
                return echeance >= today && echeance <= finSemaine && t.statut !== 'termine';
            });

            if (tachesSemaine.length > 0) {
                nouvellesNotifications.push({
                    id: 'rappel-semaine',
                    type: 'rappel',
                    sous_type: 'hebdo',
                    titre: 'Rappel hebdomadaire',
                    description: `${tachesSemaine.length} tâche${tachesSemaine.length > 1 ? 's' : ''} à terminer cette semaine`,
                    date: new Date().toISOString(),
                    lien: '/taches',
                    lu: false,
                    priorite: 'basse',
                    icon: <Notifications className="text-blue-500" />,
                    data: { count: tachesSemaine.length }
                });
            }
        }

        setNotifications(prev => {
            // Fusionner avec les anciennes notifications sans doublons
            const all = [...nouvellesNotifications, ...prev];
            const unique = Array.from(new Map(all.map(n => [n.id, n])).values());
            return unique.sort((a, b) => new Date(b.date) - new Date(a.date));
        });
    }, [tasks, campagnes, budgetConfig, settings]);

    const handleMarkAsRead = (id) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, lu: true } : n)
        );
        if (onMarkAsRead) onMarkAsRead(id);
    };

    const handleMarkAllAsRead = () => {
        setNotifications(prev =>
            prev.map(n => ({ ...n, lu: true }))
        );
    };

    const handleDelete = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        if (onDeleteNotification) onDeleteNotification(id);
    };

    const handleClearAll = () => {
        if (window.confirm('Supprimer toutes les notifications ?')) {
            setNotifications([]);
        }
    };

    const getPriorityColor = (priorite) => {
        switch (priorite) {
            case 'critique':
                return 'bg-red-100 text-red-800 border-l-4 border-red-500';
            case 'haute':
                return 'bg-orange-100 text-orange-800 border-l-4 border-orange-500';
            case 'moyenne':
                return 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500';
            case 'basse':
                return 'bg-blue-100 text-blue-800 border-l-4 border-blue-500';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Filtrer les notifications
    const filteredNotifications = notifications.filter(n => {
        if (filter === 'unread' && n.lu) return false;
        if (filter === 'read' && !n.lu) return false;
        if (typeFilter !== 'all' && n.type !== typeFilter) return false;
        return true;
    });

    const unreadCount = notifications.filter(n => !n.lu).length;

    if (showSettings) {
        return (
            <NotificationSettings
                settings={settings}
                onSave={setSettings}
                onBack={() => setShowSettings(false)}
            />
        );
    }

    return (
        <div className="w-full bg-gray-200 p-4">
            {/* Header */}
            <div className="bg-primary rounded-lg shadow-md p-4 flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <Notifications className="text-white text-3xl" />
                    <h1 className="text-xl text-white font-bold">Alertes & Notifications</h1>
                    {unreadCount > 0 && (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                            {unreadCount} nouvelle{unreadCount > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => setShowSettings(true)}
                        className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 flex items-center gap-2">
                        <Settings /> Paramètres
                    </button>
                    <button
                        onClick={handleMarkAllAsRead}
                        className="bg-white text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 flex items-center gap-2">
                        <Done /> Tout marquer comme lu
                    </button>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-4 flex flex-wrap gap-4">
                <div className="flex items-center gap-2 border-r pr-4">
                    <span className="text-sm text-gray-500">Statut:</span>
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-3 py-1 rounded-lg text-sm ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                            }`}>
                        Toutes
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-3 py-1 rounded-lg text-sm ${filter === 'unread' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                            }`}>
                        Non lues
                    </button>
                    <button
                        onClick={() => setFilter('read')}
                        className={`px-3 py-1 rounded-lg text-sm ${filter === 'read' ? 'bg-blue-600 text-white' : 'bg-gray-100'
                            }`}>
                        Lues
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Type:</span>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm">
                        <option value="all">Tous les types</option>
                        <option value="alerte">Alertes</option>
                        <option value="rappel">Rappels</option>
                        <option value="info">Informations</option>
                    </select>
                </div>

                <div className="flex-1"></div>

                <button
                    onClick={handleClearAll}
                    className="text-red-600 hover:text-red-800 text-sm flex items-center gap-1">
                    <Delete fontSize="small" /> Tout supprimer
                </button>
            </div>

            {/* Liste des notifications */}
            {filteredNotifications.length > 0 ? (
                <div className="space-y-3">
                    {filteredNotifications.map((notif) => (
                        <div
                            key={notif.id}
                            className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 ${getPriorityColor(notif.priorite)} ${!notif.lu ? 'bg-opacity-50' : ''
                                }`}>
                            <div className="flex items-start gap-4">
                                {/* Icône */}
                                <div className="flex-shrink-0 mt-1">
                                    {notif.icon}
                                </div>

                                {/* Contenu */}
                                <div className="flex-1">
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-bold text-gray-800">
                                            {notif.titre}
                                            {!notif.lu && (
                                                <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                                    Nouveau
                                                </span>
                                            )}
                                        </h3>
                                        <span className="text-xs text-gray-400">
                                            {new Date(notif.date).toLocaleDateString('fr-FR', {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>

                                    <p className="text-gray-600 text-sm mb-2">{notif.description}</p>

                                    {/* Métadonnées */}
                                    <div className="flex items-center gap-4 text-xs">
                                        <span className="text-gray-400 capitalize">
                                            {notif.type} • {notif.sous_type}
                                        </span>
                                        {notif.lien && (
                                            <a
                                                href={notif.lien}
                                                className="text-blue-600 hover:text-blue-800">
                                                Voir les détails →
                                            </a>
                                        )}
                                    </div>

                                    {/* Données supplémentaires */}
                                    {notif.data && (
                                        <div className="mt-2 text-xs bg-gray-50 p-2 rounded">
                                            {Object.entries(notif.data).map(([key, value]) => (
                                                <span key={key} className="mr-3">
                                                    <span className="text-gray-500">{key}:</span>{' '}
                                                    <span className="font-medium">{value}</span>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-1">
                                    {!notif.lu && (
                                        <button
                                            onClick={() => handleMarkAsRead(notif.id)}
                                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                                            title="Marquer comme lu">
                                            <Done fontSize="small" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(notif.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                        title="Supprimer">
                                        <Delete fontSize="small" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-lg shadow-md">
                    <Notifications className="text-gray-400 text-6xl mx-auto mb-4" />
                    <h3 className="text-xl text-gray-600 font-medium mb-2">Aucune notification</h3>
                    <p className="text-gray-500">
                        {filter !== 'all'
                            ? 'Aucune notification ne correspond à vos filtres'
                            : 'Vous n\'avez aucune notification pour le moment'}
                    </p>
                </div>
            )}

            {/* Résumé */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4 text-sm text-gray-500">
                <div className="flex justify-between items-center">
                    <span>Total: {notifications.length} notification{notifications.length > 1 ? 's' : ''}</span>
                    <span>Non lues: {unreadCount}</span>
                    <span>Alertes: {notifications.filter(n => n.type === 'alerte').length}</span>
                    <span>Rappels: {notifications.filter(n => n.type === 'rappel').length}</span>
                    <button
                        onClick={() => window.location.reload()}
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                        <Refresh fontSize="small" /> Actualiser
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotificationsList;