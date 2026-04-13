import db from "../database/db.js";
import { phaseSchema, normalizePhaseData, normalizePhaseDataUpdate } from "../database/schemas/phaseSchema.js";

function formatPhase(phase) {
  if (!phase) return null;
  return {
    ...phase,
    taches: JSON.parse(phase.taches || "[]"),
    membres: JSON.parse(phase.membres || "[]")
  };
}

function validatePhase(data, isCreate) {
  const { error, value } = phaseSchema(isCreate).validate(data, {
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

export async function createPhase34(data) {
  try {
    const cleaned = normalizePhaseData(data);
    const validation = validateProject(cleaned, true);
    if (!validation.isValid) return { success: false, error: validation.errors };

    const validatedData = validation.value;
    if (!validatedData.projet_id) return { success: false, error: "projet_id requis" };

    const budget = await db("budgets").where({ projet_id: validatedData.projet_id }).first();
    if (!budget) return { success: false, error: "Budget du projet introuvable" };

    const budget_phase = Number(validatedData.budget_phase) || 0;
    if (budget_phase < 0) return { success: false, error: "Le budget de la phase ne peut pas être négatif" };
    if (budget_phase > budget.budget_restant) {
      return {
        success: false,
        error: `Votre budget est insuffisant pour créer une nouvelle phase. Restant: ${budget.budget_restant} ${budget.devise}`
      };
    }

    const insertData = {
      ...validatedData,
      taches: JSON.stringify(validatedData.taches || []),
      membres: JSON.stringify(validatedData.membres || []),
      created_at: new Date(),
      updated_at: new Date()
    };

    const [phase_id] = await db.transaction(async (trx) => {
      const [id] = await trx("phases").insert(insertData);
      await trx("budgets").where({ projet_id: validatedData.projet_id }).update({
        budget_depense: Number(budget.budget_depense) + budget_phase,
        budget_restant: Number(budget.budget_restant) - budget_phase,
        updated_at: new Date()
      });
      return [id];
    });

    const [updatedBudget, phase] = await Promise.all([
      db("budgets").where({ projet_id: validatedData.projet_id }).first(),
      db("phases").where({ phase_id }).first()
    ]);

    return { success: true, data: { budget: updatedBudget, phase: formatPhase(phase) } };
  } catch (error) {
    console.error("Erreur createPhase:", error);
    return { success: false, error: error.message || "Erreur lors de la création de la phase" };
  }
}


export async function createPhase(data) {
  try {
    const cleaned = normalizePhaseData(data);
    const validation = validatePhase(cleaned, true);

    if (!validation.isValid) {
      return { success: false, error: validation.errors };
    }

    const validatedData = validation.value;

    if (!validatedData.projet_id) {
      return { success: false, error: "projet_id requis" };
    }

    const budget_phase = Number(validatedData.budget_phase) || 0;

    const insertData = {
      ...validatedData,
      taches: JSON.stringify(validatedData.taches || []),
      membres: JSON.stringify(validatedData.membres || []),
      created_at: new Date(),
      updated_at: new Date()
    };

    const phase_id = await db.transaction(async (trx) => {

      const budget = await trx("budgets")
        .where({ projet_id: validatedData.projet_id })
        .forUpdate()
        .first();

      if (!budget) throw new Error("Budget introuvable");

      if (budget_phase > budget.budget_restant) {
        throw new Error(
          `Budget insuffisant. Restant: ${budget.budget_restant} ${budget.devise}`
        );
      }

      const [id] = await trx("phases").insert(insertData);

      await trx("budgets")
        .where({ projet_id: validatedData.projet_id })
        .update({
          budget_depense: Number(budget.budget_depense) + budget_phase,
          budget_restant: Number(budget.budget_restant) - budget_phase,
          updated_at: new Date()
        });

      return id;
    });

    const [updatedBudget, phase] = await Promise.all([
      db("budgets").where({ projet_id: validatedData.projet_id }).first(),
      db("phases").where({ phase_id }).first()
    ]);

    return {
      success: true,
      data: {
        budget: updatedBudget,
        phase: formatPhase(phase)
      }
    };

  } catch (error) {
    console.error("Erreur createPhase:", error);

    return {
      success: false,
      error: error.message || "Erreur lors de la création de la phase"
    };
  }
}

export async function updatePhase(projet_id, data) {
  
     console.log("phase Budeget " , data.budget_phase);
     
  
  try {
    const phase_id = data?.phase_id;
    if (!projet_id) return { success: false, error: "projet_id est requis" };
    if (!phase_id) return { success: false, error: "phase_id est requis" };

    const existingPhase = await db("phases").where({ projet_id ,phase_id }).first();
    if (!existingPhase) return { success: false, error: "Phase introuvable" };

    const cleaned = normalizePhaseDataUpdate(data, projet_id);
    if (!cleaned) return { success: false, error: "Données invalides" };

    const validation = validatePhase(cleaned, false);
    if (!validation.isValid) return { success: false, error: validation.errors };

    const updateData = {};
    const jsonFields = ["taches", "membres"];
    for (const [key, value] of Object.entries(cleaned)) {
      if (value !== undefined && !["phase_id", "projet_id"].includes(key)) {
        updateData[key] = jsonFields.includes(key) ? JSON.stringify(value) : value;
      }
    }

    let budget_phase = updateData.budget_phase ;
    let budgetUpdated = updateData.budget_phase !== 0;
    console.log("budget_phase", budget_phase);
    console.log("budgetUpdated" , budgetUpdated);
    

    const result = await db.transaction(async (trx) => {
      // Lock phase
      const phase = await trx("phases").where({ projet_id , phase_id }).forUpdate().first();
      if (!phase) throw new Error("Phase introuvable");

      // Update phase
      if (Object.keys(updateData).length > 0) {
        const updateFields = {
          ...updateData,
          updated_at: new Date()
        };
        
         
      if (updateData.budget_phase !== 0) {
          updateFields.budget_phase = Number(phase.budget_phase) + budget_phase;
          updateFields.budget_restant = Number(phase.budget_restant) + budget_phase;
        
      } else {
        updateFields.budget_phase = Number(phase.budget_phase);
      }
        
     
        await trx("phases").where({ projet_id , phase_id }).update(updateFields);
      } 

      let updatedBudget = null;
      if (budgetUpdated) {
        const budget = await trx("budgets").where({ projet_id }).forUpdate().first();
        
        if (!budget) throw new Error("Budget du projet introuvable");

        const newBudgetRestant = Number(budget.budget_restant) - budget_phase;
        if (newBudgetRestant < 0) {
          return {
            success: false,
            message : `Budget insuffisant. Restant: ${budget.budget_restant}`
          };
        }
          
        await trx("budgets").where({ projet_id }).update({
          budget_depense: Number(budget.budget_depense) + budget_phase,
          budget_restant: newBudgetRestant,
          updated_at: new Date()
        });

        updatedBudget = await trx("budgets").where({ projet_id }).first();
      }

      const updatedPhase = await trx("phases").where({ projet_id , phase_id }).first();
      return { updatedPhase, updatedBudget };
    });
    
    console.log("updatedPhase", result.updatedPhase);
    console.log("updatedBudget" , result.updatedBudget);
    
    

    return {
      success: true,
      data: {
        phase: formatPhase(result.updatedPhase),
        budget: result.updatedBudget
      }
    };
  } catch (error) {
    console.error("Erreur updatePhase:", error);
    return { success: false, error: error.message || "Erreur lors de la mise à jour de la phase" };
  }
}

export async function getAllPhases() {
  try {
    const phases = await db("phases").select("*").orderBy("created_at", "desc");
    return { success: true, data: phases.map(formatPhase) };
  } catch (error) {
    return { success: false, error: error.message };
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

export async function deletePhase(projet_id , phaseId) {
  try {
    
    const phase = await db("phases").where({ projet_id, phase_id: phaseId }).first();
    if (!phase) return { success: false, error: "Phase non trouvée" };
    const budget_phase = Number(phase.budget_phase);
    
    await db.transaction(async (trx) => {
      
      const budget = await trx("budgets").where({ projet_id }).first();
      if (!budget) return { success: false, error: "budget non trouvée" };
      
      let budget_total = Number(budget.budget_total);
      let budget_depense = Number(budget.budget_depense);
     
      budget_total += budget_phase;
      budget_depense -= budget_phase;
      let budget_restant = budget_total - budget_depense
      
      const updateBudget = {
        budget_total: budget_total,
        budget_depense: budget_depense,
        budget_restant : budget_restant
        
      }
      
      await trx("budgets").where({ projet_id: projet_id })
        .update({
          ...updateBudget,
          updated_at: new Date()
        });
      
      await trx("phases").where({ projet_id, phase_id : phaseId}).del();
      
    });
    
     const [updatedPhase, updatedBudget] = await Promise.all([
       db("phases").where({ projet_id ,phase_id : phaseId }).first(),
       db("budgets").where({ projet_id }).first()
     ]);
    
    
    
    return {
      success: true,
      data: {
        updatedPhase ,
        updatedBudget,
        phase_id : phaseId
      }
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}