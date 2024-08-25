const { desc, eq } = require('drizzle-orm');
const clients = require('./clients');
const schemas = require('./schemas');

module.exports.newLead = async ({ email }) => {
  console.log(email);
  const db = await clients.getDrizzleDbClient();
  const result = await db.insert(schemas.LeadTable).values({ email }).returning();
  if (result.length > 1) {
    return result[0];
  }
  return result;
};

module.exports.listLead = async () => {
  const db = await clients.getDrizzleDbClient();
  const results = await db
    .select()
    .from(schemas.LeadTable)
    .orderBy(desc(schemas.LeadTable.createdAt))
    .limit(10);
  return results;
};

module.exports.getLead = async ({ id }) => {
  const db = await clients.getDrizzleDbClient();
  const result = await db.select().from(schemas.LeadTable).where(eq(schemas.LeadTable.id, id));
  return result;
};

module.exports.deleteLead = async ({ id }) => {
  const db = await clients.getDrizzleDbClient();
  const result = await db.delete().from(schemas.LeadTable).where(eq(schemas.LeadTable.id, id));
  return result;
};
