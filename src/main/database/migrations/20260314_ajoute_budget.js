export const up = function (knex) {
  return knex.schema.createTable("budgets", (table) => {

    table.increments("budget_id").primary();

    table
      .integer("project_id")
      .unsigned()
      .references("projet_id")
      .inTable("projects")
      .onDelete("CASCADE");

    table.string("type").notNullable(); // interne | investissement
    table.decimal("montant_total", 14, 2).notNullable().defaultTo(0);
    table.string("devise").defaultTo("USD");
    table.decimal("reserve", 14, 2).defaultTo(0);
    table.decimal("taux_conversion", 14, 6).defaultTo(1);
    table.timestamps(true, true);

  });
};

export const down = function (knex) {
  return knex.schema.dropTable("budgets");
};