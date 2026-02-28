import knex from 'knex';
import config from './knexfile.js';

const db = knex(config);


export async function runMigrations() {
  try {
    await db.migrate.latest();
    console.log('Migrations OK');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

export default db;