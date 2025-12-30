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

async function main() {
  //user
  const userIds = await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      const user = await db
        .insert(schema.user)
        .values({
          email: faker.internet.email(),
          password: faker.internet.password(),
          role: 'guest',
        })
        .returning();
      return user[0].id;
    }),
  );

  //profile
  await Promise.all(
    userIds.map(async (userId) => {
      await db.insert(schema.profile).values({
        userId,
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        bio: faker.lorem.sentence(),
        profileImageUrl: faker.image.avatar(),
        coverImageUrl: faker.image.avatar(),
      });
    }),
  );

  //vehicle
  const vehicleIds = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      const ownerId = faker.helpers.arrayElement(userIds);
      const vehicle = await db
        .insert(schema.vehicle)
        .values({
          ownerId,
          licensePlate: faker.vehicle.vrm(),
          type: faker.helpers.arrayElement([
            'bike',
            'van',
            'truck',
            'tractor',
            'car',
          ]),
          model: faker.vehicle.model(),
          capacity: faker.number.int({ min: 100, max: 5000 }),
          driverName: faker.person.fullName(),
          driverContact: faker.phone.number(),
          imageUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        })
        .returning();
      return vehicle[0].id;
    }),
  );

  //product
  const productIds = await Promise.all(
    Array.from({ length: 100 }).map(async () => {
      const farmerId = faker.helpers.arrayElement(userIds);
      const product = await db
        .insert(schema.product)
        .values({
          farmerId,
          name: faker.commerce.productName(),
          description: faker.commerce.productDescription(),
          price: faker.commerce.price({ min: 1, max: 5000, dec: 2 }),
          unitType: faker.helpers.arrayElement([
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
          ]),
          imageUrl: 'https://cdn-icons-png.flaticon.com/512/149/149071.png',
        })
        .returning();
      return product[0].id;
    }),
  );

  //product gallery
  await Promise.all(
    productIds.map(async (productId) => {
      await db.insert(schema.media).values({
        resourceType: 'product_gallery',
        resourceId: productId,
        url: faker.image.urlLoremFlickr({ category: 'food' }),
        storageKey: faker.string.uuid(),
        fileName: faker.system.fileName(),
        mimeType: 'image/jpeg',
        fileSize: faker.number.int({ min: 1000, max: 5000000 }),
      });
    }),
  );

  //vehicle gallery
  await Promise.all(
    vehicleIds.map(async (vehicleId) => {
      await db.insert(schema.media).values({
        resourceType: 'vehicle_gallery',
        resourceId: vehicleId,
        url: faker.image.urlLoremFlickr({ category: 'transport' }),
        storageKey: faker.string.uuid(),
        fileName: faker.system.fileName(),
        mimeType: 'image/jpeg',
        fileSize: faker.number.int({ min: 1000, max: 5000000 }),
      });
    }),
  );

  //delivery
  await Promise.all(
    Array.from({ length: 50 }).map(async () => {
      const vehicleId = faker.helpers.arrayElement(vehicleIds);
      const delivery = await db
        .insert(schema.delivery)
        .values({
          vehicleId,
          deliveryStatus: faker.helpers.arrayElement([
            'pending',
            'delivered',
            'cancelled',
          ]),
          deliveryDate: faker.date.future(),
        })
        .returning();

      const itemsCount = faker.number.int({ min: 1, max: 5 });
      for (let i = 0; i < itemsCount; i++) {
        await db.insert(schema.deliveryItem).values({
          deliveryId: delivery[0].id,
          productId: faker.helpers.arrayElement(productIds),
          quantity: faker.number.int({ min: 1, max: 100 }),
          note: faker.lorem.sentence(),
        });
      }
    }),
  );

  //auction
  const auctionIds = await Promise.all(
    Array.from({ length: 20 }).map(async () => {
      const startTime = faker.date.future();
      const endTime = faker.date.soon({ refDate: startTime });
      const auction = await db
        .insert(schema.auction)
        .values({
          basePrice: faker.number.float({
            min: 10,
            max: 1000,
            fractionDigits: 2,
          }),
          startTime,
          endTime,
        })
        .returning();
      return auction[0].id;
    }),
  );

  //auction item
  const auctionItemIds: number[] = [];
  for (const auctionId of auctionIds) {
    const itemsCount = faker.number.int({ min: 1, max: 5 });
    for (let i = 0; i < itemsCount; i++) {
      const productId = faker.helpers.arrayElement(productIds);
      const auctionItem = await db
        .insert(schema.auctionItem)
        .values({
          auctionId,
          productId,
          quantity: faker.number.int({ min: 1, max: 50 }),
          status: 'pending',
          description: faker.commerce.productDescription(),
        })
        .returning();
      auctionItemIds.push(auctionItem[0].id);
    }
  }

  //bid
  for (const auctionId of auctionIds) {
    const bidCount = faker.number.int({ min: 1, max: 10 });
    for (let i = 0; i < bidCount; i++) {
      await db.insert(schema.bid).values({
        auctionId,
        buyerId: faker.helpers.arrayElement(userIds),
        amount: faker.number.float({ min: 10, max: 2000, fractionDigits: 2 }),
        note: faker.lorem.sentence(),
      });
    }
  }
}

main()
  .then(() => console.log('Seeding completed'))
  .catch((e) => {
    console.error(e);
  })
  .finally(() => process.exit(0));
