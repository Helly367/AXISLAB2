import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Remonte à la racine du projet et cherche les migrations
const migrationsPath = path.join(process.cwd(), 'src', 'main', 'database', 'migrations');

export default {
  client: 'better-sqlite3',
  connection: {
    filename: path.join(process.cwd(), 'data.db')
  },
  useNullAsDefault: true,
  migrations: {
    directory: migrationsPath,
    tableName: 'knex_migrations'
  },
  pool: {
    min: 1,                    // Minimum 1 connexion
    max: 1,                    // Maximum 1 connexion (ÉVITE LES CONFLITS)
    acquireTimeoutMillis: 60000 // Timeout d'attente
  }
};