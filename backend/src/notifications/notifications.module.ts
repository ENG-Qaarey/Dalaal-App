import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './notifications.repository';
import { EmailService } from './email.service';
import { SmsService } from './sms.service';
import { PushService } from './push.service';
import { FirebaseProvider } from '../providers/push/firebase.provider';

@Module({
  controllers: [NotificationsController],
  providers: [
    NotificationsService,
    NotificationsRepository,
    EmailService,
    SmsService,
    PushService,
    FirebaseProvider,
  ],
  exports: [NotificationsService, EmailService, SmsService, PushService, FirebaseProvider],
})
export class NotificationsModule {}
