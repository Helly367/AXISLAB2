/* eslint-disable prettier/prettier */
import { Code, Password, Visibility } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const navigate = useNavigate();

    const handleNavigation = async () => {
        console.log("salut")
        navigate("/college")
    }

    return (
        <div className="w-screen h-screen bg-image flex items-center flex-col justify-center gap-16 relative">
            {/* Overlay sombre pour améliorer la lisibilité */}
            <div className='absolute inset-0 bg-opacity-60 bg-flou z-10'></div>

            {/* Header */}
            <div className='flex flex-col gap-5 items-center justify-center p-8 z-20 bg-beige/80 backdrop-blur-sm rounded-lg shadow-2xl'>
                <h1 className='text-5xl text-blanc-casser font-bold font-sans'>Black College</h1>
                <p className='text-gris-anthracite text-xl font-semibold text-center'>
                    Notre devise : Excellence, Rigueur, Persévérance et Travail
                </p>
            </div>

            {/* Formulaire */}
            <form className='flex flex-col items-center gap-8 z-20 bg-beige/60 backdrop-blur-sm p-8 rounded-2xl shadow-2xl min-w-[400px]'>
                <div className='flex flex-col items-center gap-3 text-center'>
                    <h1 className='text-blanc-casser font-bold text-4xl'>Connectez-vous</h1>
                    <p className='text-orage-corail text-lg font-medium'>
                        Renseignez vos informations d&apos;administrateur
                    </p>
                </div>

                {/* Champ code admin */}
                <div className='flex items-center gap-3 text-lg bg-beige/90 w-full max-w-md py-3 border-b-2 border-b-white  
                   rounded-[5px]  px-4 transition-all duration-300 focus-within:border-white focus-within:shadow-lg'>
                    <Code className='text-white' />
                    <input
                        type="text"
                        placeholder='Votre code admin'
                        className='outline-none bg-transparent w-full placeholder-gray-700 text-white font-medium'
                    />
                </div>

                {/* Champ mot de passe */}
                <div className='flex items-center gap-3 text-lg bg-beige/90 w-full max-w-md py-3 border-b-2 border-b-white 
                    rounded-[5px]  px-4 transition-all duration-300 focus-within:border-white focus-within:shadow-lg relative'>
                    <Password className='text-white' />
                    <input
                        type="password"
                        placeholder='Votre mot de passe'
                        className='outline-none bg-transparent w-full placeholder-gray-700  text-white font-medium'
                    />
                    <Visibility className='cursor-pointer text-white absolute right-3' />
                </div>

                {/* Bouton */}
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        handleNavigation();
                    }}
                    className='px-16 py-3 bg-orage-corail hover:bg-orage-corail/90 rounded-xl text-blanc-casser font-bold cursor-pointer 
                    transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full max-w-md'
                >
                    Se Connecter
                </button>
            </form>

            {/* Footer */}
            <div className='z-20 text-center mt-8'>
                <p className='text-blanc-casser/80 text-sm'>
                    © 2025 Black College - Tous droits réservés
                </p>
            </div>
        </div>
    )
}

export default Login