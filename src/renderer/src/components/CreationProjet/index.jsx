import React, { useState } from 'react'


const CreationProjet = () => {

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de création de projet
    console.log('Projet créé:', { projectName, projectDescription });
  };

  return (
    <div className='bg-white w-2/4 flex flex-col items-center justify-center gap-10 p-8 rounded-lg shadow shadow-blue-600'>
      <h3 className='text-2xl text-black font-bold'>Créer votre premier projet</h3>

      <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-10'>
        <div className='flex flex-col items-center justify-center gap-10 w-full'>

          <div className='flex flex-col gap-3 w-full max-w-[450px] '>
            <label className='text-xl text-black'>Nom du projet</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className='p-2 w-full focus:outline-blue-600  border-2 border-gray-400 rounded-md 
              bg-transparent  placeholder-gray-400  '
              placeholder='Ex: Mon nouveau projet'
              required
            />
          </div>

          <div className='flex flex-col gap-3 w-full max-w-[450px]'>
            <label className='text-xl text-black'>Description du projet</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className='p-2 w-full h-32  border-2 border-gray-400 rounded-md bg-transparent  placeholder-gray-400 focus:outline-blue-600'
              placeholder='Décrivez votre projet...'
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className='px-8 py-3 bg-blue-600 text-white font-semibold rounded-md cursor-pointer hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 transition-colors'
        >
          Créer un projet
        </button>
      </form>
    </div>
  )
}

export default CreationProjet

