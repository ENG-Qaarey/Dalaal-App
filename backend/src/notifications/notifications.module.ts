import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './notifications.repository';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { PushService } from './push.service';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsRepository,
    EmailService,
    SmsService,
    PushService,
  ],
  exports: [NotificationsService, EmailService, SmsService, PushService],
})
export class NotificationsModule {}
