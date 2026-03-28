import { useParams, Navigate } from "react-router-dom";
import { useProjects } from "../../hooks/useProjets";
import DashboardLayout from "./DashboardLayout";


const Dashboard = () => {
    const { projects, loading, activeProject } = useProjects();

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Chargement...</div>;
    }

    const project = projects.find(p => p.projet_id === Number(activeProject?.projet_id));

    if (!project) {
        return <Navigate to="/" replace />;
    }

    return <DashboardLayout project={project} />;
};

export default Dashboard;