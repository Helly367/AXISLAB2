import db from "../database/db.js";
import { membresSchema , normalizeMembreData , normalizeMembreDataUp } from "../database/schemas/membreSchema.js";

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
    projet_id : membre.projet_id,
    competences: JSON.parse(membre.competences || "[]"),
    created_at: membre.created_at,
    updated_at: membre.updated_at
  };
}


function validateBudget(data , isCreate) {
  
  const { error, value } = membresSchema(isCreate).validate(data, {
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

  return {
    isValid: true,
    value
  };
}


export async function getAllMembres(projet_id) {

    try {
      
    const membres = await db("membres")
        .select("*")
        .where({ projet_id})
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

export async function createMembre(data) {

  try {

    const cleaned = normalizeMembreData(data);
    const validation = validateBudget(cleaned , true);

    if (!validation.isValid) {
      return { success: false, error: validation.errors };
    }
    const validatedData = validation.value;
      
      

    const [membre_id] = await db("membres").insert({

        ...validatedData,
      competences: JSON.stringify(validatedData.competences),
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


export async function updateMembre(projet_id, updateData) {
    
  try {
    const membre_id = updateData.membre_id;
    const cleaned = normalizeMembreDataUp(projet_id , updateData);
    const validation = validateBudget(cleaned, false);

    if (!validation.isValid) {
      return { success: false, error: validation.errors };
    }
    const validatedData = validation.value;
      
    await db("membres")
      .where({ projet_id , membre_id})
      .update({

        ...validatedData,
        competences: JSON.stringify(validatedData.competences),
        updated_at: new Date()
      });

    const membre = await db("membres")
      .where({projet_id , membre_id })
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


export async function deleteMembre(projet_id, membre_id) {
    console.log("membre_id", membre_id);
    console.log("projet_id", projet_id);
    
    const projet = await db('projets').where({ projet_id }).first();
    const membre = await db("membres").where({ projet_id, membre_id }).first();
    
    if (!projet) return { success: false, message: "Projet non trouvé" };
    if (!membre) return { success: false, message: "Membre non trouvé" };
    
    console.log("projet" , projet);
    console.log("membre" , membre);
    

    try {
        await db.transaction(async (trx) => {
            // 1. Supprimer le membre de toutes les phases où il apparaît
          const phases = await trx("phases").where({ projet_id });
          let membresArray = [];
            
            for (const phase of phases) {
              
              membresArray = phase.membres ? JSON.parse(phase.membres) : [];
              console.log("membresArray" , membresArray);
              
                // Filtrer pour enlever le membre_id
                const membresMisAJour = membresArray.filter(id => Number(id) != membre_id);
                
                // Mettre à jour la phase si changement
                if (membresArray.length !== membresMisAJour.length) {
                    await trx("phases")
                        .where({ projet_id , phase_id: phase.phase_id })
                        .update({ 
                            membres: JSON.stringify(membresMisAJour)
                        });
                }
            }
            
            // 2. Supprimer le membre de la table membres
            await trx("membres").where({ projet_id, membre_id }).del();
        });
        
      const [updatedPhase, membresRestants] = await Promise.all([
        db("phases").where({ projet_id  }).first(),
        db("membres").where({ projet_id }).first()
      ]);
      
      
      
      const resutat = {
        updatedPhase: updatedPhase,
        membresRestants : membresRestants
        
      }
      
      console.log("resutat" , resutat);
      
        
        return {
            success: true,
            data: {
              membre_id: membre_id,
              phases : updatedPhase ,
              membres: membresRestants
            }
        };

    } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        return {
            success: false,
            error: error.message
        };
    }
}



