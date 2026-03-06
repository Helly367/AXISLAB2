import db from '../database/db';
import { projectSchema } from '../database/schemas/projetSchema';



/* ===============================
   VALIDATION CENTRALISÉE
================================ */

function validateProject(data) {
  const { error, value } = projectSchema.validate(data, {
    abortEarly: false
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

/* ===============================
   UPDATE PROJECT
================================ */

export async function updateProject(projet_id, updateData) {
  try {

    if (!projet_id || isNaN(projet_id)) {
      return { success: false, errors: [{ field: "id", message: "ID invalide" }] };
    }

    const {
      projet_id: _ignoredId,
      created_at: _ignoredCreatedAt,
      updated_at: _ignoredUpdatedAt,
      ...cleanData
    } = updateData;

    // 🔹 Normalisation prospects
    if (cleanData.hasOwnProperty("prospects_cibles")) {
      const value = cleanData.prospects_cibles;

      if (!value) {
        cleanData.prospects_cibles = null;

      } else if (Array.isArray(value)) {
        cleanData.prospects_cibles = value.filter(v => v?.trim() !== "");

      } else if (typeof value === "string") {
        cleanData.prospects_cibles = value
          .split(",")
          .map(v => v.trim())
          .filter(v => v !== "");

      } else {
        cleanData.prospects_cibles = null;
      }
    }

    // 🔹 Validation
    const validation = validateProject(cleanData);

    if (!validation.isValid) {
      return { success: false, errors: validation.errors };
    }

    const validatedData = validation.value;

    // 🔹 JSON stringify pour SQLite
    if (Array.isArray(validatedData.prospects_cibles)) {
      validatedData.prospects_cibles = JSON.stringify(validatedData.prospects_cibles);
    }

    await db("projects")
      .where({ projet_id })
      .update({
        ...validatedData,
        updated_at: new Date()
      });

    const updatedProject = await db("projects")
      .where({ projet_id })
      .first();

    if (updatedProject?.prospects_cibles) {
      try {
        updatedProject.prospects_cibles = JSON.parse(updatedProject.prospects_cibles);
      } catch {
        updatedProject.prospects_cibles = [];
      }
    }

    return { success: true, data: updatedProject };

  } catch (error) {
  console.error("Erreur updateProject:", error);

  if (error?.type === "validation") {
    return {
      success: false,
      errors: error.errors
    };
  }

  return {
    success: false,
    errors: [
      {
        field: "general",
        message: "Une erreur est survenue lors de la mise à jour"
      }
    ]
  };
}
}

/* ===============================
   CREATE PROJECT
================================ */

export async function createProject(projectData) {
  try {

    const validation = validateProject(projectData);

    if (!validation.isValid) {
      return { success: false, error: validation.errors };
    }

    const validatedData = validation.value;

    if (Array.isArray(validatedData.prospects_cibles)) {
      validatedData.prospects_cibles = JSON.stringify(validatedData.prospects_cibles);
    }

    const [projet_id] = await db('projects').insert({
      ...validatedData,
      created_at: new Date(),
      updated_at: new Date()
    });

    const newProject = await db('projects').where({ projet_id }).first();

    if (newProject?.prospects_cibles) {
      try {
        newProject.prospects_cibles = JSON.parse(newProject.prospects_cibles);
      } catch {
        newProject.prospects_cibles = [];
      }
    }

    return { success: true, projet_id, data: newProject };

  } catch (error) {
    console.error('Erreur création projet:', error);
    return { success: false, error: error.message };
  }
}

/* ===============================
   GET ALL PROJECTS
================================ */

export async function getAllProjects() {
  try {
    const projects = await db('projects')
      .select('*')
      .orderBy('created_at', 'desc');

    return { success: true, data: projects };

  } catch (error) {
    console.error('Erreur getAllProjects:', error);
    return { success: false, error: error.message };
  }
}

/* ===============================
   GET PROJECT BY ID
================================ */

export async function getProjectById(projet_id) {
  try {
    const project = await db('projects')
      .where({ projet_id })
      .first();

    if (!project) {
      return { success: false, error: 'Projet non trouvé' };
    }

    return { success: true, data: project };

  } catch (error) {
    console.error('Erreur getProjectById:', error);
    return { success: false, error: error.message };
  }
}

/* ===============================
   DELETE PROJECT
================================ */

export async function deleteProject(projet_id) {
  try {
    await db('projects')
      .where({ projet_id })
      .delete();

    return { success: true };

  } catch (error) {
    console.error('Erreur deleteProject:', error);
    return { success: false, error: error.message };
  }
}