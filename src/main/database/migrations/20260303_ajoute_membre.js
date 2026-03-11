export const up = function (knex) {
  return knex.schema.createTable("membres", (table) => {

    table.increments("membre_id").primary();

    table.string("nom").notNullable();
    table.string("poste").notNullable();
    table.string("role").notNullable();

    table.string("sexe");
    table.string("telephone");
    table.string("email");

    table.string("niveau_etude");

    table.integer("disponibilite").defaultTo(100);
    table.integer("charge_max").defaultTo(40);
    table.integer("charge_actuelle").defaultTo(0);

    table.json("competences").notNullable();
    table.json("competences_requises").notNullable();

    table.date("date_debut");

    table.json("historique").notNullable();

    table.timestamps(true, true);
  });
};

export const down = function (knex) {
  return knex.schema.dropTable("membres");
};