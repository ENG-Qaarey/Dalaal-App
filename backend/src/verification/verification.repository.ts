import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class VerificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string) {
    return this.prisma.verification.findUnique({ where: { userId } });
  }

  async create(data: any) {
    return this.prisma.verification.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.verification.update({ where: { id }, data });
  }
}
