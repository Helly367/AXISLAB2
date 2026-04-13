import db from '../database/db';
import Joi from 'joi';

/* ===============================
   SCHEMA VALIDATION DEPENSE
================================ */

const depenseSchema = Joi.object({
  poste: Joi.string().min(2).required(),
  montant: Joi.number().positive().required(),
  date: Joi.date().required(),
  campagne_id: Joi.number().required()
});

/* ===============================
   VALIDATION
================================ */

function validateDepense(data) {
  const { error, value } = depenseSchema.validate(data, {
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

  return { isValid: true, value };
}

/* ===============================
   AJOUT DEPENSE
================================ */

export async function addDepense(depenseData) {
  try {
    const validation = validateDepense(depenseData);

    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const validated = validation.value;

    const [depense_id] = await db('depenses').insert({
      ...validated,
      created_at: new Date(),
      updated_at: new Date()
    });

    // 🔹 recalcul budget campagne
    await recalculateCampaignBudget(validated.campagne_id);

    const newDepense = await db('depenses')
      .where({ depense_id })
      .first();

    return { success: true, data: newDepense };

  } catch (error) {
    console.error("Erreur addDepense:", error);
    return { success: false, error: error.message };
  }
}

/* ===============================
   DELETE DEPENSE
================================ */

export async function deleteDepense(depense_id, campagne_id) {
  try {
    await db('depenses')
      .where({ depense_id })
      .delete();

    await recalculateCampaignBudget(campagne_id);

    return { success: true };

  } catch (error) {
    console.error("Erreur deleteDepense:", error);
    return { success: false, error: error.message };
  }
}

/* ===============================
   GET DEPENSES PAR CAMPAGNE
================================ */

export async function getDepensesByCampagne(campagne_id) {
  try {
    const depenses = await db('depenses')
      .where({ campagne_id })
      .orderBy('date', 'desc');

    return { success: true, data: depenses };

  } catch (error) {
    console.error("Erreur getDepensesByCampagne:", error);
    return { success: false, error: error.message };
  }
}

/* ===============================
   RECALCUL BUDGET CAMPAGNE
================================ */

export async function recalculateCampaignBudget(campagne_id) {
  try {
    const depenses = await db('depenses')
      .where({ campagne_id });

    const totalDepenses = depenses.reduce((sum, d) => sum + d.montant, 0);

    const campagne = await db('campagnes')
      .where({ campagne_id })
      .first();

    const budgetRestant = campagne.budgetAlloue - totalDepenses;

    await db('campagnes')
      .where({ campagne_id })
      .update({
        cout: totalDepenses,
        budget_restant: budgetRestant,
        updated_at: new Date()
      });

  } catch (error) {
    console.error("Erreur recalcul budget:", error);
  }
}

/* ===============================
   GET CAMPAGNE AVEC BUDGET
================================ */

export async function getCampaignBudget(campagne_id) {
  try {
    const campagne = await db('campagnes')
      .where({ campagne_id })
      .first();

    if (!campagne) {
      return { success: false, error: "Campagne non trouvée" };
    }

    const depenses = await db('depenses')
      .where({ campagne_id });

    const totalDepenses = depenses.reduce((sum, d) => sum + d.montant, 0);

    const budgetRestant = campagne.budgetAlloue - totalDepenses;

    return {
      success: true,
      data: {
        campagne,
        depenses,
        totalDepenses,
        budgetRestant
      }
    };

  } catch (error) {
    console.error("Erreur getCampaignBudget:", error);
    return { success: false, error: error.message };
  }
}

/* ===============================
   UPDATE BUDGET CAMPAGNE
================================ */

export async function updateCampaignBudget(campagne_id, data) {
  try {
    const { budgetAlloue } = data;

    if (!budgetAlloue || budgetAlloue <= 0) {
      return {
        success: false,
        errors: [{ field: "budgetAlloue", message: "Budget invalide" }]
      };
    }

    await db('campagnes')
      .where({ campagne_id })
      .update({
        budgetAlloue,
        updated_at: new Date()
      });

    await recalculateCampaignBudget(campagne_id);

    const updated = await db('campagnes')
      .where({ campagne_id })
      .first();

    return { success: true, data: updated };

  } catch (error) {
    console.error("Erreur updateCampaignBudget:", error);
    return { success: false, error: error.message };
  }
}