import Joi from "joi";

export const getSchema = Joi.object({

  nomComplet: Joi.string().min(2).max(80),
  poste: Joi.string(),
  role: Joi.string(),
  sexe: Joi.string()
    .valid("Homme", "Femme", "Personaliser")
    .allow(null, ""),
  telephone: Joi.string().allow("", null),
  email: Joi.string().email().allow("", null),
  niveau_etude: Joi.string().allow("", null),
  projet_id: Joi.number() ,
  competences: Joi.array().items(Joi.string().trim()).default([]),
  

}).unknown(false);


// Fonction utilitaire
export  const membresSchema = (isCreate) => {
  if (isCreate) {
    return getSchema.fork(
      ['projet_id', 'nomComplet','poste', 'role', 'sexe' , 'telephone', 'email','niveau_etude','competences'],
      (field) => field);
  }
  return getSchema; 
};

export const normalizeMembreData = (data) => {
  return {
    ...data,
    competences: data.competences || []
  };
};


export function normalizeMembreDataUp(projet_id , data) {

  return {
    projet_id: projet_id,
    nomComplet: data.nomComplet,
    poste: data.poste,
    role: data.role,
    sexe: data.sexe,
    telephone: data.telephone,
    email: data.email,
    niveau_etude : data.niveau_etude ,
    competences: Array.isArray(data.competences)
      ? data.competences.filter(v => v?.trim() !== "")
      : []
  };
}