import React, { useMemo } from "react";

const getPositionX = (dateStr, minDate, scale) => {
    const date = new Date(dateStr);
    const diffDays = Math.ceil((date - minDate) / (1000 * 60 * 60 * 24));
    return diffDays * scale * 10;
};

const DependencyArrow = ({ from, to, phases = [], scale = 1 }) => {

    const { minDate } = useMemo(() => {
        if (!phases.length) return { minDate: new Date() };

        const dates = phases.flatMap(p =>
            [new Date(p.date_debut), new Date(p.date_fin)]
        );

        return {
            minDate: new Date(Math.min(...dates))
        };

    }, [phases]);

    const fromPhase = phases.find(p => p.id === from);
    const toPhase = phases.find(p => p.id === to);

    if (!fromPhase || !toPhase) return null;

    const fromLeft = getPositionX(fromPhase.date_fin, minDate, scale);
    const toLeft = getPositionX(toPhase.date_debut, minDate, scale);

    const fromIndex = phases.findIndex(p => p.id === from);
    const toIndex = phases.findIndex(p => p.id === to);

    if (fromIndex === -1 || toIndex === -1) return null;

    const y = fromIndex * 60 + 20;

    const width = Math.max(toLeft - fromLeft, 30);

    return (
        <svg
            className="absolute pointer-events-none overflow-visible z-10"
            style={{
                left: fromLeft,
                top: y,
                width: width,
                height: 40
            }}
        >
            <defs>
                <marker
                    id="arrowhead"
                    markerWidth="8"
                    markerHeight="8"
                    refX="6"
                    refY="4"
                    orient="auto"
                >
                    <polygon points="0 0, 8 4, 0 8" fill="#6B7280" />
                </marker>
            </defs>

            <line
                x1="0"
                y1="20"
                x2={width - 5}
                y2="20"
                stroke="#6B7280"
                strokeWidth="2"
                strokeDasharray="5,5"
                markerEnd="url(#arrowhead)"
            />
        </svg>
    );
};

export default DependencyArrow;