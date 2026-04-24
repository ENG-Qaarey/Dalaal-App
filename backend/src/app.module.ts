import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  appConfig,
  databaseConfig,
  jwtConfig,
  cloudinaryConfig,
  emailConfig,
  smsConfig,
  redisConfig,
  mapConfig,
  paymentConfig,
  firebaseConfig,
} from './config';
import { PrismaModule } from './database/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ListingsModule } from './listings/listings.module';
import { PropertiesModule } from './properties/properties.module';
import { VehiclesModule } from './vehicles/vehicles.module';
import { ChatModule } from './chat/chat.module';
import { PaymentsModule } from './payments/payments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReviewsModule } from './reviews/reviews.module';
import { SearchModule } from './search/search.module';
import { EscrowModule } from './escrow/escrow.module';
import { UploadsModule } from './uploads/uploads.module';
import { FavoritesModule } from './favorites/favorites.module';
import { VerificationModule } from './verification/verification.module';
import { AdminModule } from './admin/admin.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        cloudinaryConfig,
        emailConfig,
        smsConfig,
        redisConfig,
        mapConfig,
        paymentConfig,
        firebaseConfig,
      ],
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ListingsModule,
    PropertiesModule,
    VehiclesModule,
    ChatModule,
    PaymentsModule,
    NotificationsModule,
    ReviewsModule,
    SearchModule,
    EscrowModule,
    UploadsModule,
    FavoritesModule,
    VerificationModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
