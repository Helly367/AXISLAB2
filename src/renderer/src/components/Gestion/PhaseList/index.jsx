import React from 'react';
import { Code, CalendarToday } from "@mui/icons-material";

const PhaseList = ({ phases, onViewPhase }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phases.map((phase) => (
                <div key={phase.id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col h-full">

                    <div className="bg-primary text-white p-3 rounded-lg w-fit mb-4">
                        <Code />
                    </div>

                    <h3 className="text-2xl text-blue font-bold mb-3">{phase.title}</h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                        {phase.description_phase}
                    </p>

                    <div className="flex flex-col gap-2 mb-4">
                        <div className="flex items-center gap-2">
                            <CalendarToday className="text-green-500 text-sm" />
                            <span className="font-medium">Début:</span>
                            <span className="text-green-600">{phase.date_debut}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarToday className="text-red-500 text-sm" />
                            <span className="font-medium">Fin:</span>
                            <span className="text-red-600">{phase.date_fin}</span>
                        </div>
                    </div>

                    <div className="mt-auto">
                        <button
                            onClick={() => onViewPhase(phase.id)}
                            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Voir la phase
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PhaseList;