import React, { useMemo } from 'react';
import { ArrowBack, Person, CalendarToday, Edit } from "@mui/icons-material";
import { useParams } from 'react-router-dom';

const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
};

const generateRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
};


const generateNiceColor = () => {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 70%, 60%)`;
};



const PhaseItem = ({ phases = [], onBack, onEdit }) => {
    const { phase_id } = useParams();

    const phase = useMemo(
        () => phases.find(p => p.phase_id === Number(phase_id)),
        [phases, phase_id]
    );


    if (!phase) {
        return (
            <div className="text-center py-10">
                <p className="text-red-500">Phase non trouvée</p>
                <button
                    onClick={onBack}
                    className="text-blue mt-4 font-medium"
                >
                    Retour
                </button>
            </div>
        );
    }

    const tasks = phase.taches || [];
    const members = phase.membres || [];


    const color = useMemo(() => generateNiceColor(), []);


    return (
        <div className="bg-white rounded-lg shadow-md p-8">

            {/* Header */}
            <div className="flex items-center gap-4 pb-6 border-b-2 border-gray-200 mb-6">
                <button
                    onClick={onBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                    <ArrowBack />
                </button>

                <h2 className="text-3xl font-bold text-gray-800">
                    {phase.title || "Sans titre"}
                </h2>
            </div>

            {/* Description */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                    Description
                </h3>

                <p className="text-gray-600 leading-relaxed">
                    {phase.description_phase || "Pas de description"}
                </p>
            </div>

            {/* Tâches */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Tâches
                </h3>

                <ul className="space-y-2">
                    {tasks.map((tache, index) => (
                        <li key={index} className="flex items-start gap-2">
                            <span className="text-blue font-bold">•</span>
                            <span className="text-gray-700">
                                {tache}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Membres */}
            <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                    Membres ({members.length})
                </h3>

                <div className="flex items-center gap-6">
                    {members.map((membre, index) => (
                        <div
                            key={index}
                            style={{ backgroundColor: color }}
                            className={`rounded-lg p-4 flex flex-col items-center text-center hover:shadow-md transition-shadow w-[15%]`}
                        >
                            <div className="bg-blue bg-white p-3 rounded-full mb-2">
                                <Person className='text-primary' />
                            </div>

                            <span className="text-sm font-medium text-white">
                                {membre}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dates + Actions */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t-2 border-gray-200">

                <div className="flex gap-6 flex-wrap">

                    <div className="flex items-center gap-2">
                        <CalendarToday className="text-green-500" />
                        <span className="font-medium">Début:</span>
                        <span className="text-gray-600">
                            {formatDate(phase.date_debut)}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <CalendarToday className="text-red-500" />
                        <span className="font-medium">Fin:</span>
                        <span className="text-gray-600">
                            {formatDate(phase.date_fin)}
                        </span>
                    </div>

                </div>

                <button
                    onClick={() => onEdit(phase)}
                    className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Edit /> Modifier
                </button>
            </div>
        </div>
    );
};

export default PhaseItem;