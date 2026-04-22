import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  async sendSms(to: string, message: string) {
    this.logger.log(`Sending SMS to ${to}: ${message} (simulated)`);
  }
}
