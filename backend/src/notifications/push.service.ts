import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  async sendPush(userId: string, title: string, body: string, data?: any) {
    this.logger.log(`Sending push notification to user ${userId}: ${title} (simulated)`);
  }
}
