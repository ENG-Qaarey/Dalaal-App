import { Injectable } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  getHello(): string {
    return 'Hello Backend!';
  }

  async getHealth() {
    let database: 'connected' | 'error' = 'connected';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch {
      database = 'error';
    }
    return {
      ok: database === 'connected',
      service: 'dalaal-backend',
      database,
      timestamp: new Date().toISOString(),
    };
  }
}
