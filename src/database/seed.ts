import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';
import { faker } from '@faker-js/faker';
import 'dotenv/config';

const dbUrl = process.env.POSTGRES_URL;
const isProd = process.env.NODE_ENV === 'production';
const pool = new Pool({
  connectionString: dbUrl,
  ssl: isProd ? { rejectUnauthorized: false } : false,
});
const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

// Delete in reverse order of dependencies
async function cleanDB() {
  console.log('Clearing existing data...');
  await db.delete(schema.media);
  await db.delete(schema.bid);
  await db.delete(schema.auctionItem);
  await db.delete(schema.auction);
  await db.delete(schema.deliveryItem);
  await db.delete(schema.delivery);
  await db.delete(schema.vehicle);
  await db.delete(schema.product);
  await db.delete(schema.profile);
  await db.delete(schema.userRole);
  await db.delete(schema.user);
  await db.delete(schema.role);
}

async function main() {
  await cleanDB();

  console.log('Seeding roles...');
  const roles = await db
    .insert(schema.role)
    .values([
      { name: 'admin' },
      { name: 'farmer' },
      { name: 'buyer' },
      { name: 'driver' },
    ])
    .returning();

  console.log('Seeding users...');
  const users = await Promise.all(
    Array.from({ length: 10 }).map(() =>
      db
        .insert(schema.user)
        .values({
          id: faker.string.uuid(),
          email: faker.internet.email(),
          name: faker.person.fullName(),
          emailVerified: true,
        })
        .returning()
        .then((res) => res[0]),
    ),
  );

  console.log('Assigning roles and creating profiles...');
  for (const user of users) {
    // Assign a random role
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    await db.insert(schema.userRole).values({
      userId: user.id,
      roleId: randomRole.id,
    });

    // Create profile
    await db.insert(schema.profile).values({
      userId: user.id,
      firstName: user.name.split(' ')[0],
      lastName: user.name.split(' ')[1] || '',
      bio: faker.lorem.sentence(),
    });
  }

  const farmerUsers = users.slice(0, 5);
  const buyerUsers = users.slice(5, 8);
  const driverUsers = users.slice(8, 10);

  console.log('Seeding products...');
  const products = await Promise.all(
    farmerUsers.map((farmer) =>
      db
        .insert(schema.product)
        .values({
          farmerId: farmer.id,
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price(),
          unitType: 'kg',
        })
        .returning()
        .then((res) => res[0]),
    ),
  );

  console.log('Seeding vehicles...');
  const vehicles = await Promise.all(
    driverUsers.map((driver) =>
      db
        .insert(schema.vehicle)
        .values({
          ownerId: driver.id,
          licensePlate: faker.vehicle.vrm(),
          type: 'truck', // Matches vehicle_type enum
          model: faker.vehicle.model(),
          capacity: 1000,
          driverName: driver.name,
        })
        .returning()
        .then((res) => res[0]),
    ),
  );

  console.log('Seeding auctions...');
  for (const product of products) {
    const auction = await db
      .insert(schema.auction)
      .values({
        basePrice: product.price,
        farmerId: product.farmerId,
        startTime: new Date(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days later
      })
      .returning()
      .then((res) => res[0]);

    await db.insert(schema.auctionItem).values({
      auctionId: auction.id,
      productId: product.id,
      quantity: faker.number.int({ min: 10, max: 100 }),
      status: 'active',
    });

    // Seed some bids
    for (const buyer of buyerUsers) {
      await db.insert(schema.bid).values({
        auctionId: auction.id,
        buyerId: buyer.id,
        amount: (
          Number(product.price) + faker.number.int({ min: 1, max: 50 })
        ).toString(),
      });
    }
  }

  console.log('Seeding deliveries...');
  for (let i = 0; i < 3; i++) {
    const delivery = await db
      .insert(schema.delivery)
      .values({
        vehicleId: vehicles[0].id,
        driverId: driverUsers[0].id,
        deliveryStatus: 'pending',
      })
      .returning()
      .then((res) => res[0]);

    await db.insert(schema.deliveryItem).values({
      deliveryId: delivery.id,
      productId: products[0].id,
      quantity: 5,
    });
  }

  console.log('Seeding media resources...');

  // 1. Seed User Profile Pictures
  for (const user of users) {
    await db.insert(schema.media).values({
      resourceType: 'user_profile',
      resourceId: user.id as any, // Cast to any if UUID/Text mismatch in Drizzle
      url: faker.image.avatar(),
      storageKey: `profiles/${user.id}.jpg`,
      fileName: 'avatar.jpg',
      mimeType: 'image/jpeg',
      fileSize: 102400,
    });
  }

  // 2. Seed Product Gallery (Multiple images per product)
  for (const product of products) {
    const imagesCount = faker.number.int({ min: 1, max: 3 });

    for (let i = 0; i < imagesCount; i++) {
      await db.insert(schema.media).values({
        resourceType: 'product_gallery',
        resourceId: product.id,
        url: faker.image.urlPicsumPhotos(),
        storageKey: `products/${product.id}-${i}.jpg`,
        fileName: `product_${i}.jpg`,
        mimeType: 'image/jpeg',
        fileSize: 512000,
        displayOrder: i,
      });
    }
  }

  // 3. Seed Vehicle Gallery
  for (const vehicle of vehicles) {
    await db.insert(schema.media).values({
      resourceType: 'vehicle_gallery',
      resourceId: vehicle.id,
      url: faker.image.urlPicsumPhotos(),
      storageKey: `vehicles/${vehicle.id}.jpg`,
      fileName: 'vehicle.jpg',
      mimeType: 'image/jpeg',
      fileSize: 800000,
    });
  }
}

main()
  .then(() => console.log('Seeding completed'))
  .catch((e) => {
    console.error(e);
  })
  .finally(() => process.exit(0));
