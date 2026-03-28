import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import Joi from 'joi'
import { motion, AnimatePresence } from 'framer-motion'
import { alertService } from "../../../Services/alertService";
import { devises } from '../../../Services/listes';
import { useBudgets } from '../../../hooks/useBudgets'

// Schéma de validation Joi
const projectSchema = Joi.object({

  nom_projet: Joi.string().min(2).max(200).required().messages({
    'string.empty': 'Le nom du projet est obligatoire',
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'any.required': 'Le nom du projet est requis'
  }),
  description: Joi.string().max(1000).required().messages({
    'string.empty': 'La description est obligatoire',
    'any.required': 'La description est requise'
  }),
  budget_total: Joi.number().positive().required().messages({
    'number.empty': 'Veuillez saisir le budget pour ce projet',
    'any.required': 'Le budget est requis'

  }),
  devise: Joi.string().valid("USD", "EUR", "CDF", "XOF", "GBP", "CDF").required().messages({
    'string.empty': 'Veuillez selectionnez le device pour le budget ',
    'any.required': 'Le device est requis',
    'any.valid': 'option séléctionner est invalide'

  }),
})

const CreationProjet = ({ handleCreate }) => {
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const { setBudget } = useBudgets();

  // Initialisation de React Hook Form
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: joiResolver(projectSchema),
    defaultValues: {
      nom_projet: '',
      description: '',
      budget_total: '',
      devise: ''

    }
  })

  // Surveillance des champs pour animation
  const watchedFields = watch()

  const onSubmit = async (data) => {
    setLoading(true)
    setServerError('')

    try {

      const projectData = {
        ...data,
        chef_projet: null,
        date_debut: null,
        taux_conversion: 1,
        date_fin: null,
        objectif_long_terme: null,
        objectif_long_terme_debut: null,
        objectif_long_terme_fin: null,
        objectif_court_terme: null,
        objectif_court_terme_debut: null,
        objectif_court_terme_fin: null,
        prospects_cibles: null,
        type_projet: null,
        status: 'planification'
      }

      // simulation chargement
      await new Promise(resolve => setTimeout(resolve, 5000))
      const result = await handleCreate(projectData)

      if (result?.success) {
        setBudget(result.data.budget);
        reset()


      } else {

        setServerError(result?.error || "Erreur lors de la création")
        alertService.error(result?.error || "Erreur lors de la création")

      }

    } catch (err) {

      setServerError("Erreur: " + err.message)
      alertService.error("Erreur serveur")

    } finally {
      setLoading(false)
    }
  }


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className='w-170 bg-blue-100 flex items-center justify-center p-4'
    >
      <div className='bg-white w-full max-w-6xl flex flex-col items-center justify-center gap-8 p-10 rounded-2xl shadow-xl border border-white/20'>
        {/* En-tête */}
        <div className='text-center'>

          <h3 className='text-3xl font-bold  text-primary'>
            Créer votre premier projet
          </h3>
          <p className='text-gray-500 mt-2'>Commencez votre nouvelle aventure</p>
        </div>



        {/* Formulaire avec React Hook Form */}
        <form onSubmit={handleSubmit(onSubmit)} className='w-full space-y-8'>
          <div className='space-y-6'>
            {/* Champ Nom du projet */}
            <div className='group'>
              <label className='text-sm font-semibold text-gray-700 mb-2 block ml-1'>
                Nom du projet <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <input
                  {...register('nom_projet')}
                  type="text"
                  maxLength={80} // limite stricte
                  onChange={(e) => {
                    if (e.target.value.length > 80) {
                      e.target.value = e.target.value.slice(0, 80); // tronquer à 500 caractères
                    }
                    // mettre à jour React Hook Form
                    register('nom_projet').onChange(e)
                  }}
                  className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-xl 
                           focus:outline-none focus:bg-white 
                           transition-all duration-300
                           ${errors.nom_projet
                      ? 'border-red-500 focus:border-red-500'
                      : watchedFields.nom_projet
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-gray-200 focus:border-blue-500'
                    }
                           disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder='Ex: Innovation 2024'
                  disabled={loading}
                />

              </div>

              {/* Message d'erreur */}
              {errors.nom_projet && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-red-500 text-sm mt-1 ml-1'
                >
                  {errors.nom_projet.message}
                </motion.p>
              )}
            </div>

            {/* Champ Description */}
            <div className='group'>
              <label className='text-sm font-semibold text-gray-700 mb-2 block ml-1'>
                Description <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <textarea
                  {...register('description')}
                  rows={5}
                  maxLength={500} // limite stricte
                  onChange={(e) => {
                    if (e.target.value.length > 500) {
                      e.target.value = e.target.value.slice(0, 500); // tronquer à 500 caractères
                    }
                    // mettre à jour React Hook Form
                    register('description').onChange(e)
                  }}
                  className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-xl 
                      focus:outline-none focus:bg-white
                      transition-all duration-300 resize-none
                      ${errors.description
                      ? 'border-red-500 focus:border-red-500'
                      : watchedFields.description
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-gray-200 focus:border-blue-500'
                    }
                      disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder='Décrivez les objectifs et la vision de votre projet...'
                  disabled={loading}
                />

                {/* Compteur de caractères */}
                {watchedFields.description && (
                  <div className='absolute right-4 bottom-4 text-xs text-gray-400'>
                    {watchedFields.description.length}/500
                  </div>
                )}
              </div>

              {/* Message d'erreur */}
              {errors.description && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-red-500 text-sm mt-1 ml-1'
                >
                  {errors.description.message}
                </motion.p>
              )}
            </div>
          </div>

          {/* Budget du projet */}
          <div className='group flex justify-between w-full gap-4 '>

            <div className='w-9/12'>

              <label className='text-sm font-semibold text-gray-700 mb-2 block ml-1'>
                Budget du projet <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <input
                  {...register('budget_total')}
                  type="number"
                  maxLength={16} // limite stricte
                  onChange={(e) => {
                    if (e.target.value.length > 16) {
                      e.target.value = e.target.value.slice(0, 16); // tronquer à 500 caractères
                    }
                    // mettre à jour React Hook Form
                    register('budget_total').onChange(e)
                  }}
                  className={`w-full px-5 py-4 bg-gray-50 border-2 rounded-xl 
                           focus:outline-none focus:bg-white 
                           transition-all duration-300
                           ${errors.budget_total
                      ? 'border-red-500 focus:border-red-500'
                      : watchedFields.budget_total
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-gray-200 focus:border-blue-500'
                    }
                           disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder='Ex: 50 000'
                  disabled={loading}
                />

              </div>

              {/* Message d'erreur */}
              {errors.budget_total && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='text-red-500 text-sm mt-1 ml-1'
                >
                  {errors.budget_total.message}
                </motion.p>
              )}

            </div>

            <div>

              <label className='text-sm font-semibold text-gray-700 mb-2 block ml-1'>
                Devise <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>

                <select name="" id=""
                  {...register('devise')}
                  value={devises[0]}
                  className={` px-5 py-4 bg-gray-50 border-2 rounded-xl 
                            focus:outline-none focus:bg-white 
                            transition-all duration-300
                            ${errors.budget_total
                      ? 'border-red-500 focus:border-red-500'
                      : watchedFields.budget_total
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-gray-200 focus:border-blue-500'
                    }
                            disabled:opacity-50 disabled:cursor-not-allowed`}
                  placeholder='Ex: 50 000'
                  disabled={loading}>

                  {devises.map((devise) => (
                    <option value={devise.code}>{devise.nom}</option>
                  ))}

                </select>

                {/* Message d'erreur */}
                {errors.devise && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-red-500 text-sm mt-1 ml-1'
                  >
                    {errors.devise.message}
                  </motion.p>
                )}
              </div>

            </div>
          </div>

          {/* Bouton de soumission */}
          <motion.button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className='w-full py-4 bg-primary
                     text-white font-bold rounded-xl shadow-lg 
                     shadow-blue-600/30 hover:shadow-xl 
                     transition-all duration-300 
                     disabled:opacity-50 disabled:cursor-not-allowed
                     relative overflow-hidden group'
          >
            <span className='relative z-10 flex items-center justify-center gap-2'>
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Création en cours...
                </>
              ) : (
                <>
                  Créer le projet
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </span>
          </motion.button>
        </form>

        {/* Indication des champs obligatoires */}
        <p className='text-xs text-gray-400'>
          <span className='text-red-500'>*</span> Champs obligatoires
        </p>


      </div>
    </motion.div>
  )
}

export default CreationProjet