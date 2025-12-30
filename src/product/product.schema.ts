import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  varchar,
  uuid,
} from 'drizzle-orm/pg-core';
import { user } from '../user/user.schema';
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import z from 'zod';

const quantityUnitEnum = pgEnum('quantity_unit', [
  'kg',
  'g',
  'litre',
  'ml',
  'piece',
  'dozen',
  'box',
  'bag',
  'carton',
  'ton',
]);

export const product = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  farmerId: text('farmer_id')
    .notNull()
    .references(() => user.id),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url')
    .notNull()
    .default('https://cdn-icons-png.flaticon.com/512/149/149071.png'),
  unitType: quantityUnitEnum('unit_type').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});

export const productInsertSchema = createInsertSchema(product);
export const productUpdateSchema = createUpdateSchema(product);

export type createProductDto = z.infer<typeof productInsertSchema>;
export type updateProductDto = z.infer<typeof productUpdateSchema>;
