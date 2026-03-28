export const up = function (knex) {
  return knex.schema.createTable("dependencies", (table) => {
    table.increments("dependency_id").primary();

    // relation projet
    table
      .integer("projet_id")
      .unsigned()
      .notNullable()
      .references("projet_id")
      .inTable("projets")
      .onDelete("CASCADE");

    // phase précédente
    table
      .integer("from_phase_id")
      .unsigned()
      .notNullable()
      .references("phase_id")
      .inTable("phases")
      .onDelete("CASCADE");

    // phase dépendante
    table
      .integer("to_phase_id")
      .unsigned()
      .notNullable()
      .references("phase_id")
      .inTable("phases")
      .onDelete("CASCADE");

    // éviter les doublons
    table.unique(["from_phase_id", "to_phase_id"]);

    table.timestamps(true, true);
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("dependencies");
};