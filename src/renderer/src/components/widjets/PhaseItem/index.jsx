import React from 'react';
import { ArrowBack, Person, CalendarToday, Edit } from "@mui/icons-material";

const PhaseItem = ({ phases, phaseId, onBack }) => {
    const phase = phases.find(p => p.id === phaseId);

    if (!phase) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">Phase non trouvée</p>
                <button onClick={onBack} className="text-blue mt-4">Retour</button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-8">
            {/* Header avec retour */}
            <div className="flex items-center gap-4 pb-6 border-b-2 border-gray-200 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ArrowBack />
                </button>
                <h2 className="text-3xl font-bold text-gray-800">{phase.title}</h2>
            </div>

            {/* Description */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                    {phase.description_phase}
                </p>
            </div>

            {/* Tâches */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Tâches</h3>
                <ul className="space-y-2">
                    {phase.taches.map((tache, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <span className="text-blue font-bold">•</span>
                            <span className="text-gray-700">{tache}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Membres */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Membres ({phase.membres.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {phase.membres.map((membre, index) => (
                        <div key={index}
                            className="bg-gray-50 rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow">
                            <div className="bg-blue text-white p-3 rounded-full mb-2">
                                <Person />
                            </div>
                            <span className="text-sm font-medium text-gray-800">{membre}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dates et actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t-2 border-gray-200">
                <div className="flex gap-6">
                    <div className="flex items-center gap-2">
                        <CalendarToday className="text-green-500" />
                        <span className="font-medium">Début:</span>
                        <span className="text-gray-600">{phase.date_debut}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CalendarToday className="text-red-500" />
                        <span className="font-medium">Fin:</span>
                        <span className="text-gray-600">{phase.date_fin}</span>
                    </div>
                </div>

                <button className="bg-blue text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Edit /> Modifier
                </button>
            </div>
        </div>
    );
};

export default PhaseItem;