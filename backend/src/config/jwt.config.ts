import { registerAs } from '@nestjs/config';

export const jwtConfig = registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET || 'dalaal_jwt_sK9x2mP7vQ4wL8nR3jT6yH5bC1eF0gA9uI4oW2qZ',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'dalaal_refresh_tF8kM3nP6xS2wQ9vR5yL1jT7hB4eC0aG8uI3oW6qZ',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
}));
