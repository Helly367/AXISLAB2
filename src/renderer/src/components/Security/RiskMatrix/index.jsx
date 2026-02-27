import React from 'react';
import { Warning, Info } from "@mui/icons-material";

const RiskMatrix = ({ risks }) => {
    // Niveaux: 0-0.2, 0.2-0.4, 0.4-0.6, 0.6-0.8, 0.8-1
    const matrix = [
        [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }, { row: 0, col: 3 }, { row: 0, col: 4 }],
        [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }, { row: 1, col: 3 }, { row: 1, col: 4 }],
        [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }, { row: 2, col: 3 }, { row: 2, col: 4 }],
        [{ row: 3, col: 0 }, { row: 3, col: 1 }, { row: 3, col: 2 }, { row: 3, col: 3 }, { row: 3, col: 4 }],
        [{ row: 4, col: 0 }, { row: 4, col: 1 }, { row: 4, col: 2 }, { row: 4, col: 3 }, { row: 4, col: 4 }]
    ];

    const getRiskPosition = (probabilite, impact) => {
        const probIndex = Math.min(4, Math.floor(probabilite * 5));
        const impactIndex = Math.min(4, Math.floor(impact * 5));
        return { probIndex, impactIndex };
    };

    const getCellColor = (probIndex, impactIndex) => {
        const score = (probIndex / 4) * (impactIndex / 4);
        if (score >= 0.5) return 'bg-red-500';
        if (score >= 0.25) return 'bg-orange-500';
        if (score >= 0.1) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    const getCellLabel = (probIndex, impactIndex) => {
        const score = (probIndex / 4) * (impactIndex / 4);
        if (score >= 0.5) return 'Critique';
        if (score >= 0.25) return 'Élevé';
        if (score >= 0.1) return 'Moyen';
        return 'Faible';
    };

    // Positionner les risques dans la matrice
    const riskPositions = risks.map(risk => {
        const { probIndex, impactIndex } = getRiskPosition(risk.probabilite, risk.impact);
        return {
            ...risk,
            probIndex,
            impactIndex
        };
    });

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Warning className="text-red-600" />
                Matrice Probabilité x Impact
            </h2>

            <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                    {/* En-tête (Impact) */}
                    <div className="flex mb-2">
                        <div className="w-24"></div>
                        <div className="flex-1 text-center text-sm font-medium text-gray-600">Impact</div>
                    </div>
                    <div className="flex">
                        <div className="w-24 flex items-center justify-center text-sm font-medium text-gray-600 rotate-[-90deg] whitespace-nowrap origin-center">
                            Probabilité
                        </div>
                        <div className="flex-1">
                            {/* Labels d'impact */}
                            <div className="flex mb-2">
                                <div className="flex-1 text-center text-xs">Très faible</div>
                                <div className="flex-1 text-center text-xs">Faible</div>
                                <div className="flex-1 text-center text-xs">Moyen</div>
                                <div className="flex-1 text-center text-xs">Élevé</div>
                                <div className="flex-1 text-center text-xs">Très élevé</div>
                            </div>

                            {/* Matrice */}
                            {matrix.map((row, probIndex) => (
                                <div key={probIndex} className="flex mb-1">
                                    {/* Label de probabilité */}
                                    <div className="w-24 flex items-center justify-end pr-4 text-xs">
                                        {probIndex === 0 && 'Très faible'}
                                        {probIndex === 1 && 'Faible'}
                                        {probIndex === 2 && 'Moyen'}
                                        {probIndex === 3 && 'Élevé'}
                                        {probIndex === 4 && 'Très élevé'}
                                    </div>

                                    {/* Cellules */}
                                    {row.map((cell, impactIndex) => {
                                        const risksInCell = riskPositions.filter(
                                            r => r.probIndex === probIndex && r.impactIndex === impactIndex
                                        );
                                        const cellColor = getCellColor(probIndex, impactIndex);
                                        const cellLabel = getCellLabel(probIndex, impactIndex);

                                        return (
                                            <div
                                                key={impactIndex}
                                                className={`flex-1 h-20 ${cellColor} rounded-lg m-1 relative group cursor-pointer transition-transform hover:scale-105`}>

                                                {/* Label du niveau */}
                                                <div className="absolute top-1 left-1 text-white text-xs font-medium opacity-75">
                                                    {cellLabel}
                                                </div>

                                                {/* Risques dans la cellule */}
                                                {risksInCell.length > 0 && (
                                                    <div className="absolute bottom-1 right-1 bg-white bg-opacity-90 rounded-full px-2 py-1 text-xs font-bold">
                                                        {risksInCell.length}
                                                    </div>
                                                )}

                                                {/* Tooltip avec détails */}
                                                {risksInCell.length > 0 && (
                                                    <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-10">
                                                        {risksInCell.map(risk => (
                                                            <div key={risk.id} className="mb-1 last:mb-0">
                                                                • {risk.nom}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Légende */}
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-700 mb-3">Légende</h3>
                        <div className="grid grid-cols-4 gap-4">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-green-500 rounded"></div>
                                <span className="text-sm">Faible (0-10%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                                <span className="text-sm">Moyen (10-25%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-orange-500 rounded"></div>
                                <span className="text-sm">Élevé (25-50%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-red-500 rounded"></div>
                                <span className="text-sm">Critique (50%+)</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RiskMatrix;