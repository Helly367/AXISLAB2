import db from "../database/db.js";
import { materielSchema , normalizeMaterielData } from "../database/schemas/materielSchema.js";

function formatMateriel(materiel) {
    if (!materiel) return null;
    
  return {
    ...materiel,
  };
}

function formatPhase(phase) {
  if (!phase) return null;
  return {
    ...phase,
    taches: JSON.parse(phase.taches || "[]"),
    membres: JSON.parse(phase.membres || "[]")
  };
}

function validateMateriel(data, isCreate) {
  const { error, value } = materielSchema(isCreate).validate(data, {
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


export async function loadAllMateriels(projet_id) {
    try {
      
        const materiels = await db("materiels")
            .select("*")
            .where({ projet_id })
            .orderBy("created_at", "desc");
        
        return {
            success: true,
            data: materiels.map(formatMateriel)
        };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function createMateriel(data) {
  try {
    
    const cleaned = normalizeMaterielData(data);
    const validation = validateMateriel(cleaned, true);
    if (!validation.isValid) return { success: false, error: validation.errors };

    const validatedData = validation.value;
    if (!validatedData.projet_id) {
      return { success: false, error: "projet_id requis" };
    }

    const projet_id = validatedData.projet_id;
    const phase_id = validatedData.phase_id;
    const prixMateriel = Number(validatedData.prix) * Number(validatedData.quantite || 1);

    const insertData = {
      ...validatedData,
      created_at: new Date(),
      updated_at: new Date()
    };

    const materiel_id = await db.transaction(async (trx) => {

      const phase = await trx("phases")
        .where({ projet_id, phase_id })
        .forUpdate()
        .first();

      if (!phase) throw new Error("phase introuvable");

      if (prixMateriel > phase.budget_restant) {
        throw new Error("Budget insuffisant pour cette phase");
      }

      const [id] = await trx("materiels").insert(insertData);

      await trx("phases")
        .where({ projet_id, phase_id })
        .update({
          budget_restant: Number(phase.budget_restant) - prixMateriel,
          budget_consomme: Number(phase.budget_consomme) + prixMateriel,
          updated_at: new Date()
        });

      return id;
    });

    const [materiel, updatedPhase] = await Promise.all([
      db("materiels").where({ projet_id, materiel_id }).first(),
      db("phases").where({ projet_id, phase_id }).first()
    ]);

    return {
      success: true,
      data: {
        materiel: formatMateriel(materiel),
        phase: formatPhase(updatedPhase)
      }
    };

  } catch (error) {
    console.error("Erreur createMateriel:", error);
    return {
      success: false,
      error: error.message || "Erreur lors de la création"
    };
  }
}

export async function updateMateriel(projet_id, data) {
  try {
    const materiel_id = data.materiel_id;
    const phase_id = data.phase_id;
    
    if (!projet_id || !materiel_id || !phase_id) {
      return {
        success: false,
        error: "projet_id, materiel_id et phase_id sont requis"
      };
    }
     
    const cleaned = normalizeMaterielData(data);
    const validation = validateMateriel(cleaned, false);
    if (!validation.isValid) return { success: false, error: validation.errors };

    const validatedData = validation.value;
    const newPrixMateriel = Number(validatedData.prix) * Number(validatedData.quantite || 1);
    
    const insertData = {
      ...validatedData,
      updated_at: new Date()
    };
    
    await db.transaction(async (trx) => {
      const materiel = await trx("materiels").where({ projet_id, materiel_id }).forUpdate().first();
      const phase = await trx("phases").where({ projet_id, phase_id }).forUpdate().first();

      if (!phase) throw new Error("phase introuvable");
      if (!materiel) throw new Error("materiel introuvable");

      const prixMaterielActuel = Number(materiel.prix) * Number(materiel.quantite || 0);
      const difference = newPrixMateriel - prixMaterielActuel;

      // Vérifier le budget uniquement si le nouveau prix est plus élevé
      if (difference > 0 && difference > phase.budget_restant) {
        throw new Error("Budget insuffisant pour cette modification");
      }

      // Mise à jour des budgets
      const budget_restant = Number(phase.budget_restant) - difference;
      const budget_consomme = Number(phase.budget_consomme) + difference;

      await trx("materiels")
        .where({ projet_id, materiel_id })
        .update(insertData);

      await trx("phases")
        .where({ projet_id, phase_id })
        .update({
          budget_restant: budget_restant,
          budget_consomme: budget_consomme,
          updated_at: new Date()
        });
    });
    
    const [materiel, updatedPhase] = await Promise.all([
      db("materiels").where({ projet_id, materiel_id }).first(),
      db("phases").where({ projet_id, phase_id }).first()
    ]);

    return {
      success: true,
      data: {
        materiel: formatMateriel(materiel),
        phase: formatPhase(updatedPhase)
      }
    };

  } catch (error) {
    console.error("Erreur updateMateriel:", error);
    return { success: false, error: error.message || "Erreur lors de la mise à jour du matériel" };
  }
}



export async function getPhaseById(id) {
  try {
    const phase = await db("phases").where({ phase_id: id }).first();
    if (!phase) return { success: false, error: "Phase non trouvée" };
    return { success: true, data: formatPhase(phase) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteMateriel(projet_id, materiel_id , phase_id) {
  
      if (!projet_id || !materiel_id || !phase_id) {
      return {
        success: false,
        error: "projet_id , phase_id et materiel_id sont requis"
      };
    }
  try {
    
    await db.transaction(async (trx) => {
      
      const materiel = await trx("materiels").where({ projet_id, materiel_id }).forUpdate().first();
        const phase = await trx("phases").where({ projet_id, phase_id }).forUpdate().first();
      
        if (!materiel) throw new Error("materiel introuvable");
        if (!phase) throw new Error("materiel phase");

        const prixMaterielActuel = Number(materiel.prix) * Number(materiel.quantite || 0);
        
        // Mise à jour des budgets
        const budget_restant = Number(phase.budget_restant) + prixMaterielActuel;
        const budget_consomme = Number(phase.budget_consomme) + prixMaterielActuel;
        
        await trx("phases")
            .where({ projet_id, phase_id })
            .update({
              budget_restant: budget_restant,
              budget_consomme: budget_consomme,
              updated_at: new Date()
        });
        
        await trx("materiels").where({ projet_id, materiel_id }).del();
    });


    const [materiel, updatedPhase] = await Promise.all([
      db("materiels").where({ projet_id, materiel_id }).first(),
      db("phases").where({ projet_id, phase_id }).first()
    ]);

    
      return {
        success: true,
        data: {
          materiel: materiel ,
          phase: updatedPhase,
          materiel_id : materiel_id
        }
      };
  } catch (error) {
    return { success: false, error: error.message };
  }
}