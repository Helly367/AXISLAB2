import React from "react";
import { motion } from "framer-motion";
import { getPhaseWidth, getPositionX } from "../../../../functions/layout";

const PhaseBar = ({ phase, index, scale, isCritical, conflicts = [], onPhaseClick }) => {

    const left = getPositionX(phase.date_debut, scale);
    const width = getPhaseWidth(phase, scale);

    const conflict = conflicts.includes(phase.id);

    return (
        <motion.div
            className={`
        absolute cursor-pointer rounded-lg shadow-md 
        ${isCritical ? "bg-red-600" : "bg-primary "}
        ${conflict ? "border-2 border-yellow-500" : ""}
      `}
            style={{
                left,
                width,
                height: 40,
                top: index * 60
            }}
            whileHover={{ scale: 1.02 }}
            drag="x"
            dragMomentum={false}
            onClick={() => onPhaseClick(phase.phase_id)}
        >
            <div className="text-white px-3 text-[14px] font-bold truncate">
                {phase.title}
            </div>
        </motion.div>
    );
};

export default PhaseBar;