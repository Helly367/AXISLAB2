import Joi from "joi";

const getSchema = Joi.object({
    
  projet_id : Joi.number(),
  budget_id: Joi.number(),
  phase_id: Joi.number().allow(null),
  titre_depense : Joi.string().allow(""),
  description: Joi.string().allow(""),
  montant: Joi.number().positive().required(),
  date: Joi.date().iso().required(),
  type: Joi.string().default("normal")

}).unknown(false);


// Fonction utilitaire
export const depenseSchema = (isCreate) => {
    if (isCreate) {
        return getSchema.fork(
            ['projet_id', 'budget_id', 'phase_id', 'titre_depense', 'description' ,'montant', 'date', 'type'],
            (field) => field.required());
    }
    return getSchema;
}