import db from "../database/db.js";
import { budgetSchema, normalizeBudgetData } from "../database/schemas/budgetSchema.js";

const CATEGORIES = {
  phasesBudget: "Phases",
  materielsBudget: "Matériels",
  campagnesBudget: "Campagnes"
};

function formatBudget(budget, categories = []) {
  const result = { ...budget };

  Object.entries(CATEGORIES).forEach(([key, label]) => {
    result[key] =
      categories.find(c => c.categorie === label)?.montant || 0;
  });

  return result;
}

export async function createGlobalBudget(data) {
  try {
    const cleaned = normalizeBudgetData(data);

    const { error, value } = budgetSchema.validate(cleaned, {
      abortEarly: false
    });

    if (error) {
      return {
        success: false,
        errors: error.details.map(e => ({
          field: e.path[0],
          message: e.message
        }))
      };
    }

    const now = new Date();

    // Création du budget
    const [budget_id] = await db("budgets").insert({
      project_id: value.project_id,
      type: value.type,
      montant_total: value.montant_total,
      devise: value.devise,
      reserve: value.reserve || 0,
      created_at: now,
      updated_at: now
    });

    // Création automatique des catégories
    const categories = Object.entries(CATEGORIES)
      .filter(([key]) => value[key] > 0)
      .map(([key, label]) => ({
        budget_id,
        categorie: label,
        montant: value[key],
        created_at: now,
        updated_at: now
      }));

    if (categories.length) {
      await db("budget_categories").insert(categories);
    }

    const budget = await db("budgets")
      .where({ budget_id })
      .first();

    const budgetCategories = await db("budget_categories")
      .where({ budget_id });

    return {
      success: true,
      data: formatBudget(budget, budgetCategories)
    };

  } catch (error) {
    console.error("createBudget error", error);
    return {
      success: false,
      error: error.message
    };
  }
}

export async function getBudgetByProject(projectId) {
  try {
    const budget = await db("budgets")
      .where({ project_id: projectId })
      .first();

    if (!budget) {
      return { success: false, error: "Budget non trouvé" };
    }

    const categories = await db("budget_categories")
      .where({ budget_id: budget.budget_id });

    const depenses = await db("depenses")
      .where({ budget_id: budget.budget_id });

    const justificatifs = depenses.length
      ? await db("justificatifs")
          .whereIn(
            "depense_id",
            depenses.map(d => d.depense_id)
          )
      : [];

    return {
      success: true,
      data: {
        ...formatBudget(budget, categories),
        depenses,
        justificatifs
      }
    };

  } catch (error) {
    console.error("getBudgetByProject error", error);
    return {
      success: false,
      error: error.message
    };
  }
}