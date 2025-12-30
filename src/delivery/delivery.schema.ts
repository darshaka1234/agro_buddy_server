import { pgTable, integer, timestamp, pgEnum, text } from 'drizzle-orm/pg-core';
import { product } from '../product/product.schema';
import { vehicle } from '../vehicle/vehicle.schema';

const deliveryStatusEnum = pgEnum('delivery_status', [
  'pending',
  'delivered',
  'cancelled',
]);

export const delivery = pgTable('deliveries', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  deliveryStatus: deliveryStatusEnum('delivery_status').default('pending'),
  vehicleId: integer('vehicle_id')
    .references(() => vehicle.id)
    .notNull(),
  deliveryDate: timestamp('delivery_date'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const deliveryItem = pgTable('delivery_items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  deliveryId: integer('delivery_id')
    .notNull()
    .references(() => delivery.id),
  productId: integer('product_id')
    .notNull()
    .references(() => product.id),
  quantity: integer('quantity').notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
