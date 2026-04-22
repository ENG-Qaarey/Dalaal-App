import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AnalyticsService } from './analytics.service';
import { ModerationService } from './moderation.service';

@Module({
  controllers: [AdminController],
  providers: [AnalyticsService, ModerationService],
})
export class AdminModule {}
