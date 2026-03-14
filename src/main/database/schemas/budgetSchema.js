import Joi from "joi";

export const budgetSchema = Joi.object({

  project_id: Joi.number().required(),

  type: Joi.string()
    .valid("interne", "investissement")
    .required(),

  montant_total: Joi.number().positive().required(),

  devise: Joi.string().default("USD"),

  reserve: Joi.number().min(0).default(0),

  seuil_alerte: Joi.number().min(50).max(95).default(80),

  notifications: Joi.boolean().default(true)

}).unknown(false);



export function normalizeBudgetData(data) {

  return {

    ...data,
    montant_total: Number(data.montant_total || 0),
    reserve: Number(data.reserve || 0),
    seuil_alerte: Number(data.seuil_alerte || 80),
    notifications: Boolean(data.notifications)

  };
}