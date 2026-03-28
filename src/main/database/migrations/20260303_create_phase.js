export const up = function (knex) {
  return knex.schema.createTable("phases", (table) => {

    table.increments("phase_id").primary();
      
    table
      .integer("projet_id")
      .unsigned()
      .references("projet_id")
      .inTable("projets")
      .onDelete("CASCADE");
      
    table.decimal("budget_phase", 16, 2).notNullable().defaultTo(0);
    table.decimal("budget_consomme", 16, 2).notNullable().defaultTo(0);
    table.decimal("budget_restant", 16, 2).notNullable().defaultTo(0);
    table.text("status").defaultTo("encours");
    table.string("title").notNullable();
    table.text("description_phase").notNullable();

    table.date("date_debut").notNullable();
    table.date("date_fin").notNullable();

    table.json("taches").notNullable();
    table.json("membres").notNullable();


    table.timestamps(true, true);
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("phases");
};