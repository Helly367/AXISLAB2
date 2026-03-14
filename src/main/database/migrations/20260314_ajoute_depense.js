export const up = function (knex) {
  return knex.schema.createTable("depenses", (table) => {

    table.increments("depense_id").primary();

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
          .onDelete("SET NULL");
      
    table.string("description");
    table.decimal("montant", 14, 2).notNullable();
    table.date("date").notNullable();
    table.string("type").defaultTo("normal");

    table.timestamps(true, true);

  });
};

export const down = function (knex) {
  return knex.schema.dropTable("depenses");
};