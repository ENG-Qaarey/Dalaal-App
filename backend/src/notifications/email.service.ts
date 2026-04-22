import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendEmail(to: string, subject: string, template: string, context: any) {
    this.logger.log(`Sending email to ${to} with subject: ${subject} (simulated)`);
  }
}
