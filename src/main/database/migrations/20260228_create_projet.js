// src/main/database/migrations/20250228_create_projects.js
export const up = function(knex) {
  return knex.schema.createTable('projets', table => {
    // Informations de base
    table.increments('projet_id').primary();
    table.string('nom_projet').notNullable(); // Seul champ obligatoire
    table.string('chef_projet').nullable();
    table.text('description').nullable();
    
    // Budget du projet
    table.decimal('budget_total', 16 , 2).notNullable().defaultTo(0);
    table.string('devise').defaultTo("USD");
    table.decimal("taux_conversion", 16, 6).defaultTo(1);
    
    
    // Dates du projet
    table.date('date_debut').nullable();
    table.date('date_fin').nullable();
    
    
    // Objectif long terme (avec ses propres dates)
    table.text('objectif_long_terme').nullable();
    table.date('objectif_long_terme_debut').nullable();
    table.date('objectif_long_terme_fin').nullable();
    
    // Objectif court terme (avec ses propres dates)
    table.text('objectif_court_terme').nullable();
    table.date('objectif_court_terme_debut').nullable();
    table.date('objectif_court_terme_fin').nullable();
    
    // Prospects cibles (stocké en JSON)
    table.json('prospects_cibles').nullable(); // Pour stocker une liste
    
    // Type et statut
    table.string('type_projet').nullable();
    table.string('status').nullable();
    
    // Timestamps automatiques
    table.timestamps(true, true);
  });
};

export const down = function(knex) {
  return knex.schema.dropTable('projects');
};