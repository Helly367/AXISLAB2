import db from "../database/db.js";
import { membreSchema, normalizeMembreData } from "../database/schemas/membreSchema.js";

function formatMembre(membre) {
  if (!membre) return null;

  return {
    membre_id: membre.membre_id,
    nom: membre.nom,
    poste: membre.poste,
    role: membre.role,
    email: membre.email,
    photo: membre.photo,
    disponibilite: membre.disponibilite,
    chargeMax: membre.chargeMax,
    chargeActuelle: membre.chargeActuelle,
    competences: JSON.parse(membre.competences || "[]"),
    competencesRequises: JSON.parse(membre.competencesRequises || "[]"),
    dateDebut: membre.dateDebut,
    historique: JSON.parse(membre.historique || "[]"),
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
      competences_requises: JSON.stringify(value.competences_requises),
      historique: JSON.stringify(value.historique),

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

    const cleaned = normalizeMembreData(updateData);

    const { error, value } = membreSchema.validate(cleaned, {
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
        competences_requises: JSON.stringify(value.competences_requises),
        historique: JSON.stringify(value.historique),

        updated_at: new Date()
      });

    const membre = await db("membres")
      .where({ membre_id: membreId })
      .first();

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


import { ipcMain } from "electron";
import {
  createMembre,
  getAllMembres,
  getMembreById,
  updateMembre,
  deleteMembre
} from "../handlers/membreHandler.js";

ipcMain.handle("membre:create", (_, data) => createMembre(data));

ipcMain.handle("membre:getAll", () => getAllMembres());

ipcMain.handle("membre:getById", (_, id) => getMembreById(id));

ipcMain.handle("membre:update", (_, id, data) => updateMembre(id, data));

ipcMain.handle("membre:delete", (_, id) => deleteMembre(id));