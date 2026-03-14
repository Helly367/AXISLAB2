import Joi from "joi";

export const membreSchema = Joi.object({

  nomComplet: Joi.string().min(2).max(100).required(),
  poste: Joi.string().required(),
  role: Joi.string().required(),
  sexe: Joi.string()
    .valid("Homme", "Femme", "Personaliser")
    .allow(null, ""),
  telephone: Joi.string().allow("", null),
  email: Joi.string().email().allow("", null),
  niveau_etude: Joi.string().allow("", null),
  project_id: Joi.number().required() ,
  competences: Joi.array().items(Joi.string().trim()).default([]),
  

}).unknown(false);

export const normalizeMembreData = (data) => {
  return {
    ...data,
    competences: data.competences || []
  };
};


export function normalizeMembreDataUp(data) {

  return {
    ...data,
    competences: Array.isArray(data.competences)
      ? data.competences.filter(v => v?.trim() !== "")
      : []
  };
}