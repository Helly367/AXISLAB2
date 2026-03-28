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

// export async function updatePhase(projet_id, data) {
//   try {
//     const phase_id = data?.phase_id;
    
//     if (!projet_id) return { success: false, error: "projet_id est requis" };
//     if (!phase_id) return { success: false, error: "phase_id est requis" };

//     const existingPhase = await db("phases").where({ phase_id }).first();
//     if (!existingPhase) return { success: false, error: "Phase introuvable" };

//     const cleaned = normalizePhaseDataUpdate(data, projet_id);
//     if (!cleaned) return { success: false, error: "Données invalides" };

//     const validation = validateProject(cleaned, false);
//     if (!validation.isValid) return { success: false, error: validation.errors };

//     const updateData = {};
//     for (const [key, value] of Object.entries(cleaned)) {
//       if (value !== undefined && key !== 'phase_id' && key !== 'projet_id') {
//         updateData[key] = (key === 'taches' || key === 'membres') ? JSON.stringify(value) : value;
//       }
//     }

//     if (Object.keys(updateData).length === 0 && data.budget_phase === undefined) {
//       return { success: true, data: { phase: formatPhase(existingPhase), budget: null } };
//     }

//     let budget_phase = updateData.budget_phase !== undefined ? Number(updateData.budget_phase) : undefined;
//     let budgetUpdated = false;

//     await db.transaction(async (trx) => {
//       if (Object.keys(updateData).length > 0) {
//         const updateFields = { ...updateData, updated_at: new Date() };
//         if (budget_phase > 0) {
//           updateFields.budget_phase = Number(existingPhase.budget_phase) + budget_phase;
//           updateFields.budget_restant = Number(existingPhase.budget_restant) + budget_phase;
//           budgetUpdated = true;
//         }
//         await trx("phases").where({ phase_id }).update(updateFields);
//       }

//       if (budgetUpdated && budget_phase > 0) {
//         const budget = await trx("budgets").where({ projet_id: existingPhase.projet_id }).first();
//         if (!budget) throw new Error("Budget du projet introuvable");

//         const newBudgetRestant = Number(budget.budget_restant) - budget_phase;
//         if (newBudgetRestant < 0) throw new Error(`Budget insuffisant. Restant: ${budget.budget_restant}`);

//         await trx("budgets").where({ projet_id: existingPhase.projet_id }).update({
//           budget_depense: Number(budget.budget_depense) + budget_phase,
//           budget_restant: newBudgetRestant,
//           updated_at: new Date()
//         });
//       }
//     });

//     const [updatedPhase, updatedBudget] = await Promise.all([
//       db("phases").where({ phase_id }).first(),
//       budgetUpdated ? db("budgets").where({ projet_id: existingPhase.projet_id }).first() : Promise.resolve(null)
//     ]);

//     return { success: true, data: { phase: formatPhase(updatedPhase), budget: updatedBudget } };
//   } catch (error) {
//     console.error("Erreur updatePhase:", error);
//     return { success: false, error: error.message || "Erreur lors de la mise à jour de la phase" };
//   }
// }



// export async function getPhaseById(id) {
//   try {
//     const phase = await db("phases").where({ phase_id: id }).first();
//     if (!phase) return { success: false, error: "Phase non trouvée" };
//     return { success: true, data: formatPhase(phase) };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// }

// export async function deletePhase(projet_id , phaseId) {
//   try {
    
//     const phase = await db("phases").where({ phase_id: phaseId }).first();
//     if (!phase) return { success: false, error: "Phase non trouvée" };
//     const budget_phase = Number(phase.budget_phase);
    
//     await db.transaction(async (trx) => {
      
//       const budget = await trx("budgets").where({ projet_id }).first();
//       if (!budget) return { success: false, error: "budget non trouvée" };
      
//       let budget_total = Number(budget.budget_total);
//       let budget_depense = Number(budget.budget_depense);
     
//       budget_total += budget_phase;
//       budget_depense -= budget_phase;
//       let budget_restant = budget_total - budget_depense
      
//       const updateBudget = {
//         budget_total: budget_total,
//         budget_depense: budget_depense,
//         budget_restant : budget_restant
        
//       }
      
//       await trx("budgets").where({ projet_id: projet_id })
//         .update({
//           ...updateBudget,
//           updated_at: new Date()
//         });
      
//       await trx("phases").where({ projet_id, phase_id : phaseId}).del();
      
//     });
    
//      const [updatedPhase, updatedBudget] = await Promise.all([
//        db("phases").where({ projet_id ,phase_id : phaseId }).first(),
//        db("budgets").where({ projet_id }).first()
//      ]);
    
    
    
//     return {
//       success: true,
//       data: {
//         updatedPhase ,
//         updatedBudget,
//         phase_id : phaseId
//       }
//     };
//   } catch (error) {
//     return { success: false, error: error.message };
//   }
// }