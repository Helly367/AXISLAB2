import React, { useMemo } from "react";

const getPositionX = (dateStr, minDate, scale) => {
    const date = new Date(dateStr);
    const diffDays = Math.ceil((date - minDate) / (1000 * 60 * 60 * 24));
    return diffDays * scale * 10;
};

const MilestoneMarker = ({ milestone, phases = [], scale = 1 }) => {

    const { minDate } = useMemo(() => {
        if (!phases.length) return { minDate: new Date() };

        const dates = phases.flatMap(p =>
            [new Date(p.date_debut), new Date(p.date_fin)]
        );

        return {
            minDate: new Date(Math.min(...dates))
        };

    }, [phases]);

    if (!milestone) return null;

    const phaseIndex = phases.findIndex(
        p => p.id === milestone.phaseId
    );

    if (phaseIndex === -1) return null;

    const left = getPositionX(
        milestone.date,
        minDate,
        scale
    );

    const top = phaseIndex * 60 + 20;

    return (
        <div
            className="absolute flex items-center gap-1 cursor-help group z-20"
            style={{
                left: left - 10,
                top: top - 15
            }}
        >
            <span className="text-red-500 text-sm">⚑</span>

            <div className="hidden group-hover:block absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-30">
                <p className="font-bold">{milestone.title}</p>
                <p>
                    {new Date(milestone.date).toLocaleDateString("fr-FR")}
                </p>
                <p className="text-gray-300">
                    {milestone.description}
                </p>
            </div>
        </div>
    );
};

export default MilestoneMarker;