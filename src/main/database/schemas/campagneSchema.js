// schemas/campagneSchema.js
import Joi from "joi";

// Sous-schéma pour les étapes
export const etapeSchema = Joi.object({
  id : Joi.string().required(),
  nom: Joi.string().min(2).max(255).required(),
  date_debut: Joi.date()
    .iso()
    .allow(null)
    .required(),
   
  date_fin: Joi.date()
    .iso()
    .when("date_debut", {
    is: Joi.date().required(),
    then: Joi.date().min(Joi.ref("date_debut")) })
    .allow(null)
    .required()
    .messages({
      "date.min": "La date de fin doit être supérieure la date de début"
    }),
  completed: Joi.boolean().default(false)
});

// Sous-schéma pour la planification
export const planificationSchema = Joi.object({
  type: Joi.string().valid('continue', 'par_etapes', 'evenement', 'saisonniere', 'formation').required(),
  etapes: Joi.array().items(etapeSchema).default([]),
  canaux: Joi.array().items(Joi.string().max(100)).default([]),
  formateurs: Joi.array().items(Joi.string().max(100)).default([])
});

const partialSchema = etapeSchema.fork(
  ['nom', 'date_debut', 'date_fin'],
  field => field.optional()
);

// Sous-schéma pour les résultats
 export const resultatsSchema = Joi.object({
    
  objectifs_atteints: Joi.number().min(0).max(100).default(0),
  ventes_generees: Joi.number().min(0).default(0),
  leads_generees: Joi.number().min(0).default(0),
  contacts_estimes: Joi.number().min(0).default(0),
  cout_par_lead: Joi.number().min(0).default(0),
  retour_investissement: Joi.number().default(0),
  satisfaction: Joi.number().min(0).max(5).default(0),
  commentaires: Joi.string().max(1000).allow(''),
  personnes_touchees: Joi.number().min(0).default(0),
  engagements: Joi.number().min(0).default(0),
  partenaires_impliques: Joi.number().min(0).default(0),
  inscrits: Joi.number().min(0).default(0),
  presents: Joi.number().min(0).default(0),
  attestations: Joi.number().min(0).default(0),
  precommandes: Joi.number().min(0).default(0),
  stocks_prepares: Joi.number().min(0).default(0),
  photos: Joi.array().items(Joi.string().uri()).default([])
});


// Schéma pour une dépense
export const depenseSchema = Joi.object({
     
  campagne_id: Joi.number().integer().positive().optional(),
  poste: Joi.string().min(2).max(255).required(),
  montant: Joi.number().min(0).required(),
  date: Joi.date().required(),
  projet_id: Joi.number(),
  
});

// Schéma principal
const getSchema = Joi.object({
    
  // Informations de base
  nom_compagne: Joi.string().min(3).max(255),
  ville: Joi.string().min(2).max(100),
  secteur: Joi.string().min(2).max(100),
  cout: Joi.number().min(0),
  
  // Dates
  date_debut: Joi.date(),
  date_fin: Joi.date().min(Joi.ref('date_debut')),
  // Statut
  status: Joi.string().valid('en_cours', 'termine', 'inactif', 'en_pause').default('inactif'),
  
  // Descriptif
  description: Joi.string().min(10).max(2000),
  objectif: Joi.string().min(3).max(500),
  responsable: Joi.string().min(2).max(255),

  // Objets complexes
  planification: planificationSchema,
  resultats: resultatsSchema ,
  projet_id: Joi.number(),
  
});



// Schéma pour la création (sans id)

// Fonction utilitaire
export  const campagnesSchema = (isCreate) => {
  if (isCreate) {
    return getSchema.fork(
      ['nom_compagne', 'ville', 'secteur' , 'cout', 'date_debut' , 'date_fin', 'status', 'description', 'objectif','responsable' , 'projet_id'],
      (field) => field.required());
  }
  return getSchema; 
};


const safeParse = (data, fallback) => {
  try {
    if (!data) return fallback;
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return fallback;
  }
};

export const normalizeData = (campagnes) => {
  if (!campagnes) return null;

  return {
    nom_compagne: campagnes.nom_compagne?.trim(),
    ville: campagnes.ville?.trim(),
    secteur: campagnes.secteur?.trim(),

    cout: Number(campagnes.cout) || 0,

    date_debut: campagnes.date_debut || null,
    date_fin: campagnes.date_fin || null,

    status: campagnes.status || "inactif",

    description: campagnes.description?.trim(),
    objectif: campagnes.objectif?.trim(),
    responsable: campagnes.responsable?.trim(),

    // ✅ IMPORTANT
    planification: safeParse(campagnes.planification, {
      type: "continue",
      etapes: [],
      canaux: [],
      formateurs: []
    }),

    resultats: safeParse(campagnes.resultats, {}),

    projet_id: campagnes.projet_id
  };
};


