import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AnalyticsService } from './analytics.service';
import { ModerationService } from './moderation.service';
import { AdminManagementService } from './admin-management.service';
import { PrismaModule } from '../database/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AdminController],
  providers: [AnalyticsService, ModerationService, AdminManagementService],
})
export class AdminModule {}
