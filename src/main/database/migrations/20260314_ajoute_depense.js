export const up = function (knex) {
  return knex.schema.createTable("depenses", (table) => {

    table.increments("depense_id").primary();
      
    table
      .integer("projet_id")
      .unsigned()
      .references("projet_id")
      .inTable("projets")
      .onDelete("CASCADE");

    table
      .integer("budget_id")
      .unsigned()
      .references("budget_id")
      .inTable("budgets")
      .onDelete("CASCADE");

    table
      .integer("phase_id")
      .unsigned()
      .references("phase_id")
      .inTable("phases")
      .onDelete("CASCADE");
      
    table.string("titre_depense");
    table.string("description");
    table.decimal("montant", 16, 2).notNullable();
    table.date("date").notNullable();
    table.string("type").defaultTo("normal");

    table.timestamps(true, true);

  });
};



export const down = function (knex) {
  return knex.schema.dropTable("depenses");
};