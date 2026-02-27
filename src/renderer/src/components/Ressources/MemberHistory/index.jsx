import React from 'react';
import { Close, History, Work, CalendarToday } from "@mui/icons-material";

const MemberHistory = ({ isOpen, onClose, member }) => {
    if (!isOpen || !member) return null;

    return (
        <div className="fixed inset-0  bg-opacity flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-purple-600 to-purple-800 p-4 flex justify-between items-center">
                    <h2 className="text-xl text-white font-bold flex items-center gap-2">
                        <History />
                        Historique des affectations - {member.nom}
                    </h2>
                    <button onClick={onClose} className="text-white hover:bg-purple-700 p-1 rounded-full">
                        <Close />
                    </button>
                </div>

                {/* Contenu */}
                <div className="p-6">
                    {/* Informations du membre */}
                    <div className="bg-purple-50 rounded-lg p-4 mb-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Poste actuel</p>
                                <p className="font-medium text-gray-800">{member.poste}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Rôle</p>
                                <p className="font-medium text-gray-800">{member.role}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Membre depuis</p>
                                <p className="font-medium text-gray-800">
                                    {new Date(member.dateDebut).toLocaleDateString('fr-FR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total affectations</p>
                                <p className="font-medium text-gray-800">{member.historique?.length || 0}</p>
                            </div>
                        </div>
                    </div>

                    {/* Timeline des affectations */}
                    <h3 className="font-medium text-gray-700 mb-4">Historique des phases</h3>

                    {member.historique && member.historique.length > 0 ? (
                        <div className="space-y-4">
                            {member.historique.map((item, index) => (
                                <div key={index} className="relative pl-8 pb-4 border-l-2 border-purple-200 last:pb-0">
                                    {/* Point sur la timeline */}
                                    <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-purple-600"></div>

                                    {/* Contenu */}
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className="font-bold text-gray-800">{item.phase}</h4>
                                            <span className="text-sm text-gray-500">{item.periode}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Work fontSize="small" className="text-purple-600" />
                                            <span>Rôle: {item.role}</span>
                                        </div>
                                        {item.description && (
                                            <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                            <History className="text-gray-400 text-4xl mb-2" />
                            <p className="text-gray-500">Aucun historique d'affectation</p>
                            <p className="text-sm text-gray-400 mt-1">
                                Ce membre n'a pas encore été affecté à des phases
                            </p>
                        </div>
                    )}

                    {/* Bouton fermer */}
                    <div className="flex justify-end mt-6">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MemberHistory;