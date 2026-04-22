import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ModerationService {
  constructor(private readonly prisma: PrismaService) {}

  async getPendingListings() {
    return this.prisma.listing.findMany({
      where: { status: 'PENDING_REVIEW' },
      include: { user: { include: { profile: true } } },
    });
  }

  async approveListing(id: string) {
    return this.prisma.listing.update({
      where: { id },
      data: { status: 'ACTIVE' },
    });
  }

  async rejectListing(id: string, reason: string) {
    return this.prisma.listing.update({
      where: { id },
      data: { status: 'REJECTED' },
    });
  }
}
