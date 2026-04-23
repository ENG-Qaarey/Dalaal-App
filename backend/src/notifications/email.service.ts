import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      secure: this.configService.get<number>('email.port') === 465, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.pass'),
      },
    });
  }

  async sendEmail(to: string, subject: string, template: string, context: any) {
    try {
      const from = this.configService.get<string>('email.from');
      const appName = this.configService.get<string>('email.appName');

      // For now, we'll just send the template string as the body.
      // In a real app, you'd use a template engine like EJS or Handlebars.
      let html = template;
      if (context) {
        Object.keys(context).forEach((key) => {
          html = html.replace(new RegExp(`{{${key}}}`, 'g'), context[key]);
        });
      }

      await this.transporter.sendMail({
        from: `"${appName}" <${from}>`,
        to,
        subject,
        html,
      });

      this.logger.log(`Email sent successfully to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw error;
    }
  }
}
