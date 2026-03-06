import db from "../database/db.js";
import { phaseSchema, normalizePhaseData , normalizePhaseDataUpdate } from "../database/schemas/phaseSchema.js";

function formatPhase(phase) {

  if (!phase) return null;

  return {
    ...phase,
    taches: JSON.parse(phase.taches || "[]"),
    membres: JSON.parse(phase.membres || "[]")
  };
}

export async function createPhase(data) {

  try {

    const cleaned = normalizePhaseData(data);

    const { error, value } = phaseSchema.validate(cleaned, {
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

    const [phase_id] = await db("phases").insert({
      ...value,
      taches: JSON.stringify(value.taches),
      membres: JSON.stringify(value.membres),
      created_at: new Date(),
      updated_at: new Date()
    });

    const phase = await db("phases")
      .where({ phase_id })
      .first();

    return {
      success: true,
      data: formatPhase(phase)
    };

  } catch (error) {

    console.error("Erreur createPhase:", error);

    return {
      success: false,
      error: error.message
    };
  }
}

export async function updatePhase(id, data) {

  try {

    const cleaned = normalizePhaseDataUpdate(data);

    const { error, value } = phaseSchema.validate(cleaned, {
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

    await db("phases")
      .where({ phase_id: id })
      .update({
        ...value,
        taches: JSON.stringify(value.taches),
        membres: JSON.stringify(value.membres),
        updated_at: new Date()
      });

    const phase = await db("phases")
      .where({ phase_id: id })
      .first();

    return {
      success: true,
      data: formatPhase(phase)
    };

  } catch (error) {

    console.error("Erreur updatePhase:", error);

    return {
      success: false,
      error: error.message
    };
  }
}

export async function getAllPhases() {

  try {

    const phases = await db("phases")
      .select("*")
      .orderBy("created_at", "desc");

    return {
      success: true,
      data: phases.map(formatPhase)
    };

  } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
}

export async function getPhaseById(id) {

  try {

    const phase = await db("phases")
      .where({ phase_id: id })
      .first();

    if (!phase) {
      return {
        success: false,
        error: "Phase non trouvée"
      };
    }

    return {
      success: true,
      data: formatPhase(phase)
    };

  } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
}

export async function deletePhase(id) {

  try {

    await db("phases")
      .where({ phase_id: id })
      .del();

    return {
      success: true
    };

  } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
}