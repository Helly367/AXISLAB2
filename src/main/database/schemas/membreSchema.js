import Joi from "joi";

export const membreSchema = Joi.object({

  nom: Joi.string().min(2).max(100).required(),

  poste: Joi.string().required(),

  role: Joi.string().required(),

  sexe: Joi.string()
    .valid("Homme", "Femme", "Personaliser")
    .allow(null, ""),

  telephone: Joi.string().allow("", null),

  email: Joi.string().email().allow("", null),

  niveau_etude: Joi.string().allow("", null),

  disponibilite: Joi.number().min(0).max(100).default(100),

  charge_max: Joi.number().min(1).default(40),

  charge_actuelle: Joi.number().min(0).default(0),

  competences: Joi.array().items(Joi.string().trim()).default([]),

  competences_requises: Joi.array().items(Joi.string().trim()).default([]),

  date_debut: Joi.date().iso(),

  historique: Joi.array().default([])

}).unknown(false);

export const normalizeMembreData = (data) => {
  return {
    ...data,
    competences: JSON.stringify(data.competences || []),
    competencesRequises: JSON.stringify(data.competencesRequises || []),
    historique: JSON.stringify(data.historique || [])
  };
};


export function normalizeMembreData(data) {

  return {

    ...data,

    competences: Array.isArray(data.competences)
      ? data.competences.filter(v => v?.trim() !== "")
      : [],

    competences_requises: Array.isArray(data.competences_requises)
      ? data.competences_requises.filter(v => v?.trim() !== "")
      : [],

    historique: Array.isArray(data.historique)
      ? data.historique
      : []
  };
}