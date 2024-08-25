require('dotenv').config();
const { drizzle } = require('drizzle-orm/neon-serverless');
const { migrate } = require('drizzle-orm/postgres-js/migrator');
const schema = require('../db/schemas');
const { getDatabaseUrl } = require('../lib/secrets');
const { Pool, neonConfig } = require('@neondatabase/serverless');
const ws = require('ws');

// tsx src/cli/migrator.js

const performMigration = async () => {
  const dbUrl = await getDatabaseUrl();
  if (!dbUrl) {
    return;
  }
  console.log(dbUrl);

  // neon serverless pool
  neonConfig.webSocketConstructor = ws; // <-- this is the key bit

  const pool = new Pool({ connectionString: dbUrl });
  pool.on('error', (err) => console.error(err)); // deal with e.g. re-connect
  // ...

  const client = await pool.connect();

  try {
    await client.query('BEGIN');
    const db = await drizzle(client, { schema });
    await migrate(db, { migrationsFolder: 'src/migrations' });
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  // ...
  await pool.end();
};

(async () => {
  if (require.main === module) {
    console.log('run this!');
    console.log(process.env.AWS_ACCESS_KEY_ID);
    try {
      const val = await performMigration();
      console.log('Migration Done!');
      process.exit(0);
    } catch (e) {
      console.log(e);
      console.log('Migration Error!');
      process.exit(1);
    }
  }
})();
