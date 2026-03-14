export const up = function (knex) {
  return knex.schema.createTable("phases", (table) => {

    table.increments("phase_id").primary();

    table.string("title").notNullable();
    table.text("description_phase").notNullable();

    table.date("date_debut").notNullable();
    table.date("date_fin").notNullable();

    table.json("taches").notNullable();
    table.json("membres").notNullable();

    table.integer("project_id").unsigned().references("projet_id").inTable("projects").onDelete("CASCADE");

    table.timestamps(true, true);
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("phases");
};