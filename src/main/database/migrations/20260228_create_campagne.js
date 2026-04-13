// src/main/database/migrations/20250228_create_projects.js
export const up = function(knex) {
  return knex.schema.createTable('campagnes', table => {
    // Informations de base
    table.increments('campagne_id').primary();
    
    table
      .integer("projet_id")
      .unsigned()
      .references("projet_id")
      .inTable("projets")
      .onDelete("CASCADE");
    
    
    table.string('nom_compagne').notNullable(); 
    table.string('ville').nullable();
    table.string('secteur').nullable();
    
    table.date('date_debut').nullable();
    table.date('date_fin').nullable();
    
    table.enum('status', ['en_cours', 'termine', 'inactif', 'en_pause']).defaultTo('inactif');
        // Descriptif
    table.text('description').nullable();
    table.string('objectif', 500).nullable();
    table.string('responsable', 255).nullable();
    
    // Budget du projet
    table.decimal('cout', 16, 2).notNullable().defaultTo(0);
    
     // Planification (JSON)
    table.json('planification').nullable();
    
    // Résultats (JSON)
    table.json('resultats').nullable();
 
    // Timestamps automatiques
    table.timestamps(true, true);
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('projects');
};




