import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3001',
  backendUrl: process.env.BACKEND_URL || 'http://localhost:3001',
  name: process.env.APP_NAME || 'Dalaal Prime',
  description: process.env.APP_DESCRIPTION || 'Somalia Premier Marketplace',
  version: process.env.APP_VERSION || '1.0.0',
}));
