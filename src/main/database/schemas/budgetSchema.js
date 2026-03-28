import Joi from "joi";



const getSchema = Joi.object({

  projet_id: Joi.number(),
  type: Joi.string().valid("investissement", "interne"),
  budget_total: Joi.number().positive(),
  budget_depense: Joi.number().positive(),
  budget_restant: Joi.number().positive(),
  reserve: Joi.number(),
  devise: Joi.string().valid("USD", "EUR", "CDF", "XOF", "GBP", "CDF"),
  taux_conversion: Joi.number().positive()


});

// Fonction utilitaire
export  const budgetSchema = (isCreate) => {
  if (isCreate) {
    return getSchema.fork(
      ['projet_id', 'type','budget_total', 'budget_depense', 'budget_restant' , 'reserve', 'devise','taux_conversion'],
      (field) => field.required());
  }
  return getSchema; 
};


export function normalizeBudgetData(data) {

  return {
    project_id: Number(data.project_id),
    budget_total: Number(data.montant_total),
    devise: data.devise,

    budget_depense: Number(data.budget_depense || 0),
    budget_restant: Number(data.budget_restant || 0),
    reserve: Number(data.reserve || 0),
    taux_conversion: Number(data.taux_conversion || 0)
  };

}