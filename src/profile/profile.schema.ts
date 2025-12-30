import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';
import { user } from '../user/user.schema';

export const profile = pgTable('profiles', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }),
  bio: text('bio'),
  profileImageUrl: text('profile_image_url')
    .notNull()
    .default('https://cdn-icons-png.flaticon.com/512/149/149071.png'),
  coverImageUrl: text('cover_image_url')
    .notNull()
    .default('https://cdn-icons-png.flaticon.com/512/149/149071.png'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
