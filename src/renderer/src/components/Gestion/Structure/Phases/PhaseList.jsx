import React, { useMemo } from 'react';
import { Code, CalendarToday, AttachMoney } from "@mui/icons-material";
import { mettreEnMajuscule, formatMontant, limiteTexte } from "../../../../Services/functions";

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
};

const PhaseList = ({ phases = [], onViewPhase }) => {

    const safePhases = useMemo(() => phases || [], [phases]);

    if (!safePhases.length) {
        return (

            <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <p className="text-gray-500 text-lg font-medium">
                    Aucune phase disponible pour le moment
                </p>
                <p className="text-sm text-gray-400 mt-2">
                    « Découpez votre projet en plusieurs phases pour mieux le structurer et le gérer efficacement. »
                </p>


            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {safePhases.map((phase) => (
                <div
                    key={phase.phase_id}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 flex flex-col h-full"
                >

                    <div className="bg-primary text-white p-3 rounded-lg w-fit mb-4">
                        <Code />
                    </div>

                    <h3 className="text-xl text-blue font-bold mb-3">
                        {limiteTexte(mettreEnMajuscule(phase.title), 30) || "Sans titre"}
                    </h3>

                    <p className="text-gray-600 mb-4 line-clamp-3">
                        {limiteTexte(phase.description_phase, 150) || "Pas de description"}
                    </p>

                    <div className="flex flex-col gap-2 mb-4 text-sm">

                        <div className="flex items-center gap-2">
                            <CalendarToday className="text-green-500 text-sm" />
                            <span className="font-medium">Début:</span>
                            <span className="text-green-600">
                                {formatDate(phase.date_debut)}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <CalendarToday className="text-red-500 text-sm" />
                            <span className="font-medium">Fin:</span>
                            <span className="text-red-600">
                                {formatDate(phase.date_fin)}
                            </span>
                        </div>


                        <div className="flex items-center gap-2">
                            <AttachMoney className="text-orange-600 text-sm" />
                            <span className="font-medium">Budget :</span>
                            <span className="text-orange-600 font-bold">
                                {formatMontant(phase.budget_phase)}
                            </span>
                        </div>

                    </div>

                    <div className="mt-auto">
                        <button
                            onClick={() => onViewPhase?.(phase.phase_id)}
                            className="w-full bg-primary text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                            Voir la phase
                        </button>
                    </div>

                </div>
            ))}

        </div>
    );
};

export default PhaseList;