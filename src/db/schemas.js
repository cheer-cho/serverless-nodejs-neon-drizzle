const { text, pgTable, timestamp, serial } = require('drizzle-orm/pg-core');

const LeadTable = pgTable('leads', {
  id: serial('id').primaryKey().notNull(),
  email: text('email'),
  description: text('description').default('This is my comment'),
  createdAt: timestamp('created_at').defaultNow(),
});

module.exports.LeadTable = LeadTable;

// const LeadTable = {
//   email,
//   created_at,
//   description,
//   source,
//   first_name,
//   last_name,
// };
