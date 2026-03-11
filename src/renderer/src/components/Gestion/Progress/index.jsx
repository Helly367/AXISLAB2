import React, { useMemo } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    Filler
} from "chart.js";

import { Chart } from "react-chartjs-2";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend,
    Filler
);

const ProjectDashboardChart = ({ phases = [] }) => {

    const chartData = useMemo(() => {

        const labels = phases.map(p => p.title || "Sans titre");

        return {
            labels,

            datasets: [
                {
                    type: "bar",
                    label: "Budget prévu",
                    data: phases.map(p => p.budget_prevu || 0),
                    borderRadius: 6,
                    backgroundColor: "rgba(59, 130, 246, 0.5)"
                },

                {
                    type: "bar",
                    label: "Budget consommé",
                    data: phases.map(p => p.budget_consomme || 0),
                    borderRadius: 6,
                    backgroundColor: "rgba(239, 68, 68, 0.5)"
                },

                {
                    type: "line",
                    label: "Progression projet (%)",
                    data: phases.map(p => p.progression || 0),
                    borderColor: "#10b981",
                    backgroundColor: "rgba(16, 185, 129, 0.2)",
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5
                }
            ]
        };

    }, [phases]);

    const options = useMemo(() => ({
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                position: "top"
            },

            tooltip: {
                mode: "index",
                intersect: false
            }
        },

        scales: {
            y: {
                beginAtZero: true,
                max: 100
            }
        }
    }), []);

    return (
        <div className="min-h-screen bg-gray-200 px-4 ">
            <div className="max-w-8xl mx-auto flex flex-col items-center py-2 pb-4">

                <div className="w-full  bg-primary shadow-sm rounded-lg p-4 flex justify-between items-center">
                    <h2 className="text-xl text-white font-bold">
                        Dashboard d'avancement du projet
                    </h2>
                </div>



                <div className=" w-full h-[500px] bg-white rounded-lg shadow-md p-4 mt-6">
                    <Chart
                        type="bar"
                        data={chartData}
                        options={options}
                    />
                </div>

            </div>

        </div>
    );
};

export default ProjectDashboardChart;