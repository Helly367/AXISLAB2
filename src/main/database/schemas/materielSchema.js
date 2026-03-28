import Joi from 'joi';
/* ===============================
   SCHEMA JOI
================================ */

 const getSchema = Joi.object({

  nom: Joi.string().min(2).max(100),
  categorie: Joi.string().allow(null, ""),
  description: Joi.string().allow(null, ""),
  prix: Joi.number().positive(),
  quantite: Joi.number().positive(),
  fournisseur: Joi.string().allow(null, ""),
  statut: Joi.string().valid("en_attente", "suspendu", "dispinible",),
  projet_id: Joi.number(),
  phase_id : Joi.number()


 }).unknown(true);

// Fonction utilitaire
export  const materielSchema = (isCreate) => {
  if (isCreate) {
    return getSchema.fork(
      ['nom', 'categorie', 'description' , 'prix', 'quantite', 'fournisseur','statut', 'projet_id', 'phase_id'],
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


export function normalizeMaterielData(data) {
     if (!data) {
        console.error("MaterielData est undefined");
        return null;
    }

  return {
    ...data,
    prix: Number(data.prix),
    quantite : Number(data.quantite)
  };
}


 
 