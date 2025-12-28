import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const user = pgTable('users', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
});
