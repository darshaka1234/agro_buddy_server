import {
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';
import { auction } from '../auction/auction.schema';
import { user } from '../user/user.schema';

export const bid = pgTable('bids', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  auctionId: integer('auction_id')
    .notNull()
    .references(() => auction.id),
  buyerId: integer('buyer_id')
    .notNull()
    .references(() => user.id),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  deletedAt: timestamp('deleted_at'),
});
