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


 
 