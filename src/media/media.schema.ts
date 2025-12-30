import {
  pgTable,
  integer,
  text,
  timestamp,
  pgEnum,
  index,
  varchar,
} from 'drizzle-orm/pg-core';

export const mediaResourceTypeEnum = pgEnum('media_resource_type', [
  'user_profile',
  'user_cover',
  'product_gallery',
  'vehicle_gallery',
]);

export const media = pgTable(
  'media',
  {
    id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
    resourceType: mediaResourceTypeEnum('resource_type').notNull(),
    resourceId: integer('resource_id').notNull(),
    url: text('url').notNull(),
    storageKey: text('storage_key').notNull(),
    fileName: varchar('file_name', { length: 255 }),
    mimeType: varchar('mime_type', { length: 50 }),
    fileSize: integer('file_size'),
    displayOrder: integer('display_order').default(0),
    metadata: text('metadata'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
    deletedAt: timestamp('deleted_at'),
  },
  (table) => ({
    resourceIdx: index('media_resource_idx').on(
      table.resourceType,
      table.resourceId,
    ),
  }),
);
