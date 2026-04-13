import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useProjects } from "../hooks/useProjets";
import AppProviders from "../AppProviders";
import Accueil from "../components/Accueil";
import Dashboard from "../components/Dashboard/Dashboard";
import OpenProject from "../components/widjets/OpenProject";
import TitleBar from "../TitleBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const RootRedirect = ({ projects }) => {

  if (projects.length === 0) {
    return <Accueil />;
  }

  return <Navigate to="/projects" replace />;
};



function AppContent() {
  const { projects, loading } = useProjects();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-screen h-screen bg-white overflow-hidden ">
      <Routes>
        <Route path="/" element={<RootRedirect projects={projects} />} />
        <Route path="/projects" element={<OpenProject />} />
        <Route path="/dashboard/:projet_id/*" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>

  );
}

export default function App() {
  return (
    <AppProviders>
      <TitleBar />
      <ToastContainer />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppProviders>
  );
}