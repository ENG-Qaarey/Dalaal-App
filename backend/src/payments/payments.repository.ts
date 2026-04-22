import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { PaymentStatus } from '../common/enums';

@Injectable()
export class PaymentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.payment.create({ data });
  }

  async findById(id: string) {
    return this.prisma.payment.findUnique({ where: { id } });
  }

  async findByUserId(userId: string) {
    return this.prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async updateStatus(id: string, status: PaymentStatus, providerRef?: string) {
    return this.prisma.payment.update({
      where: { id },
      data: {
        status,
        providerRef,
        completedAt: status === PaymentStatus.COMPLETED ? new Date() : undefined
      }
    });
  }
}
