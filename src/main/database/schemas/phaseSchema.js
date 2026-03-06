import Joi from "joi";

export const phaseSchema = Joi.object({

  title: Joi.string().min(2).max(100).required(),

  description_phase: Joi.string().min(10).required(),

  date_debut: Joi.date().iso().required(),

  date_fin: Joi.date()
    .iso()
    .min(Joi.ref("date_debut"))
    .required()
    .messages({
      "date.min": "Date fin doit être après date début"
    }),

  taches: Joi.array().items(Joi.string().trim()).default([]),

  membres: Joi.array().items(Joi.string().trim()).default([]),

  project_id: Joi.number().required()

}).unknown(false);


export const normalizePhaseDataUpdate = (phaseData) => {
    // Vérifier si phaseData existe
    if (!phaseData) {
        console.error("phaseData est undefined");
        return null;
    }

    // S'assurer que toutes les propriétés nécessaires existent
    return {
        phase_id: phaseData.phase_id,
        title: phaseData.title || '',
        description_phase: phaseData.description_phase || '',
        date_debut: phaseData.date_debut || '',
        date_fin: phaseData.date_fin || '',
        // Vérifier que taches est un tableau
        taches: Array.isArray(phaseData.taches) ? phaseData.taches : [],
        // Vérifier que membres est un tableau
        membres: Array.isArray(phaseData.membres) ? phaseData.membres : [],
        // Garder les autres propriétés si elles existent
        ...phaseData
    };
};


export function normalizePhaseData(data) {

  return {
    ...data,

    taches: Array.isArray(data.taches)
      ? data.taches.filter(v => v?.trim() !== "")
      : [],

    membres: Array.isArray(data.membres)
      ? data.membres.filter(v => v?.trim() !== "")
      : []
  };
}