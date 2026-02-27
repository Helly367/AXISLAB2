import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Flag } from "@mui/icons-material";

const GanttDiagram = ({ phases, dependencies, milestones, onPhaseClick }) => {
    const [scale, setScale] = useState(1); // 1px = 1 jour
    const [offset, setOffset] = useState(0);
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    // Trouver la date min et max
    const dates = phases.flatMap(p => [new Date(p.date_debut), new Date(p.date_fin)]);
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));
    const totalDays = Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)) + 30; // +30 jours de marge

    useEffect(() => {
        if (containerRef.current) {
            setContainerWidth(containerRef.current.offsetWidth);
        }
    }, []);

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' });
    };

    const getPositionX = (dateStr) => {
        const date = new Date(dateStr);
        const diffDays = Math.ceil((date - minDate) / (1000 * 60 * 60 * 24));
        return diffDays * scale * 10; // 10px par jour à l'échelle 1
    };

    const getWidth = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
        return diffDays * scale * 10;
    };

    const handleZoomIn = () => {
        setScale(prev => Math.min(prev + 0.2, 3));
    };

    const handleZoomOut = () => {
        setScale(prev => Math.max(prev - 0.2, 0.5));
    };

    const handleScroll = (direction) => {
        setOffset(prev => prev + (direction * 100));
    };

    // Générer les mois pour l'échelle
    const generateMonths = () => {
        const months = [];
        let currentDate = new Date(minDate);
        while (currentDate <= maxDate) {
            months.push(new Date(currentDate));
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        return months;
    };

    const months = generateMonths();

    return (
        <div className="bg-white rounded-lg shadow-md p-6  ">

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">Diagramme de Gantt</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => handleScroll(-1)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <ChevronLeft />
                    </button>
                    <button
                        onClick={handleZoomOut}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <ZoomOut />
                    </button>
                    <span className="px-3 py-2 bg-gray-100 rounded-lg">
                        {Math.round(scale * 100)}%
                    </span>
                    <button
                        onClick={handleZoomIn}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <ZoomIn />
                    </button>
                    <button
                        onClick={() => handleScroll(1)}
                        className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                        <ChevronRight />
                    </button>
                </div>
            </div>

            <div
                ref={containerRef}
                className="overflow-x-auto border border-gray-200 rounded-lg h-100"
                style={{ maxWidth: '100%' }}>
                <div style={{ minWidth: totalDays * scale * 10, position: 'relative' }}>

                    {/* Échelle des mois */}
                    <div className="flex border-b border-gray-300 bg-gray-50 sticky top-0" style={{ height: 40 }}>
                        {months.map((month, index) => {
                            const position = getPositionX(month.toISOString().split('T')[0]);
                            const nextMonth = new Date(month);
                            nextMonth.setMonth(month.getMonth() + 1);
                            const width = getPositionX(nextMonth.toISOString().split('T')[0]) - position;
                            return (
                                <div
                                    key={index}
                                    className="absolute border-r border-gray-300 flex items-center justify-center text-sm font-medium text-gray-600"
                                    style={{
                                        left: position,
                                        width: width,
                                        height: 40
                                    }}>
                                    {month.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
                                </div>
                            );
                        })}
                    </div>

                    {/* Lignes des phases */}
                    <div className="relative" style={{ marginTop: 20 }}>
                        {phases.map((phase, index) => {
                            const left = getPositionX(phase.date_debut);
                            const width = getWidth(phase.date_debut, phase.date_fin);
                            const top = index * 60;

                            // Trouver les dépendances entrantes
                            const incomingDeps = dependencies.filter(d => d.to === phase.id);
                            // Trouver les dépendances sortantes
                            const outgoingDeps = dependencies.filter(d => d.from === phase.id);

                            return (
                                <div key={phase.id} style={{ position: 'absolute', top, left, width }}>
                                    {/* Barre de la phase */}
                                    <div
                                        onClick={() => onPhaseClick(phase.id)}
                                        className="absolute cursor-pointer rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                        style={{
                                            backgroundColor: phase.couleur,
                                            width: '100%',
                                            height: 40,
                                            opacity: 0.9
                                        }}>
                                        <div className="px-3 py-2 text-white text-sm font-medium truncate">
                                            {phase.title} ({formatDate(phase.date_debut)} - {formatDate(phase.date_fin)})
                                        </div>
                                        {/* Barre de progression */}
                                        <div
                                            className="absolute bottom-0 left-0 h-1 bg-white bg-opacity-50"
                                            style={{ width: `${phase.progression}%` }} />
                                    </div>

                                    {/* Flèches de dépendances */}
                                    {outgoingDeps.map(dep => {
                                        const targetPhase = phases.find(p => p.id === dep.to);
                                        if (!targetPhase) return null;
                                        const targetLeft = getPositionX(targetPhase.date_debut);
                                        return (
                                            <svg
                                                key={`${phase.id}-${targetPhase.id}`}
                                                className="absolute pointer-events-none"
                                                style={{
                                                    left: width,
                                                    top: 20,
                                                    width: targetLeft - left - width,
                                                    height: 40
                                                }}>
                                                <defs>
                                                    <marker
                                                        id="arrowhead"
                                                        markerWidth="10"
                                                        markerHeight="10"
                                                        refX="9"
                                                        refY="5"
                                                        orient="auto">
                                                        <polygon points="0 0, 10 5, 0 10" fill="#666" />
                                                    </marker>
                                                </defs>
                                                <line
                                                    x1="0"
                                                    y1="20"
                                                    x2={targetLeft - left - width - 5}
                                                    y2="20"
                                                    stroke="#666"
                                                    strokeWidth="2"
                                                    strokeDasharray="5,5"
                                                    markerEnd="url(#arrowhead)"
                                                />
                                            </svg>
                                        );
                                    })}
                                </div>
                            );
                        })}

                        {/* Jalons */}
                        {milestones.map((milestone) => {
                            const left = getPositionX(milestone.date);
                            const phase = phases.find(p => p.id === milestone.phaseId);
                            const top = phases.findIndex(p => p.id === milestone.phaseId) * 60 + 20;

                            return (
                                <div
                                    key={milestone.id}
                                    className="absolute flex items-center gap-1 cursor-help group"
                                    style={{ left: left - 10, top: top - 15, zIndex: 20 }}>
                                    <Flag
                                        className="text-red-500"
                                        style={{ fontSize: 20 }}
                                    />
                                    <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-30">
                                        <p className="font-bold">{milestone.title}</p>
                                        <p>{new Date(milestone.date).toLocaleDateString('fr-FR')}</p>
                                        <p className="text-gray-300">{milestone.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Légende */}
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium text-gray-700 mb-2">Légende</h3>
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                <span className="text-sm">Phase</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-0.5 bg-gray-600 border-t-2 border-dashed"></div>
                                <span className="text-sm">Dépendance</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Flag className="text-red-500" style={{ fontSize: 16 }} />
                                <span className="text-sm">Jalon</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-1 bg-white border border-gray-300"></div>
                                <span className="text-sm">Progression</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GanttDiagram;