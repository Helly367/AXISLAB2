import React, { useState, useRef, useMemo, useCallback } from "react";
import TimelineScale from "./TimelineScale";
import PhaseBar from "./PhaseBar";
import MilestoneMarker from "./MilestoneMarker";
import DependencyArrow from "./DependencyArrow";
import CriticalPathIndicator from "./CriticalPathIndicator";
import { calculateCriticalPath, detectConflicts } from "../../../../functions/math";
import useResponsiveGantt from "../../../../hooks/useResponsiveGantt";
import { usePhases } from "../../../../hooks/usePhase";


const EnterpriseGantt = ({ dependencies = [], milestones = [], onPhaseClick }) => {

    const { phases } = usePhases();

    const containerRef = useRef(null);
    const [scale, setScale] = useResponsiveGantt(containerRef);

    const safePhases = useMemo(() => phases || [], [phases]);

    const sortedPhases = useMemo(() => {
        return safePhases.slice().sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut));
    }, [safePhases]);

    const criticalPath = useMemo(() => calculateCriticalPath(sortedPhases, dependencies), [
        sortedPhases,
        dependencies,
    ]);

    const conflicts = useMemo(() => detectConflicts(sortedPhases), [sortedPhases]);

    return (
        <div
            ref={containerRef}
            className="bg-white p-6 rounded-lg shadow-md overflow-auto w-full h-[650px]"
        >
            {/* Timeline scale */}
            <TimelineScale scale={scale} phases={sortedPhases} />

            {/* Phase Bars */}
            <div className="relative  mt-4">
                {sortedPhases.map((phase, index) => (
                    <PhaseBar
                        key={phase.phase_id}
                        phase={phase}
                        index={index}
                        scale={scale}
                        isCritical={criticalPath.includes(phase.phase_id)}
                        conflicts={conflicts}
                        onPhaseClick={onPhaseClick}
                    />
                ))}

                {/* Dependencies */}
                {dependencies.map((dep) => (
                    <DependencyArrow
                        key={`${dep.from}-${dep.to}`}
                        from={dep.from}
                        to={dep.to}
                        phases={sortedPhases}
                        scale={scale}
                    />
                ))}

                {/* Milestones */}
                {milestones.map((ms) => (
                    <MilestoneMarker
                        key={ms.id}
                        milestone={ms}
                        phases={sortedPhases}
                        scale={scale}
                    />
                ))}

                {/* Critical Path */}
                <CriticalPathIndicator
                    criticalPath={criticalPath}
                    phases={sortedPhases}
                    scale={scale}
                />
            </div>
        </div>
    );
};

export default EnterpriseGantt;