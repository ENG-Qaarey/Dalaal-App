import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { VerificationStatus } from '../common/enums';

@Injectable()
export class VerificationService {
  constructor(private readonly prisma: PrismaService) {}

  async createVerification(userId: string, dto: any) {
    return this.prisma.identityVerification.create({
      data: {
        userId,
        ...dto,
        status: VerificationStatus.PENDING,
      },
    });
  }

  async getMyVerification(userId: string) {
    return this.prisma.identityVerification.findUnique({
      where: { userId },
    });
  }

  async updateStatus(id: string, status: VerificationStatus, reason?: string) {
    return this.prisma.$transaction(async (tx) => {
      const verification = await tx.identityVerification.update({
        where: { id },
        data: {
          status,
          rejectionReason: reason,
          reviewedAt: status === VerificationStatus.APPROVED ? new Date() : undefined,
        },
      });

      if (status === VerificationStatus.APPROVED) {
        await tx.user.update({
          where: { id: verification.userId },
          data: { status: 'ACTIVE' }, // Or update role
        });
      }

      return verification;
    });
  }

  async findAllPending() {
    return this.prisma.identityVerification.findMany({
      where: { status: VerificationStatus.PENDING },
      include: { user: { include: { profile: true } } },
    });
  }
}
