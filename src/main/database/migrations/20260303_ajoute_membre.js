export const up = function (knex) {
  return knex.schema.createTable("membres", (table) => {

    table.increments("membre_id").primary();

    table.string("nomComplet").notNullable();
    table.string("poste").notNullable();
    table.string("role").notNullable();
    table.string("sexe");
    table.string("telephone");
    table.string("email");
    table.string("niveau_etude");
      table.json("competences").notNullable();
      
    table.integer("projet_id")
      .unsigned().references("projet_id")
      .inTable("projets")
      .onDelete("CASCADE");

    table.timestamps(true, true);
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("membres");
};