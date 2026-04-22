import { Module } from '@nestjs/common';
import { ListingsController } from './listings.controller';
import { ListingsService } from './listings.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Module({
  controllers: [ListingsController],
  providers: [ListingsService, JwtAuthGuard],
  exports: [ListingsService],
})
export class ListingsModule {}
