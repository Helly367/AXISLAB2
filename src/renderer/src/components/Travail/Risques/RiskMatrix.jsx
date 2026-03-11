import React from 'react';
import { Warning } from "@mui/icons-material";

const RiskMatrix = ({ risks }) => {
    // Grille 5x5
    const matrixSize = 5;
    const matrix = Array.from({ length: matrixSize }, (_, row) =>
        Array.from({ length: matrixSize }, (_, col) => ({ row, col }))
    );

    // Position du risque
    const getRiskPosition = (prob, impact) => ({
        probIndex: Math.min(matrixSize - 1, Math.floor(prob * matrixSize)),
        impactIndex: Math.min(matrixSize - 1, Math.floor(impact * matrixSize)),
    });

    // Couleur et label selon score réel
    const getCellColorAndLabel = (probIndex, impactIndex) => {
        const score = (probIndex + 0.5) / matrixSize * (impactIndex + 0.5) / matrixSize;
        if (score >= 0.5) return { color: 'bg-red-500', label: 'Critique' };
        if (score >= 0.25) return { color: 'bg-orange-500', label: 'Élevé' };
        if (score >= 0.1) return { color: 'bg-yellow-500', label: 'Moyen' };
        return { color: 'bg-green-500', label: 'Faible' };
    };

    // Position des risques
    const riskPositions = risks.map(risk => {
        const { probIndex, impactIndex } = getRiskPosition(risk.probabilite, risk.impact);
        return { ...risk, probIndex, impactIndex };
    });

    const impactLabels = ['Très faible', 'Faible', 'Moyen', 'Élevé', 'Très élevé'];
    const probLabels = ['Très faible', 'Faible', 'Moyen', 'Élevé', 'Très élevé'];

    return (
        <div className="bg-white rounded-lg shadow-md p-6 overflow-x-auto">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Warning className="text-red-600" /> Matrice Probabilité x Impact
            </h2>

            <div className="min-w-[600px]">
                {/* En-tête impact */}
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
                            {impactLabels.map((label, idx) => (
                                <div key={idx} className="flex-1 text-center text-xs">{label}</div>
                            ))}
                        </div>

                        {/* Matrice */}
                        {matrix.map((row, probIndex) => (
                            <div key={probIndex} className="flex mb-1">
                                {/* Label probabilité */}
                                <div className="w-24 flex items-center justify-end pr-4 text-xs">
                                    {probLabels[probIndex]}
                                </div>

                                {row.map((cell, impactIndex) => {
                                    const risksInCell = riskPositions.filter(
                                        r => r.probIndex === probIndex && r.impactIndex === impactIndex
                                    );
                                    const { color, label } = getCellColorAndLabel(probIndex, impactIndex);

                                    return (
                                        <div
                                            key={impactIndex}
                                            className={`flex-1 h-20 ${color} rounded-lg m-1 relative group cursor-pointer transition-transform hover:scale-105`}>

                                            {/* Label du niveau */}
                                            <div className="absolute top-1 left-1 text-white text-xs font-medium opacity-75">
                                                {label}
                                            </div>

                                            {/* Risques */}
                                            {risksInCell.length > 0 && (
                                                <div className="absolute bottom-1 right-1 bg-white bg-opacity-90 rounded-full px-2 py-1 text-xs font-bold">
                                                    {risksInCell.length}
                                                </div>
                                            )}

                                            {/* Tooltip */}
                                            {risksInCell.length > 0 && (
                                                <div className="absolute hidden group-hover:block bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-10">
                                                    {risksInCell.map(r => (
                                                        <div key={r.id} className="mb-1 last:mb-0">• {r.nom}</div>
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
    );
};

export default RiskMatrix;