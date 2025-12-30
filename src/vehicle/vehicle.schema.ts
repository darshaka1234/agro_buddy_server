import {
  pgTable,
  integer,
  varchar,
  timestamp,
  pgEnum,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from '../user/user.schema';

const vehicleTypeEnum = pgEnum('vehicle_type', [
  'bike',
  'van',
  'truck',
  'tractor',
  'car',
  'dipper',
  'bus',
]);

export const vehicle = pgTable('vehicles', {
  id: uuid('id').primaryKey().defaultRandom(),
  ownerId: text('owner_id')
    .notNull()
    .references(() => user.id),
  licensePlate: varchar('license_plate', { length: 50 }).notNull().unique(),
  imageUrl: text('image_url')
    .notNull()
    .default('https://cdn-icons-png.flaticon.com/512/149/149071.png'),
  type: vehicleTypeEnum('type').notNull(),
  model: varchar('model', { length: 100 }).notNull(),
  capacity: integer('capacity'),
  driverName: varchar('driver_name', { length: 100 }),
  driverContact: varchar('driver_contact', { length: 100 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
