import Joi from 'joi';
/* ===============================
   SCHEMA JOI
================================ */

 const getSchema = Joi.object({

  nom_projet: Joi.string()
    .min(2)
    .max(100),

  description: Joi.string()
    .allow(null, "")
    .optional(),

  status: Joi.string()
    .valid(
      "planification",
      "en_cours",
      "suspendu",
      "termine",
      "abandonne"
    ),

  prospects_cibles: Joi.alternatives()
    .try(
      Joi.string(),
      Joi.array().items(Joi.string())
    )
    .allow(null)
    .optional(),

  // DATE DEBUT PROJET
  date_debut: Joi.date()
    .iso()
    .allow(null)
    .optional(),

  // DATE FIN PROJET
  date_fin: Joi.date()
    .iso()
    .when("date_debut", {
      is: Joi.date().required(),
      then: Joi.date().min(Joi.ref("date_debut"))
    })
    .allow(null)
    .optional()
    .messages({
      "date.min": "La date de fin doit être supérieure la date de début"
    }),

  // OBJECTIF COURT TERME
  objectif_court_terme_debut: Joi.date()
    .iso()
    .allow(null)
    .optional(),

  objectif_court_terme_fin: Joi.date()
    .iso()
    .when("objectif_court_terme_debut", {
      is: Joi.date().required(),
      then: Joi.date().min(Joi.ref("objectif_court_terme_debut"))
    })
    .allow(null)
    .optional()
    .messages({
      "date.min":
        "La date de fin court terme doit être supérieure à la date de début court terme"
    }),

  // OBJECTIF LONG TERME
  objectif_long_terme_debut: Joi.date()
    .iso()
    .allow(null)
    .optional(),

  objectif_long_terme_fin: Joi.date()
    .iso()
    .when("objectif_long_terme_debut", {
      is: Joi.date().required(),
      then: Joi.date().min(Joi.ref("objectif_long_terme_debut"))
    })
    .allow(null)
    .optional()
    .messages({
      "date.min":
        "La date de fin long terme doit être supérieure  à la date de début long terme"
    }),

  // 👇 ON AUTORISE LES AUTRES CHAMPS EXISTANTS
  chef_projet: Joi.string().allow(null, "").optional(),
  objectif_court_terme: Joi.string().allow(null, "").optional(),
  objectif_long_terme: Joi.string().allow(null, "").optional(),
  type_projet: Joi.string().allow(null, "").optional(),
  
  budget_total: Joi.number().positive(),
  devise: Joi.string().valid("USD", "EUR", "CDF", "XOF", "GBP"),
  taux_conversion : Joi.number().positive().default(1)

 }).unknown(true);

// Fonction utilitaire
export  const projetSchema = (isCreate) => {
  if (isCreate) {
    return getSchema.fork(
      ['nom_projet', 'description', 'budget_total' , 'devise', 'taux_conversion'],
      (field) => field.required());
  }
  return getSchema; 
};


 
 