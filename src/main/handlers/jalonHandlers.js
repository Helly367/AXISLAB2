import db from "../database/db.js";
import { jalonSchema , normalizeData } from "../database/schemas/jalonSchema.js";



export async function createJalon(jalonData) {
  
  try {
    
    const cleaned = normalizeData(jalonData);
    const { error, value } = jalonSchema.validate(cleaned, {
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

    const [jalon_id] = await db("jalons").insert({
      ...value,
      created_at: new Date(),
      updated_at: new Date()
    });

    const jalon = await db("jalons")
      .where({ jalon_id })
      .first();

    return {
      success: true,
      data: jalon
    };

  } catch (error) {

    console.error("Erreur createPhase:", error);

    return {
      success: false,
      error: error.message
    };
  }
}

export async function updateJalon(jalon_id, jalonData) {
  try {

    if (!jalon_id || isNaN(jalon_id)) {
      return {
        success: false,
        errors: [{ field: "id", message: "ID invalide" }]
      };
    }

    const {
      created_at,
      updated_at,
      ...cleanData
    } = jalonData;

    const { error, value } = jalonSchema.validate(cleanData, {
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

    await db("jalons")
      .where({ jalon_id: jalon_id })
      .update({
        ...value,
        updated_at: new Date()
      });

    const jalon = await db("jalons")
      .where({ jalon_id: jalon_id })
      .first();

    return {
      success: true,
      data: jalon
    };

  } catch (error) {

    console.error("Erreur updateJalon:", error);

    return {
      success: false,
      error: error.message
    };
  }
}

export async function getAllJalons() {

  try {

    const jalons = await db("jalons")
      .select("*")
      .orderBy("created_at", "desc");
 
    return {
      success: true,
      data: jalons
    };

  } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
}

// export async function getPhaseById(id) {

//   try {

//     const phase = await db("jalons")
//       .where({ phase_id: id })
//       .first();

//     if (!phase) {
//       return {
//         success: false,
//         error: "Phase non trouvée"
//       };
//     }

//     return {
//       success: true,
//       data: formatPhase(phase)
//     };

//   } catch (error) {

//     return {
//       success: false,
//       error: error.message
//     };
//   }
// }

export async function deletejalon(jalon_id) {
  try {

    await db("jalons")
      .where({ jalon_id: jalon_id })
      .del();

    return {
      success: true,
      data: {
        jalon_id: jalon_id
      }
    };

  } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
}