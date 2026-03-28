export const up = function (knex) {
  return knex.schema.createTable("budgets", (table) => {

    table.increments("budget_id").primary();

    table
      .integer("projet_id")
      .unsigned()
      .references("projet_id")
      .inTable("projets")
      .onDelete("CASCADE");

    table.string("type").nullable();
    table.decimal("budget_total", 16, 2).notNullable().defaultTo(0);
    table.decimal("budget_depense", 16, 2).notNullable().defaultTo(0);
    table.decimal("budget_restant", 16, 2).notNullable().defaultTo(0);
    table.string("devise").defaultTo("USD");
    table.decimal("reserve", 16, 2).defaultTo(0);
    table.decimal("taux_conversion", 14, 6).defaultTo(1);
    table.timestamps(true, true);

  });
};

export const down = function (knex) {
  return knex.schema.dropTable("budgets");
};

