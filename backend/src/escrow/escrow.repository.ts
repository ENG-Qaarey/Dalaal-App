import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { EscrowStatus } from '../common/enums';

@Injectable()
export class EscrowRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.escrow.create({ data });
  }

  async findById(id: string) {
    return this.prisma.escrow.findUnique({
      where: { id },
      include: { listing: true, buyer: true, seller: true },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.escrow.findMany({
      where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
      include: { listing: true, buyer: true, seller: true },
    });
  }

  async updateStatus(id: string, status: EscrowStatus) {
    return this.prisma.escrow.update({
      where: { id },
      data: { status, releasedAt: status === EscrowStatus.RELEASED ? new Date() : undefined },
    });
  }
}
