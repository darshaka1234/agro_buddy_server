import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core';
import { user } from '../users/users.schema';

export const profile = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => user.id),
  firstName: text('first_name').notNull(),
  lastName: text('last_name').notNull(),
  bio: text('bio').notNull(),
  profilePictureUrl: text('profile_picture_url')
    .notNull()
    .default('https://cdn-icons-png.flaticon.com/512/149/149071.png'),
  coverPictureUrl: text('cover_picture_url')
    .notNull()
    .default('https://cdn-icons-png.flaticon.com/512/149/149071.png'),
});
