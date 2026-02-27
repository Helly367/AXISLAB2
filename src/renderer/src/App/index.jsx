import { Toaster } from 'react-hot-toast';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Accueil from '../components/Accueil';
import OpenProject from '../components/widjets/OpenProject';
import SplashScreen from '../SplashScreen';
import { useState, useEffect } from 'react';
import Dashboard from '../components/Dashboard';
import TitleBar from '../TitleBar';

function App() {
  const [project, setProject] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchMessage() {
      const msg = await window.api.direBonjour("elie");
      setMessage(msg);
      console.log(msg); // Affiche "Bonjour elie"
    }
    fetchMessage();
  }, []);

  return (
    <div className="w-screen h-screen bg-white overflow-hidden">
      <TitleBar />
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