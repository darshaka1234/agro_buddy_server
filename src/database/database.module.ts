import { Module } from '@nestjs/common';
import { DATABASE_CONNECTION } from './constant';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (config: ConfigService) => {
        const dbUrl = config.getOrThrow<string>('POSTGRES_URL');
        const pool = new Pool({
          connectionString: dbUrl,
          ssl: false,
        });
        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
