import { Toaster } from 'react-hot-toast';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Accueil from '../components/Accueil';
import OpenProject from '../components/widjets/OpenProject';
import SplashScreen from '../SplashScreen';
import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import TitleBar from '../TitleBar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ProjectsProvider, useProjects } from '../hooks/useProjets';

// Composant interne qui utilise le contexte
const AppContent = () => {
  const [project, setProject] = useState(null);
  const [projectsExist, setProjectsExist] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { projects, loading: projectsLoading } = useProjects();

  useEffect(() => {
    if (!projectsLoading) {
      setProjectsExist(projects.length > 0);
      setIsLoading(false);
    }
  }, [projects, projectsLoading]);

  if (isLoading) {
    return (
      <div className="w-screen h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-white overflow-hidden">
      <ToastContainer />
      <TitleBar />
      <BrowserRouter>
        <SplashScreen>
          {projectsExist && !project ? (
            <OpenProject setProject={setProject} />
          ) : project ? (
            <Dashboard project={project} />
          ) : (
            <Accueil setProject={setProject} />
          )}
          <Toaster position="top-right" />
        </SplashScreen>
      </BrowserRouter>
    </div>
  );
};

// Composant principal avec le Provider
function App() {
  return (
    <ProjectsProvider>
      <AppContent />
    </ProjectsProvider>
  );
}

export default App;