import db from "../database/db.js";
import {dependencySchema, normalizeDependencyData } from "../database/schemas/dependencySchema.js";



function formatDependency(dep) {
  if (!dep) return null;

  return {
    dependency_id: dep.dependency_id,
    projet_id: dep.projet_id,
    from_phase_id: dep.from_phase_id,
    to_phase_id: dep.to_phase_id,
    created_at: dep.created_at,
    updated_at: dep.updated_at
  };
}


export async function createDependency(data) {
  try {

    const cleaned = normalizeDependencyData(data);

    const { error, value } = dependencySchema.validate(cleaned, {
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

    const [dependency_id] = await db("dependencies").insert({
      ...value,
      created_at: new Date(),
      updated_at: new Date()
    });

    const dependency = await db("dependencies")
      .where({ dependency_id })
      .first();

    return {
      success: true,
      data: formatDependency(dependency)
    };

  } catch (error) {

    if (error.code === "SQLITE_CONSTRAINT") {
      return {
        success: false,
        error: "Cette dépendance existe déjà"
      };
    }

    return {
      success: false,
      error: error.message
    };
  }
}


export async function getAllDependencies() {
  try {

    const dependencies = await db("dependencies")
      .select("*")
      .orderBy("created_at", "desc");

    return {
      success: true,
      data: dependencies.map(formatDependency)
    };

  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}


export async function getDependenciesByProject(projectId) {
  try {

    const dependencies = await db("dependencies")
      .where({ projet_id: projectId })
      .select("*");

    return {
      success: true,
      data: dependencies.map(formatDependency)
    };

  } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
}


export async function deleteDependency(dependencyId) {
  try {

    await db("dependencies")
      .where({ dependency_id: dependencyId })
      .del();

    return {
      success: true,
      data: { dependency_id: dependencyId }
    };

  } catch (error) {

    return {
      success: false,
      error: error.message
    };
  }
}