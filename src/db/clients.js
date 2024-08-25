const { neon } = require('@neondatabase/serverless');
const { getDatabaseUrl } = require('../lib/secrets');
const { drizzle } = require('drizzle-orm/neon-http');

const dbClient = async () => {
  try {
    const databaseUrl = await getDatabaseUrl();
    const sql = neon(databaseUrl);
    return sql;
  } catch (e) {
    console.log(e);
  }
};

const getDrizzleDbClient = async () => {
  try {
    const sql = await dbClient();
    return drizzle(sql);
  } catch (e) {
    console.log(e);
  }
};

module.exports.dbClient = dbClient;
module.exports.getDrizzleDbClient = getDrizzleDbClient;
