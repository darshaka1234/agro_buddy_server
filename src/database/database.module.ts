import { Module } from '@nestjs/common';
import { DATABASE_CONNECTION } from './constant';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: (config: ConfigService) => {
        const pool = new Pool({
          connectionString: config.getOrThrow('POSTGRES_URL'),
        });
        return drizzle(pool, { schema: {} });
      },
      inject: [ConfigService],
    },
  ],
})
export class DatabaseModule {}
