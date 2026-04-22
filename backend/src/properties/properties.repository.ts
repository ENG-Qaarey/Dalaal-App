import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PropertiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(listingId: string, data: any) {
    return this.prisma.property.create({
      data: {
        listingId,
        ...data,
      },
    });
  }

  async findByListingId(listingId: string) {
    return this.prisma.property.findUnique({ where: { listingId } });
  }

  async update(listingId: string, data: any) {
    return this.prisma.property.update({
      where: { listingId },
      data,
    });
  }
}
