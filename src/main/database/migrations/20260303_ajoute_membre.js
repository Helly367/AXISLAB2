export const up = function (knex) {
    return knex.schema.createTable('members', table => {

        table.increments('membre_id').primary();

        table.string('nom').notNullable();
        table.string('poste').notNullable();
        table.string('role').nullable();
        table.string('email').nullable();
        table.string('photo').nullable();

        table.integer('disponibilite').defaultTo(100);
        table.integer('chargeMax').defaultTo(40);
        table.integer('chargeActuelle').defaultTo(0);

        table.json('competences').nullable();
        table.json('competencesRequises').nullable();
        table.json('historique').nullable();

        table.date('dateDebut').nullable();
        
        table.integer('project_id').unsigned().references('membre_id').inTable('projects').onDelete('CASCADE');

        table.timestamps(true, true);
    });
};

export const down = function (knex) {
    return knex.schema.dropTable('members');
};