import React, { useMemo, useState } from 'react';
import { ArrowBack, Person, CalendarToday, Edit, Delete } from "@mui/icons-material";
import { useParams } from 'react-router-dom';
import DeleteConfirm from '../../../widjets/DeleteConfirm';
import { usePhases } from '../../../../hooks/usePhase';
import { formateMontantSimple } from '../../../../Services/functions';
import { useBudgets } from '../../../../hooks/useBudgets';

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



const PhaseItem = ({ phases = [], onBack, onEdit, devise, project }) => {
    const { budget, setBudget } = useBudgets();
    const { phase_id } = useParams();
    const [openDelete, setOpenDelete] = useState(false);
    const { deletePhase } = usePhases();
    const [loading, setLoading] = useState(false);

    const color = useMemo(() => generateNiceColor(), []);

    const phase = useMemo(
        () => phases.find(p => p.phase_id === Number(phase_id)),
        [phases, phase_id]
    );


    const handlerConfirm = async () => {
        setLoading(true);

        await new Promise(resolve => setTimeout(resolve, 3000))
        const result = await deletePhase(project?.projet_id, phase_id, phase);
        console.log(result);

        if (!result.success) {
            console.error(result.error || result.errors);
            setLoading(false);
            return;
        }

        setBudget(result.data.updatedBudget);
        handleClose();
    }

    const handleClose = () => {
        setLoading(false);
        setOpenDelete(false);
    }


    if (!phase) {
        return (
            <div className="text-center py-10 bg-white rounded-xl ">
                <p className="text-red-500 text-2xl font-bold">Phase non trouvée ou supprimée</p>
                <button onClick={onBack} className="text-blue mt-4 font-medium bg-gray-400 text-white transition-colors px-6 py-2 rounded-lg">
                    Retour
                </button>
            </div>
        );
    }


    const tasks = Array.isArray(phase?.taches) ? phase.taches : [];
    const members = Array.isArray(phase?.membres) ? phase.membres : [];


    return (
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">

            {/* Header */}
            <div className="flex items-center  justify-between gap-4 pb-4 border-b-2 border-gray-200 mb-6">
                <div className='flex items-center gap-3'>
                    <button
                        onClick={onBack}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <ArrowBack />
                    </button>

                    <h2 className="text-2xl font-bold text-gray-800">
                        {phase.title || "Sans titre"}
                    </h2>

                </div>

                <div className='flex items-center gap-3'>
                    <span className='text-2xd text-gray-600 font-medium'>Budget pour cette phase : </span>
                    <span className='text-2xd text-primary font-medium '>
                        {formateMontantSimple(phase.budget_phase)} {devise}
                    </span>
                </div>

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
            <div className="flex flex-col  gap-10 pt-6  border-gray-200">

                <div className="flex gap-6 flex-wrap border-b-2 pb-6 border-gray-200">


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

                <div className='flex items-center self-end gap-6'>

                    <button
                        onClick={() => onEdit(phase)}
                        className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <Edit /> Modifier
                    </button>

                    <button
                        onClick={() => setOpenDelete(true)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
                        <Delete /> Supprimer
                    </button>


                </div>



            </div>

            <DeleteConfirm
                message={`Voulez-vous vraiment supprimer la phase ${phase.title}`}
                open={openDelete}
                onClose={() => setOpenDelete(false)}
                element={phase}
                elementId={phase_id}
                projet_id={project?.projet_id}
                onConfirm={() => handlerConfirm()}
                loading={loading}
            />


        </div>
    );
};

export default PhaseItem;