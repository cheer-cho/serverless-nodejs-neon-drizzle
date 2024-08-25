const { neon } = require('@neondatabase/serverless');
const { getDatabaseUrl } = require('../lib/secrets');

const dbClient = async () => {
  try {
    const databaseUrl = await getDatabaseUrl();
    const sql = neon(databaseUrl);
    return sql;
  } catch (e) {
    console.log(e);
  }
};

module.exports.dbClient = dbClient;
