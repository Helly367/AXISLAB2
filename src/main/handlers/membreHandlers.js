import db from "../database/db.js";
import { membreSchema,normalizeMembreData } from "../database/schemas/membreSchema.js";

function formatMembre(membre) {
  if (!membre) return null;

  return {
    membre_id: membre.membre_id,
    nomComplet: membre.nomComplet,
    poste: membre.poste,
    role: membre.role,
    email: membre.email,
    telephone: membre.telephone,
    niveau_etude: membre.niveau_etude,
    sexe: membre.sexe,
    project_id : membre.project_id,
    competences: JSON.parse(membre.competences || "[]"),
    created_at: membre.created_at,
    updated_at: membre.updated_at
  };
}

export async function createMembre(data) {

  try {

    const cleaned = normalizeMembreData(data);

    const { error, value } = membreSchema.validate(cleaned, {
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

    const [membre_id] = await db("membres").insert({

      ...value,
      competences: JSON.stringify(value.competences),
      created_at: new Date(),
      updated_at: new Date()
    });

    const membre = await db("membres")
      .where({ membre_id })
      .first();

    return {
      success: true,
      data: formatMembre(membre)
    };

  } catch (error) {

    console.error("Erreur createMembre:", error);

    return {
      success: false,
      error: error.message
    };
  }
}


export async function getAllMembres() {

  try {

    const membres = await db("membres")
      .select("*")
      .orderBy("created_at", "desc");
    
    return {
      success: true,
      data: membres.map(formatMembre)
    };

  } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
}


export async function getMembreById(id) {

  try {

    const membre = await db("membres")
      .where({ membre_id: id })
      .first();

    if (!membre) {

      return {
        success: false,
        error: "Membre non trouvé"
      };
    }

    return {
      success: true,
      data: formatMembre(membre)
    };

  } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
}


export async function updateMembre(membreId, updateData) {

  try {

    const {
      membre_id,
      created_at,
      updated_at,
      ...cleanData
    } = updateData;

    const { error, value } = membreSchema.validate(cleanData, {
      abortEarly: false,
      stripUnknown: true
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

    await db("membres")
      .where({ membre_id: membreId })
      .update({

        ...value,
        competences: JSON.stringify(value.competences),
        updated_at: new Date()
      });

    const membre = await db("membres")
      .where({ membre_id: membreId })
      .first();
    
    console.log(membre);
    

    return {
      success: true,
      data: formatMembre(membre)
    };

  } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
}


export async function deleteMembre(membreId) {

  try {

    await db("membres")
      .where({ membre_id: membreId })
      .del();

    return {
      success: true,
      data: { membre_id: membreId }
    };

  } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
}



