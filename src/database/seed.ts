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
  const userIds = await Promise.all(
    Array(50)
      .fill(0)
      .map(async (_, i) => {
        const user = await db
          .insert(schema.user)
          .values({
            email: faker.internet.email(),
            password: faker.internet.password(),
          })
          .returning();
        return user[0].id;
      }),
  );

  await Promise.all(
    userIds.map(async (userId) => {
      const profile = await db
        .insert(schema.profile)
        .values({
          userId,
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
          bio: faker.lorem.sentence(),
          profilePictureUrl: faker.image.avatar(),
          coverPictureUrl: faker.image.avatar(),
        })
        .returning();
    }),
  );
}

main()
  .then(() => console.log('Seeding completed'))
  .catch((e) => {
    console.error(e);
  })
  .finally(() => process.exit(0));
