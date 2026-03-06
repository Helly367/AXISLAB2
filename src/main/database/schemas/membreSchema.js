import Joi from "joi";

export const memberSchema = Joi.object({

    nom: Joi.string().min(2).required(),

    poste: Joi.string().required(),

    role: Joi.string().allow("", null),

    email: Joi.string().email().allow("", null),

    photo: Joi.string().allow("", null),

    disponibilite: Joi.number().min(0).max(100).default(100),

    chargeMax: Joi.number().min(1).max(60).default(40),

    chargeActuelle: Joi.number().default(0),

    competences: Joi.array().items(Joi.string()).default([]),

    competencesRequises: Joi.array().items(Joi.string()).default([]),

    historique: Joi.array().default([]),

    dateDebut: Joi.date().iso().allow(null)

}).unknown(false);