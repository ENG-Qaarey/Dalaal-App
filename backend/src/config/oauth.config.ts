import { registerAs } from '@nestjs/config';

export const oauthConfig = registerAs('oauth', () => ({
  googleClientId: process.env.GOOGLE_CLIENT_ID || '',
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
}));
