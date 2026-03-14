import Joi from "joi";

export const depenseSchema = Joi.object({

  budget_id: Joi.number().required(),

  phase_id: Joi.number().allow(null),

  description: Joi.string().allow(""),

  montant: Joi.number().positive().required(),

  date: Joi.date().iso().required(),

  type: Joi.string().default("normal")

}).unknown(false);