export const up = function (knex) {
  return knex.schema.createTable("budget_categories", (table) => {

    table.increments("budget_categorie_id").primary();

    table
      .integer("project_id")
      .unsigned()
      .references("projet_id")
      .inTable("projects")
      .onDelete("CASCADE");
      
     table
      .integer("budget_id")
      .unsigned()
      .references("budget_id")
      .inTable("budgets")
      .onDelete("CASCADE");

    table.string("categorie").notNullable();
    table.decimal("montant", 14, 2).notNullable().defaultTo(0);
    table.decimal("reste", 14, 2).defaultTo(0);
    table.string("devise").defaultTo("USD");
    
    table.timestamps(true, true);

  });
};

export const down = function (knex) {
  return knex.schema.dropTable("budget_categories");
};