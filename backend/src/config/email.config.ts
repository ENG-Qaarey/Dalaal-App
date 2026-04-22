import { registerAs } from '@nestjs/config';

export const emailConfig = registerAs('email', () => ({
  sendgridApiKey: process.env.SENDGRID_API_KEY || '',
  fromEmail: process.env.SENDGRID_FROM_EMAIL || 'noreply@dalaal.com',
  fromName: process.env.SENDGRID_FROM_NAME || 'Dalaal Prime',
}));
