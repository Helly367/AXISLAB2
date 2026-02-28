import db from '../database/db.js';
import Joi from 'joi';

const projectSchema = Joi.object({
  nom_projet: Joi.string().min(2).max(200).required().messages({
    'string.empty': 'Le nom du projet est obligatoire',
    'string.min': 'Le nom doit contenir au moins 2 caractères',
    'any.required': 'Le nom du projet est requis'
  }),
  
  chef_projet: Joi.alternatives().try(
    Joi.string().min(2).max(100),
    Joi.valid(null)
  ).optional().messages({
    'string.min': 'Le nom du chef doit contenir au moins 2 caractères'
  }),
  
  description: Joi.alternatives().try(
    Joi.string().max(1000),
    Joi.valid(null)
  ).optional(),
  
  date_debut: Joi.alternatives().try(
    Joi.date().iso(),
    Joi.valid(null)
  ).optional(),
  
  date_fin: Joi.alternatives().try(
    Joi.date().iso().min(Joi.ref('date_debut')),
    Joi.valid(null)
  ).optional().messages({
    'date.min': 'La date de fin doit être postérieure à la date de début'
  }),
  
  objectif_long_terme: Joi.alternatives().try(
    Joi.string().max(500),
    Joi.valid(null)
  ).optional(),
  
  objectif_long_terme_debut: Joi.alternatives().try(
    Joi.date().iso(),
    Joi.valid(null)
  ).optional(),
  
  objectif_long_terme_fin: Joi.alternatives().try(
    Joi.date().iso().min(Joi.ref('objectif_long_terme_debut')),
    Joi.valid(null)
  ).optional(),
  
  objectif_court_terme: Joi.alternatives().try(
    Joi.string().max(500),
    Joi.valid(null)
  ).optional(),
  
  objectif_court_terme_debut: Joi.alternatives().try(
    Joi.date().iso(),
    Joi.valid(null)
  ).optional(),
  
  objectif_court_terme_fin: Joi.alternatives().try(
    Joi.date().iso().min(Joi.ref('objectif_court_terme_debut')),
    Joi.valid(null)
  ).optional(),
  
  prospects_cibles: Joi.alternatives().try(
    Joi.array().items(Joi.string().min(2).max(50)),
    Joi.valid(null)
  ).optional().messages({
    'array.base': 'Les prospects doivent être une liste',
    'string.min': 'Un nom de communauté doit contenir au moins 2 caractères'
  }),
  
  type_projet: Joi.alternatives().try(
    Joi.string().valid('interne', 'externe', 'recherche', 'developpement'),
    Joi.valid(null)
  ).optional(),
  
  status: Joi.alternatives().try(
    Joi.string().valid('planification', 'en_cours', 'suspendu', 'termine', 'abandonne'),
    Joi.valid(null)
  ).optional()
});

// Fonction de validation
function validateProject(data) {
  const { error, value } = projectSchema.validate(data, { 
    abortEarly: false,
    allowUnknown: true 
  });
  
  if (error) {
    const errors = error.details.map(d => ({
      field: d.path.join('.'),
      message: d.message
    }));
    throw new Error(JSON.stringify(errors));
  }
  
  return value;
}

// Vérifier si des projets existent
export async function checkProjects() {
  try {
    const result = await db('projects').count('* as count').first();
    const count = result?.count || 0;
    
    if (count > 0) {
      const lastProject = await db('projects')
        .select('*')
        .orderBy('created_at', 'desc')
        .first();
      
      return { 
        exists: true, 
        count,
        lastProject 
      };
    } else {
      return { exists: false, count: 0 };
    }
  } catch (error) {
    console.error('Erreur checkProjects:', error);
    return { exists: false, count: 0, error: error.message };
  }
}

// Récupérer tous les projets
export async function getAllProjects() {
  try {
    const projects = await db('projects')
      .select('*')
      .orderBy('created_at', 'desc');
    
    return { 
      success: true, 
      data: projects 
    };
  } catch (error) {
    console.error('Erreur getAllProjects:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// Récupérer un projet par ID
export async function getProjectById(id) {
  try {
    const project = await db('projects')
      .where({ id })
      .first();
    
    if (!project) {
      return { 
        success: false, 
        error: 'Projet non trouvé' 
      };
    }
    
    return { 
      success: true, 
      data: project 
    };
  } catch (error) {
    console.error('Erreur getProjectById:', error);
    return { 
      success: false, 
      error: error.message 
    };
  }
}

// Créer un projet
export async function createProject(projectData) {
  try {
    const validatedData = validateProject(projectData);
    
    const [id] = await db('projects').insert({
      ...validatedData,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    const newProject = await db('projects').where({ id }).first();
    
    return { success: true, id, data: newProject };
  } catch (error) {
    console.error('Erreur création projet:', error);
    return { success: false, error: error.message };
  }
}

// Mettre à jour un projet
export async function updateProject(id, updateData) {
  try {
    const validatedData = validateProject(updateData);
    
    await db('projects')
      .where({ id })
      .update({
        ...validatedData,
        updated_at: new Date()
      });
    
    const updatedProject = await db('projects').where({ id }).first();
    
    return { success: true, data: updatedProject };
  } catch (error) {
    console.error('Erreur updateProject:', error);
    return { success: false, error: error.message };
  }
}

// Supprimer un projet
export async function deleteProject(id) {
  try {
    await db('projects')
      .where({ id })
      .delete();
    
    return { success: true };
  } catch (error) {
    console.error('Erreur deleteProject:', error);
    return { success: false, error: error.message };
  }
}