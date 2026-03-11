import Joi from "joi";

export const jalonSchema = Joi.object({
  title: Joi.string().min(2).required(),
  description: Joi.string().required(),
  type: Joi.string().required(),
  date: Joi.date().required(),
  phase_id: Joi.number().integer().positive().required(),
  projet_id: Joi.number().integer().positive().required()
});


export const normalizeData = (data) => {
    // Vérifier si phaseData existe
    if (!data) {
        console.error("jalons est undefined");
        return null;
    }

    // S'assurer que toutes les propriétés nécessaires existent
    return {
        ...data,
        phase_id: Number(data.phase_id),
        projet_id: Number(data.projet_id),
        title: data.title || '',
        description : data.description || '',
        type : data.type || '',
        date: data.date || '',  
    };
};