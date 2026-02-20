import { Toaster } from 'react-hot-toast';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Accueil from '../components/Accueil';
import OpenProject from '../components/OpenProject';
import SplashScreen from '../SplashScreen';
import { useState } from 'react';
import Dashboard from '../components/Dashboard';

function App() {
  const [project, setProject] = useState(true);

  return (
    <div className="w-screen h-screen bg-white">
      <BrowserRouter>
        <SplashScreen>
          {project ? <Dashboard /> : <Accueil setProject={setProject} />}
          <Toaster position="top-right" />
        </SplashScreen>
      </BrowserRouter>
    </div>
  );
}

export default App;