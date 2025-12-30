import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { AuctionModule } from './auction/auction.module';
import { BidModule } from './bid/bid.module';
import { OrderModule } from './order/order.module';
import { DeliveryModule } from './delivery/delivery.module';
import { AuctionController } from './nest/auction/auction.controller';
import { VehicleModule } from './vehicle/vehicle.module';
import { MediaModule } from './media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    UsersModule,
    ProfileModule,
    UserModule,
    AuctionModule,
    BidModule,
    OrderModule,
    DeliveryModule,
    VehicleModule,
    MediaModule,
  ],
  controllers: [AuctionController],
})
export class AppModule {}
pModule {}
