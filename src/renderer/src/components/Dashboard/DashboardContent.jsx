import { Routes, Route, Navigate } from "react-router-dom";
import ProfileContent from "../Gestion/Profile/ProfileContent";
import StructureContent from "../Gestion/Structure/StructureContent";
import EquipeContnent from "../Ressources/Equipe/EquipeContent";
import BudgetContent from "../Ressources/Budget/BudgetContent";
import MaterielContent from "../Ressources/Materiels/MaterielContent";
import ProjectDashboardChart from "../Gestion/Progress";
import CampagnesContent from "../Communification/Compagnes/CampagnesContent";
import { usePhases } from "../../hooks/usePhase";


const DashboardContent = ({ project }) => {
    const { phases } = usePhases();
    return (
        <main className=" bg-gray-50 mb-8">
            <Routes>


                <Route index element={<Navigate to="profile" replace />} />

                <Route path="profile/*" element={<ProfileContent project={project} />} />
                <Route path="progress/*" element={<ProjectDashboardChart project={project} phases={phases} />} />
                <Route path="structure/*" element={<StructureContent project={project} />} />
                <Route path="equipe/*" element={<EquipeContnent project={project} />} />
                <Route path="Budget/*" element={<BudgetContent project={project} />} />
                <Route path="materiels/*" element={<MaterielContent project={project} />} />
                <Route path="campagnes/*" element={<CampagnesContent project={project} />} />


                <Route path="*" element={<Navigate to="profile" replace />} />

            </Routes>
        </main>
    );
};

export default DashboardContent;