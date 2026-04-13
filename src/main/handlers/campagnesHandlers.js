import db from "../database/db.js";
import { campagnesSchema, normalizeData, etapeSchema } from "../database/schemas/campagneSchema.js";
import {randomUUID} from "crypto"

function formatCampagne(campagne) {
  if (!campagne) return null;

  return {
    ...campagne,

    planification:
      typeof campagne.planification === "string"
        ? JSON.parse(campagne.planification || "{}")
        : campagne.planification || {},

    resultats:
      typeof campagne.resultats === "string"
        ? JSON.parse(campagne.resultats || "{}")
        : campagne.resultats || {}
  };
}

function validateCampagne(data, isCreate) {
  const { error, value } = campagnesSchema(isCreate).validate(data, {
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


export async function createCampagne(data) {
  try {
    const cleaned = normalizeData(data);
    const validation = validateCampagne(cleaned, true);

    if (!validation.isValid) {
      return { success: false, error: validation.errors };
    }

    const validatedData = validation.value;

    if (!validatedData.projet_id) {
      return { success: false, error: "projet_id requis" };
      }
      
    const projet_id =  validatedData.projet_id

   
    const insertData = {
        ...validatedData,
        cout: Number(validatedData.cout),

        planification: validatedData.planification || {
            type: "continue",
            etapes: [],
            canaux: [],
            formateurs: []
        },
        resultats: validatedData.resultats || {},
        created_at: new Date(),
        updated_at: new Date()
    };

    const campagne_id = await db.transaction(async (trx) => {

        const budget = await trx("budgets").where({ projet_id }).forUpdate().first();
        if (!budget) throw new Error("Budget introuvable");
        
        const cout = Number(validatedData.cout);
        
        if (cout > budget.budget_restant) {
            throw new Error(
            `Budget insuffisant. Restant: ${budget.budget_restant} ${budget.devise}`
            );
        }
        const [id] = await trx("campagnes").insert(insertData);

      await trx("budgets")
        .where({ projet_id })
        .update({
          budget_depense: Number(budget.budget_depense) + cout,
          budget_restant: Number(budget.budget_restant) - cout,
          updated_at: new Date()
        });

      return id;
    });

    const [updatedBudget, campagne] = await Promise.all([
      db("budgets").where({ projet_id }).first(),
      db("campagnes").where({projet_id ,  campagne_id }).first()
    ]);

    return {
      success: true,
      data: {
        budget: updatedBudget,
        campagne: formatCampagne(campagne)
      }
    };

  } catch (error) {
    console.error("Erreur createPhase:", error);

    return {
      success: false,
      error: error.message || "Erreur lors de la création de la campagne"
    };
  }
}

// CRUD ETAPE //

export async function ajouteEtape(projet_id, campagne_id, newEtape) {
  
    console.log({
      projet_id: projet_id,
      campagne_id: campagne_id,
      newEtape : newEtape
    });
  
  try {

    if (!projet_id) throw new Error("projet_id requis");
    if (!campagne_id) throw new Error("campagne_id requis");
    if (!newEtape) throw new Error("newEtape requis");
    

    

    // 🔎 récupérer la campagne
    const campagne = await db("campagnes").where({ projet_id , campagne_id }).first();

    if (!campagne) {
      throw new Error("Campagne introuvable");
    }

    // parser planification
    let planification = typeof campagne.planification === "string"
      ? JSON.parse(campagne.planification)
      : campagne.planification;

    if (!planification) {
      planification = {
        type: "continue",
        etapes: [],
        canaux: [],
        formateurs: []
      };
    }

    let etapes = planification.etapes || [];
    
     const validation = etapeSchema.validate(newEtape);
      if (validation.error) {
        return { success: false, error: validation.error.message };
    }
    
    const validatedData = validation.value;
      
      const newItem = {
        ...validatedData,
        id: randomUUID() 
      };

      etapes.push(newItem);

    // 🔁 sauvegarde
    const updatedPlanification = {
      ...planification,
      etapes
    };

    await db("campagnes")
      .where({ projet_id })
      .update({
        planification: JSON.stringify(updatedPlanification),
        updated_at: new Date()
      });
    
    const newCampagne = await db("campagnes").where({ projet_id , campagne_id }).first();

    return {
      success: true,
      data: {
        updatedPlanification : updatedPlanification ,
        newCampagne: newCampagne,
        newEtapeF : newItem
      }
    };

  } catch (error) {
    console.error("Erreur operationEtape:", error);

    return {
      success: false,
      error: error.message
    };
  }
}


export async function updateEtape(projet_id, campagne_id, updatedEtapes) {
  
    console.log({
      projet_id: projet_id,
      campagne_id: campagne_id,
      updatedEtapes : updatedEtapes
    });
  
  try {

    if (!projet_id) throw new Error("projet_id requis");
    if (!campagne_id) throw new Error("campagne_id requis");
    if (!updatedEtapes) throw new Error("updatedEtapes requis");
    
    // 🔎 récupérer la campagne
    const campagne = await db("campagnes").where({ projet_id , campagne_id }).first();

    if (!campagne) {
      throw new Error("Campagne introuvable");
    }

    // parser planification
    let planification = typeof campagne.planification === "string"
      ? JSON.parse(campagne.planification)
      : campagne.planification;

    if (!planification) {
      planification = {
        type: "continue",
        etapes: [],
        canaux: [],
        formateurs: []
      };
    }

    // 🔁 sauvegarde
    const updatedPlanification = {
      ...planification,
      etapes : updatedEtapes
      
    };
    
    console.log("updatedPlanification" , updatedPlanification);
    

    await db("campagnes")
      .where({ projet_id })
      .update({
        planification: JSON.stringify(updatedPlanification),
        updated_at: new Date()
      });
    
    const newCampagne = await db("campagnes").where({ projet_id , campagne_id }).first();

    return {
      success: true,
      data: newCampagne,
      
    };

  } catch (error) {
    console.error("Erreur operationEtape:", error);

    return {
      success: false,
      error: error.message
    };
  }
}

export async function deleteEtape(projet_id, campagne_id, updatedEtapes) {
  
    console.log({
      projet_id: projet_id,
      campagne_id: campagne_id,
      updatedEtapes : updatedEtapes
    });
  
  try {

    if (!projet_id) throw new Error("projet_id requis");
    if (!campagne_id) throw new Error("campagne_id requis");
    if (!updatedEtapes) throw new Error("updatedEtapes requis");
    
    // 🔎 récupérer la campagne
    const campagne = await db("campagnes").where({ projet_id , campagne_id }).first();

    if (!campagne) {
      throw new Error("Campagne introuvable");
    }

    // parser planification
    let planification = typeof campagne.planification === "string"
      ? JSON.parse(campagne.planification)
      : campagne.planification;

    if (!planification) {
      planification = {
        type: "continue",
        etapes: [],
        canaux: [],
        formateurs: []
      };
    }

    // 🔁 sauvegarde
    const updatedPlanification = {
      ...planification,
      etapes : updatedEtapes
      
    };
    
    console.log("updatedPlanification" , updatedPlanification);
    

    await db("campagnes")
      .where({ projet_id })
      .update({
        planification: JSON.stringify(updatedPlanification),
        updated_at: new Date()
      });
    
    const newCampagne = await db("campagnes").where({ projet_id , campagne_id }).first();

    return {
      success: true,
      data: newCampagne,
      
    };

  } catch (error) {
    console.error("Erreur operationEtape:", error);

    return {
      success: false,
      error: error.message
    };
  }
}


// CRUD CANAL //
export async function ajouteCanal(projet_id, campagne_id, newCanal) {
  
    console.log({
      projet_id: projet_id,
      campagne_id: campagne_id,
      newCanal : newCanal
    });
  
  try {

    if (!projet_id) throw new Error("projet_id requis");
    if (!campagne_id) throw new Error("campagne_id requis");
    if (!newCanal) throw new Error("newEtape requis");
    

    

    // 🔎 récupérer la campagne
    const campagne = await db("campagnes").where({ projet_id , campagne_id }).first();

    if (!campagne) {
      throw new Error("Campagne introuvable");
    }

    // parser planification
    let planification = typeof campagne.planification === "string"
      ? JSON.parse(campagne.planification)
      : campagne.planification;

    if (!planification) {
      planification = {
        type: "continue",
        etapes: [],
        canaux: [],
        formateurs: []
      };
    }

   
    const updatedPlanification = {
      ...planification,
      canaux : newCanal
    };

    await db("campagnes")
      .where({ projet_id })
      .update({
        planification: JSON.stringify(updatedPlanification),
        updated_at: new Date()
      });
    
    const newCampagne = await db("campagnes").where({ projet_id , campagne_id }).first();

    return {
      success: true,
      data: newCampagne
       
    };

  } catch (error) {
    console.error("Erreur operationEtape:", error);

    return {
      success: false,
      error: error.message
    };
  }
}


export async function deleteCanal(projet_id, campagne_id, data) {
  
    console.log({
      projet_id: projet_id,
      campagne_id: campagne_id,
      data : data
    });
  
  try {

    if (!projet_id) throw new Error("projet_id requis");
    if (!campagne_id) throw new Error("campagne_id requis");
    if (!data) throw new Error("data requis");
    

    

    // 🔎 récupérer la campagne
    const campagne = await db("campagnes").where({ projet_id , campagne_id }).first();

    if (!campagne) {
      throw new Error("Campagne introuvable");
    }

    // parser planification
    let planification = typeof campagne.planification === "string"
      ? JSON.parse(campagne.planification)
      : campagne.planification;

    if (!planification) {
      planification = {
        type: "continue",
        etapes: [],
        canaux: [],
        formateurs: []
      };
    }

    
    // 🔁 sauvegarde
    const updatedPlanification = {
      ...planification,
      canaux : data
    };

    await db("campagnes")
      .where({ projet_id })
      .update({
        planification: JSON.stringify(updatedPlanification),
        updated_at: new Date()
      });
    
    const newCampagne = await db("campagnes").where({ projet_id , campagne_id }).first();

    return {
      success: true,
      data: newCampagne
       
    };

  } catch (error) {
    console.error("Erreur operationEtape:", error);

    return {
      success: false,
      error: error.message
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

export async function getAllCampagnes() {
  try {
    const campagnes = await db("campagnes").select("*").orderBy("created_at", "desc");
      return {
          success: true,
          data: campagnes.map(formatCampagne)
      };
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