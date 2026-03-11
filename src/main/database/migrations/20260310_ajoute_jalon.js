export const up = function (knex) {
  
  return knex.schema.createTable("jalons", (table) => {
    table.increments("jalon_id").primary();
    table.string("title").notNullable();
    table.string("description").notNullable();
    table.string("type").notNullable();
    table.date("date").notNullable();
    table.integer('projet_id').unsigned().references('projet_id').inTable('projects').onDelete('CASCADE');
    table.integer('phase_id').unsigned().references('phase_id').inTable('phases').onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

export const down = function(knex) {
  return knex.schema.dropTable("jalons");
};