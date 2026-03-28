export const up = function (knex) {
  return knex.schema.createTable("materiels", (table) => {

    table.increments("materiel_id").primary();
      
    table
      .integer("projet_id")
      .unsigned()
      .references("projet_id")
      .inTable("projets")
          .onDelete("CASCADE");
     table
      .integer("phase_id")
      .unsigned()
      .notNullable()
      .references("phase_id")
      .inTable("phases")
      .onDelete("CASCADE");
      
    table.string('nom').notNullable();
    table.string('categorie').notNullable();
    table.text('description').nullable();
    table.decimal("prix", 16, 2).notNullable().defaultTo(0);
    table.integer("quantite").nullable().defaultTo(1);
    table.text("statut").defaultTo("attente");
    table.text("fournisseur").nullable().defaultTo('non defini');
      
      
   

    table.timestamps(true, true);
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("materiels");
};