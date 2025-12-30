import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { AuctionModule } from './auction/auction.module';
import { BidModule } from './bid/bid.module';
import { DeliveryModule } from './delivery/delivery.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { MediaModule } from './media/media.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { jwt } from 'better-auth/plugins';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { DATABASE_CONNECTION } from './database/constant';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule.forRootAsync({
      imports: [DatabaseModule],
      useFactory: (db: NodePgDatabase) => ({
        auth: betterAuth({
          database: drizzleAdapter(db, {
            provider: 'pg',
            usePlural: true,
          }),
          plugins: [
            jwt({
              jwt: {
                expirationTime: '15m',
                issuer: 'agro-buddy',
                definePayload: ({ user }) => ({
                  id: user.id,
                  role: user.role,
                }),
              },
              jwks: {
                keyPairConfig: { alg: 'EdDSA', crv: 'Ed25519' },
              },
            }),
          ],
        }),
      }),
      inject: [DATABASE_CONNECTION],
    }),
    DatabaseModule,
    ProfileModule,
    UserModule,
    AuctionModule,
    BidModule,
    DeliveryModule,
    VehicleModule,
    MediaModule,
  ],
})
export class AppModule {}
