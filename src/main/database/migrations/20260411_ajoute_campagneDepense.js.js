export const up = function (knex) {
    return knex.schema.createTable('campagne_depenses', table => {
      
    table.increments('campagne_depense_id').primary();

    table
      .integer("projet_id")
      .unsigned()
      .references("projet_id")
      .inTable("projets")
      .onDelete("CASCADE");
        
    table.integer('campagne_id')
      .unsigned()
      .references('id')
      .inTable('campagnes')
      .onDelete('CASCADE');

    table.string('poste');
    table.decimal('montant', 16, 2);
    table.date('date');
        
    // Timestamps automatiques
    table.timestamps(true, true);
    
  });
};


export const down = function(knex) {
  return knex.schema.dropTable('campagne_depense');
};