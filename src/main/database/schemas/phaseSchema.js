import Joi from "joi";

export const getSchema = Joi.object({

  title: Joi.string().min(2).max(100),
  description_phase: Joi.string().min(10),
  date_debut: Joi.date().iso(),
  date_fin: Joi.date()
    .iso()
    .min(Joi.ref("date_debut"))
    .required()
    .messages({
      "date.min": "Date fin doit être après date début"
    }),

  taches: Joi.array().items(Joi.string().trim()).default([]),
  membres: Joi.array().items(Joi.string().trim()).default([]),
  projet_id: Joi.number(),
  budget_phase: Joi.number().default(0),
  budget_consomme: Joi.number().default(0),
  budget_restant: Joi.number().default(0),
  status : Joi.string().default('encours'),

}).unknown(false);


export  const phaseSchema = (isCreate) => {
  if (isCreate) {
    return getSchema.fork(
      ['projet_id' ,'title', 'description_phase', 'date_debut' , 'date_fin', 'taches' ,'projet_id' ,'budget_phase', 'budget_consomme' ,'budget_restant' ,'status'],
      (field) => field.required());
  }
  return getSchema; 
};


export const normalizePhaseDataUpdate = (phaseData , projet_id) => {
    if (!phaseData) {
        console.error("phaseData est undefined");
        return null;
    }

    return { 
        projet_id: projet_id,
        // Champs optionnels - garder la valeur existante si non fournie
        title: phaseData.title,
        description_phase: phaseData.description_phase,
        date_debut: phaseData.date_debut,
        date_fin: phaseData.date_fin,
        budget_phase: phaseData.budget_phase !== undefined ? Number(phaseData.budget_phase) : undefined,
        status: phaseData.status,
        
        // Tableaux
        taches: phaseData.taches !== undefined 
            ? (Array.isArray(phaseData.taches) ? phaseData.taches : [])
            : undefined,
        membres: phaseData.membres !== undefined
            ? (Array.isArray(phaseData.membres) ? phaseData.membres : [])
            : undefined,
        
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