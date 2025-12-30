import {
  pgTable,
  integer,
  timestamp,
  pgEnum,
  text,
  uuid,
} from 'drizzle-orm/pg-core';
import { product } from '../product/product.schema';
import { vehicle } from '../vehicle/vehicle.schema';
import { user } from '../user/user.schema';

const deliveryStatusEnum = pgEnum('delivery_status', [
  'pending',
  'delivered',
  'cancelled',
]);

export const delivery = pgTable('deliveries', {
  id: uuid('id').primaryKey().defaultRandom(),
  deliveryStatus: deliveryStatusEnum('delivery_status').default('pending'),
  vehicleId: uuid('vehicle_id')
    .references(() => vehicle.id)
    .notNull(),
  driverId: text('driver_id')
    .references(() => user.id)
    .notNull(),
  deliveryDate: timestamp('delivery_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const deliveryItem = pgTable('delivery_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  deliveryId: uuid('delivery_id')
    .notNull()
    .references(() => delivery.id),
  productId: uuid('product_id')
    .notNull()
    .references(() => product.id),
  quantity: integer('quantity').notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
