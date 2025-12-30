import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { product } from '../product/product.schema';
import { bid } from '../bid/bid.schema';

const auctionStatusEnum = pgEnum('auction_status', [
  'pending',
  'active',
  'completed',
  'cancelled',
]);

export const auction = pgTable('auctions', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  basePrice: numeric('base_price', { precision: 10, scale: 2 }).notNull(),
  currentPrice: numeric('current_price', { precision: 10, scale: 2 }),
  winningBidId: integer('winning_bid_id').references(() => bid.id),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const auctionItem = pgTable('auction_items', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  auctionId: integer('auction_id')
    .notNull()
    .references(() => auction.id),
  productId: integer('product_id')
    .notNull()
    .references(() => product.id),
  status: auctionStatusEnum('status').default('pending'),
  description: text('description'),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
