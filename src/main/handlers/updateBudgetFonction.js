import db from "../database/db";
import { budgetSchema } from "../database/schemas/budgetSchema";

// validation joi budget
function validateBudget(data, isCreate) {
  const { error, value } = budgetSchema(isCreate).validate(data, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {
    return {
      isValid: false,
      errors: error.details.map(err => ({
        field: err.path[0],
        message: err.message
      }))
    };
  }

  return {
    isValid: true,
    value
  };
}

export async function updateBudgetProjet(projetId) {
  try {
    // Récupérer la somme des dépenses
    const resultat = await db("depenses")
      .where({ projet_id: projetId }) 
      .sum("montant as total_depense")
      .first();

    // Récupérer le budget total du projet
    const projet = await db("projets")
      .where({ projet_id: projetId }) 
      .select("budget_total")
      .first();

    const budgetDepense = Number(resultat?.total_depense || 0);
    const budgetTotal = Number(projet?.budget_total || 0);
    const budgetRestant = budgetTotal - budgetDepense;

    const budgetData = {
      budget_total: budgetTotal,    
      budget_depense: budgetDepense,
      budget_restant: budgetRestant
    };

    const validation = validateBudget(budgetData, false);
    
    if (!validation.isValid) {
      console.error("Erreur validation:", validation.errors);
      return { success: false, errors: validation.errors };
    }

    const dataUpdate = validation.value;

    // ✅ Vérifier si le budget existe déjà
    const existingBudget = await db("budgets")
      .where({ projet_id: projetId })
      .first();

    if (existingBudget) {
      // Mettre à jour
      await db("budgets")
        .where({ projet_id: projetId })
        .update({
          ...dataUpdate,
          updated_at: new Date()
        });
    } else {
      // Créer
      await db("budgets").insert({
        projet_id: projetId,
        ...dataUpdate,
        created_at: new Date(),
        updated_at: new Date()
      });
    }

    return { success: true };
    
  } catch (error) {
    console.error("Erreur updateBudgetProjet:", error);
    return { success: false, error: error.message };
  }
}