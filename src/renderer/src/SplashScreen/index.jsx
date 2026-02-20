import React from 'react';
import { useEffect, useState } from 'react';
import axis from "../../../../resources/axis.png";
import "../assets/splashscreen.css";

const SplashScreen = ({ children }) => {  // CORRIGÉ: 'children' pas 'childre'
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 10000);

        return () => clearTimeout(timer);  // CORRIGÉ: clearTimeout (pas clearInterval)
    }, []);

    if (loading) {
        return (
            <div className='dots-container flex flex-col w-full h-full items-center justify-center gap-5'>
                <div className='logo w-45'>
                    <img src={axis} alt="axis image" className='w-full' />
                </div>
                <div className="dots-loader">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
                <p className='loading-text'>Chargement...</p>
            </div>
        );
    }

    return <>{children}</>;  // CORRIGÉ: utilise 'children'
};

export default SplashScreen;