import React, { useState } from 'react';
import { AddCircle, Timeline, Link, Flag } from "@mui/icons-material";
import { Routes, Route, useNavigate, useParams, useLocation, Navigate } from 'react-router-dom';
import PhaseList from './Phases/PhaseList';
import PhaseItem from './Phases/PhaseItem';
import ModalCreatePhase from './Phases/CreatePhase';
import ModalEditPhase from './Phases/EditPhase';
import EnterpriseGantt from './Gantt/GanttDiagram';
import DependenciesManager from './DependenciesManager';
import JalonContnent from './Jalons/JalonContent';
import { usePhases } from '../../../hooks/usePhase';
import { useBudgets } from "../../../hooks/useBudgets"
import { alertService } from '../../../Services/alertService';

const StructureContent = ({ project }) => {

    const navigate = useNavigate();
    const location = useLocation();
    const { projet_id} = useParams();

    /* =============================
       STATES
    ============================= */

    const { phases } = usePhases();
    const { budget, setBudget } = useBudgets();

    if (!budget) return null;
    if (!phases) return null;

    const [dependencies, setDependencies] = useState([]);
    const [jalons, setJalons] = useState([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [phaseToEdit, setPhaseToEdit] = useState(null);

    /* =============================
       PHASE MANAGEMENT
    ============================= */

    const handleEditPhase = (updatedPhase) => {
        console.log(updatedPhase);
    };

    const handleViewPhase = (phase_id) => {
        navigate(`/dashboard/${projet_id}/structure/phase/${phase_id}`);
    };

    const handleBack = () => {
        navigate(`/dashboard/${projet_id}/structure/phase`);
    };

    const handleOpenEditModal = (phase) => {
        setPhaseToEdit(phase);
        setIsEditModalOpen(true);
    };


    const verifiyBudget = () => {

        if (budget?.budget_restant === 0) {
            alertService.warning(`Votre budget est insuffisant pour créer une nouvelle phase. Restant: ${budget.budget_restant} ${budget.devise}`);
            setIsCreateModalOpen(false);
            return null;

        }

        setIsCreateModalOpen(true);

    }

    /* =============================
       DEPENDENCY CHECKER
    ============================= */

    const checkDependencies = (phaseId) => {
        const phaseDeps = dependencies.filter(d => d.to === phaseId);

        for (const dep of phaseDeps) {
            const depPhase = phases.find(p => p.id === dep.from);

            if (!depPhase || depPhase.progression < 100) {
                return false;
            }
        }

        return true;
    };

    /* =============================
       NAVIGATION
    ============================= */

    const navigation = [
        {
            label: "Liste des phases",
            icon: <></>,
            path: `/dashboard/${projet_id}/structure/phase`
        },
        {
            label: "Diagramme de Gantt",
            icon: <Timeline fontSize="small" />,
            path: `/dashboard/${projet_id}/structure/gantt`
        },
        {
            label: "Dépendances",
            icon: <Link fontSize="small" />,
            path: `/dashboard/${projet_id}/structure/dependances`
        },
        {
            label: "Jalons",
            icon: <Flag fontSize="small" />,
            path: `/dashboard/${projet_id}/structure/jalons`
        }
    ];

    return (
        <div className="min-h-screen bg-gray-200">

            <div className="max-w-8xl mx-auto px-4 py-2">

                {/* HEADER */}

                <div className="bg-primary rounded-lg shadow-md p-1.5 px-2 flex justify-between items-center ">

                    <h1 className="text-2xd text-white font-bold">
                        Structure du projet
                    </h1>

                    <button
                        onClick={() => verifiyBudget()}
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-all flex items-center gap-2 shadow-md"
                    >
                        <AddCircle />
                        Ajouter une phase
                    </button>

                </div>

                {/* NAVIGATION */}

                <div className="bg-white rounded-lg shadow-md p-2  flex gap-2 mt-3 mb-3">

                    {navigation.map((nav) => (

                        <NavButton
                            key={nav.label}
                            active={location.pathname.includes(nav.path)}
                            onClick={() => navigate(nav.path)}
                            icon={nav.icon}
                            label={nav.label}
                        />

                    ))}

                </div>

                {/* ROUTES */}

                <Routes>

                    {/* ROUTE PAR DEFAUT */}
                    <Route index element={<Navigate to="phase" replace />}
                    />

                    <Route
                        path="phase"
                        element={
                            <PhaseList
                                phases={phases}
                                onViewPhase={handleViewPhase}
                                onEditPhase={handleOpenEditModal}
                                dependencies={dependencies}
                                checkDependencies={checkDependencies}
                            />
                        }
                    />

                    <Route
                        path="phase/:phase_id"
                        element={
                            <PhaseItem
                                phases={phases}
                                devise={budget.devise}
                                onBack={handleBack}
                                onEdit={handleOpenEditModal}
                                jalons={jalons.filter(
                                    m => m.Number(phaseId) === Number(phase_id)
                                )}
                                project={project}
                               
                            />
                        }
                    />

                    <Route
                        path="gantt"
                        element={
                            <EnterpriseGantt
                                dependencies={dependencies}
                                jalons={jalons}
                                onPhaseClick={handleViewPhase}
                            />
                        }
                    />

                    <Route path="dependances" element={<DependenciesManager project={project} />} />

                    <Route
                        path="jalons"
                        element={
                            <JalonContnent
                                phases={phases}
                                project={project}

                            />
                        }
                    />

                </Routes>

                {/* MODAL CREATE */}

                <ModalCreatePhase
                    isOpen={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    project={project}
                    budget={budget}
                    setBudget={setBudget}
                />

                {/* MODAL EDIT */}

                <ModalEditPhase
                    isOpen={isEditModalOpen}
                    onClose={() => {
                        setIsEditModalOpen(false);
                        setPhaseToEdit(null);
                    }}
                    onSave={handleEditPhase}
                    phaseToEdit={phaseToEdit}
                    project={project}
                    budget={budget}
                />

            </div>

        </div>
    );
};

const NavButton = ({ active, onClick, icon, label }) => {

    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2
            ${active
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
        >
            {icon}
            {label}
        </button>
    );

};

export default StructureContent;