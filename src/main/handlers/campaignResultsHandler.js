import db from '../database/db';
import Joi from 'joi';

/* ===============================
   SCHEMA VALIDATION RESULTATS
================================ */

const resultatsSchema = Joi.object({
  objectifs_atteints: Joi.number().min(0).max(100).allow(null),
  ventes_generees: Joi.number().min(0).allow(null),
  leads_generees: Joi.number().min(0).allow(null),
  personnes_touchees: Joi.number().min(0).allow(null),
  satisfaction: Joi.number().min(0).max(5).allow(null),
  partenaires_impliques: Joi.number().min(0).allow(null),
  engagements: Joi.number().min(0).allow(null),
  commentaires: Joi.string().allow('', null),
  photos: Joi.array().items(Joi.string()).allow(null),
  campagne_id: Joi.number().required()
});

/* ===============================
   VALIDATION
================================ */

function validateResultats(data) {
  const { error, value } = resultatsSchema.validate(data, {
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
   CREATE / UPDATE RESULTATS
================================ */

export async function saveCampaignResults(data) {
  try {
    const validation = validateResultats(data);

    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const validated = validation.value;

    // 🔹 stringify JSON (photos)
    if (Array.isArray(validated.photos)) {
      validated.photos = JSON.stringify(validated.photos);
    }

    // 🔹 vérifier si existe déjà
    const existing = await db('campagne_resultats')
      .where({ campagne_id: validated.campagne_id })
      .first();

    if (existing) {
      await db('campagne_resultats')
        .where({ campagne_id: validated.campagne_id })
        .update({
          ...validated,
          updated_at: new Date()
        });
    } else {
      await db('campagne_resultats')
        .insert({
          ...validated,
          created_at: new Date(),
          updated_at: new Date()
        });
    }

    // 🔹 recalcul KPI campagne
    await updateCampaignPerformance(validated.campagne_id);

    const updated = await getCampaignResults(validated.campagne_id);

    return { success: true, data: updated.data };

  } catch (error) {
    console.error("Erreur saveCampaignResults:", error);
    return { success: false, error: error.message };
  }
}

/* ===============================
   GET RESULTATS
================================ */

export async function getCampaignResults(campagne_id) {
  try {
    const resultats = await db('campagne_resultats')
      .where({ campagne_id })
      .first();

    if (!resultats) {
      return { success: true, data: null };
    }

    // 🔹 parse JSON photos
    if (resultats.photos) {
      try {
        resultats.photos = JSON.parse(resultats.photos);
      } catch {
        resultats.photos = [];
      }
    }

    return { success: true, data: resultats };

  } catch (error) {
    console.error("Erreur getCampaignResults:", error);
    return { success: false, error: error.message };
  }
}

/* ===============================
   DELETE RESULTATS
================================ */

export async function deleteCampaignResults(campagne_id) {
  try {
    await db('campagne_resultats')
      .where({ campagne_id })
      .delete();

    return { success: true };

  } catch (error) {
    console.error("Erreur deleteCampaignResults:", error);
    return { success: false, error: error.message };
  }
}

/* ===============================
   CALCUL PERFORMANCE CAMPAGNE
================================ */

export async function updateCampaignPerformance(campagne_id) {
  try {
    const campagne = await db('campagnes')
      .where({ campagne_id })
      .first();

    const resultats = await db('campagne_resultats')
      .where({ campagne_id })
      .first();

    if (!campagne || !resultats) return;

    let roi = null;

    if (resultats.ventes_generees && campagne.cout) {
      const benefice = resultats.ventes_generees * 50000; // ⚠️ logique métier
      roi = ((benefice - campagne.cout) / campagne.cout) * 100;
    }

    let cout_par_lead = null;

    if (resultats.leads_generees && campagne.cout) {
      cout_par_lead = campagne.cout / resultats.leads_generees;
    }

    await db('campagnes')
      .where({ campagne_id })
      .update({
        roi: roi,
        cout_par_lead: cout_par_lead,
        updated_at: new Date()
      });

  } catch (error) {
    console.error("Erreur updateCampaignPerformance:", error);
  }
}