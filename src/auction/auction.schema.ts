import {
  integer,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { product } from '../product/product.schema';
import { bid } from '../bid/bid.schema';
import { user } from '../user/user.schema';

const auctionStatusEnum = pgEnum('auction_status', [
  'pending',
  'active',
  'completed',
  'cancelled',
]);

export const auction = pgTable('auctions', {
  id: uuid('id').primaryKey().defaultRandom(),
  basePrice: numeric('base_price', { precision: 10, scale: 2 }).notNull(),
  currentPrice: numeric('current_price', { precision: 10, scale: 2 }),
  winningBidId: uuid('winning_bid_id').references(() => bid.id),
  farmerId: text('farmer_id').references(() => user.id),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const auctionItem = pgTable('auction_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  auctionId: uuid('auction_id')
    .notNull()
    .references(() => auction.id),
  productId: uuid('product_id')
    .notNull()
    .references(() => product.id),
  status: auctionStatusEnum('status').default('pending'),
  description: text('description'),
  quantity: integer('quantity').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
