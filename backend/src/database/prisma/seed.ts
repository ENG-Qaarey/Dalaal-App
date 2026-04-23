import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService) {}

  async seed() {
    this.logger.log('Starting database seed...');
  }

  private logger = {
    log: (message: string) => console.log(`[Seed] ${message}`),
    error: (message: string, error?: any) => console.error(`[Seed] ${message}`, error),
  };
}
