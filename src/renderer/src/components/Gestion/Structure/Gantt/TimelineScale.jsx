import React, { useMemo } from "react";

const getPositionX = (dateStr, minDate, scale) => {
    const date = new Date(dateStr);
    const diffDays = Math.ceil((date - minDate) / (1000 * 60 * 60 * 24));
    return diffDays * scale * 10;
};

const TimelineScale = ({ phases = [], scale = 1 }) => {

    const { months, minDate, maxDate } = useMemo(() => {

        if (!phases.length) {
            return { months: [], minDate: new Date(), maxDate: new Date() };
        }

        const dates = phases.flatMap(p =>
            [new Date(p.date_debut), new Date(p.date_fin)]
        );

        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));

        const months = [];

        let current = new Date(minDate);

        while (current <= maxDate) {
            months.push(new Date(current));
            current.setMonth(current.getMonth() + 1);
        }

        return { months, minDate, maxDate };

    }, [phases]);

    if (!phases.length) return null;

    return (
        <div className="relative border-b border-gray-300 bg-gray-50 h-10">

            {months.map((month, index) => {

                const position = getPositionX(
                    month.toISOString().split("T")[0],
                    new Date(Math.min(...phases.map(p => new Date(p.date_debut)))),
                    scale
                );

                const nextMonth = new Date(month);
                nextMonth.setMonth(month.getMonth() + 1);

                const width = Math.max(
                    getPositionX(
                        nextMonth.toISOString().split("T")[0],
                        new Date(Math.min(...phases.map(p => new Date(p.date_debut)))),
                        scale
                    ) - position,
                    40
                );

                return (
                    <div
                        key={index}
                        className="absolute border-r border-gray-300 flex items-center justify-center text-xs text-gray-600"
                        style={{
                            left: position,
                            width,
                            height: 40
                        }}
                    >
                        {month.toLocaleDateString("fr-FR", {
                            month: "short",
                            year: "numeric"
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default TimelineScale;