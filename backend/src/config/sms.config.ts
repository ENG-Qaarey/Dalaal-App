import { registerAs } from '@nestjs/config';

export const smsConfig = registerAs('sms', () => ({
  africaTalkingUsername: process.env.AFRICASTALKING_USERNAME || '',
  africaTalkingApiKey: process.env.AFRICASTALKING_API_KEY || '',
  africaTalkingFrom: process.env.AFRICASTALKING_FROM || '',
}));
