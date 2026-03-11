import Joi from "joi";

export const dependencySchema = Joi.object({
  projet_id: Joi.number().integer().positive().required(),

  from_phase_id: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      "number.base": "from_phase_id doit être un nombre",
      "any.required": "from_phase_id est requis"
    }),

  to_phase_id: Joi.number()
    .integer()
    .positive()
    .required()
    .invalid(Joi.ref("from_phase_id"))
    .messages({
      "number.base": "to_phase_id doit être un nombre",
      "any.invalid": "Une phase ne peut pas dépendre d'elle-même"
    })
});


export function normalizeDependencyData(data) {
  return {
    projet_id: Number(data.projet_id),
    from_phase_id: Number(data.from_phase_id),
    to_phase_id: Number(data.to_phase_id)
  };
}