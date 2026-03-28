import db from "../database/db.js";
import { budgetSchema, normalizeBudgetData } from "../database/schemas/budgetSchema.js";



// function formatBudget(budget, categories = []) {
//   const result = { ...budget };

//   Object.entries(CATEGORIES).forEach(([key, label]) => {
//     result[key] =
//       categories.find(c => c.categorie === label)?.montant || 0;
//   });

//   return result;
// }

// export async function createBudget(data) {
//   console.log("backdata" , data);
  
//   try {
//     const cleaned = normalizeBudgetData(data);

//     const { error, value } = budgetSchema.validate(cleaned, {
//       abortEarly: false
//     });

//     if (error) {
//       return {
//         success: false,
//         errors: error.details.map(e => ({
//           field: e.path[0],
//           message: e.message
//         }))
//       };
//     }

//     const now = new Date();

//     // Création du budget
//     const [budget_id] = await db("budgets").insert({
//       project_id: value.project_id,
//       type: value.type,
//       montant_total: value.montant_total,
//       devise: value.devise,
//       created_at: now,
//       updated_at: now
//     });

//     // Création automatique des catégories
//     const categories = Object.entries(CATEGORIES)
//       .filter(([key]) => value[key] > 0)
//       .map(([key, label]) => ({
//         project_id: value.project_id,
//         budget_id,
//         categorie: label,
//         montant: value[key],
//         created_at: now,
//         updated_at: now
//       }));

//     if (categories.length) {
//       await db("budget_categories").insert(categories);
//     }

//     const budget = await db("budgets")
//       .where({ budget_id })
//       .first();

//     const budgetCategories = await db("budget_categories")
//       .where({ budget_id });
    
//     console.log(budget);
//     console.log(budgetCategories);
    
    

//     return {
//       success: true,
//       data: formatBudget(budget, budgetCategories)
//     };

//   } catch (error) {
//     console.error("createBudget error", error);
//     return {
//       success: false,
//       error: error.message
//     };
//   }
// }


// validation joi projet
function validateBudget(data , isCreate) {
  
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

export async function loadBudgets(projectId) {
    
    
  try {
    const budget = await db("budgets")
      .where({ projet_id: projectId }).first();
      
    if (!budget) {
      return { success: false, error: "Budget non trouvé" };
    }

    return {
      success: true,
      data: { budget }
    };

  } catch (error) {
    console.error("getBudgetByProject error", error);
    return {
      success: false,
      error: error.message
    };
  }
}


export async function convertionBudget(projet_id , budgetData) {
  console.log("backdata" , budgetData);
  
  try {
    const validation = validateBudget(budgetData , false);

    if (!validation.isValid) {
      return { success: false, error: validation.errors };
    }

    const validatedData = validation.value;
    
    await db("budgets")
      .where({ projet_id })
      .update({
        ...validatedData,
        updated_at: new Date()
      });
    
    const updatedBudget = await db("budgets")
      .where({ projet_id })
      .first();

    return {
      success: true,
      data: updatedBudget
    };

  } catch (error) {
    console.error("createBudget error", error);
    return {
      success: false,
      error: error.message
    };
  }
}


export async function configureBudget(projet_id, budgetData) {
  try {
    const {
      typeConfig,   // true = ajout / false = retrait budget
      reserveEtat,  // true = ajout / false = retrait réserve
      montant = 0,
      reserve = 0,
      type
    } = budgetData;

    const montantNum = parseFloat(montant) || 0;
    const reserveNum = parseFloat(reserve) || 0;

    // =========================
    // 🔒 TRANSACTION SÉCURISÉE
    // =========================
    const updatedBudget = await db.transaction(async (trx) => {

      // 🔒 verrouillage ligne budget
      const budget = await trx("budgets")
        .where({ projet_id })
        .forUpdate()
        .first();

      if (!budget) throw new Error("Budget introuvable");

      let new_budget_total = Number(budget.budget_total);
      let new_budget_restant = Number(budget.budget_restant);
      let new_reserve = Number(budget.reserve);

      // =========================
      // 🧠 CALCUL DU BUDGET TOTAL
      // =========================
      if (montantNum > 0) {
        if (typeConfig) {
          // ➕ AJOUT
          new_budget_total += montantNum;
          new_budget_restant += montantNum;
        } else {
          // ➖ RETRAIT
          if (montantNum > new_budget_total) throw new Error("Montant supérieur au budget total");
          new_budget_total -= montantNum;
          new_budget_restant -= montantNum;
        }
      }

      // =========================
      // 🧠 CALCUL DE LA RÉSERVE
      // =========================
      if (reserveNum > 0) {
        if (reserveEtat) {
          // ➕ AJOUT RÉSERVE
          if (new_reserve + reserveNum > new_budget_total) {
            throw new Error("La réserve dépasse le budget total");
          }
          new_reserve += reserveNum;
          new_budget_restant -= reserveNum;
        } else {
          // ➖ RETRAIT RÉSERVE
          if (reserveNum > new_reserve) {
            throw new Error("Retrait supérieur à la réserve");
          }
          new_reserve -= reserveNum;
          new_budget_restant += reserveNum;
        }
      }

      // =========================
      // 🔒 VALIDATION FINALE
      // =========================
      if (
        new_budget_total < 0 ||
        new_budget_restant < 0 ||
        new_reserve < 0 ||
        new_reserve > new_budget_total
      ) {
        throw new Error("Valeurs invalides après calcul");
      }

      // =========================
      // 💾 MISE À JOUR DU BUDGET
      // =========================
      await trx("budgets")
        .where({ projet_id })
        .update({
          type,
          budget_total: new_budget_total,
          budget_restant: new_budget_restant,
          reserve: new_reserve,
          updated_at: new Date()
        });

      // 🔁 retour budget mis à jour
      return await trx("budgets").where({ projet_id }).first();
    });

    return { success: true, data: updatedBudget };

  } catch (error) {
    console.error("configureBudget error:", error);
    return { success: false, message: error.message || "Erreur serveur" };
  }
}