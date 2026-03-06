import React from "react";

const CriticalPathIndicator = ({ criticalPath, phases, scale }) => (
    <>
        {criticalPath.map((id) => {
            const phase = phases.find((p) => p.id === id);
            if (!phase) return null;

            return (
                <div
                    key={`${id}-crit`}
                    className="absolute border-t-4 border-red-600 opacity-70"
                    style={{
                        left: getPositionX(phase.date_debut, scale),
                        width: getPhaseWidth(phase, scale),
                        top: phases.indexOf(phase) * 60 + 20,
                    }}
                />
            );
        })}
    </>
);

export default CriticalPathIndicator;