import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class VehiclesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(listingId: string, data: any) {
    return this.prisma.vehicle.create({
      data: {
        listingId,
        ...data,
      },
    });
  }

  async findByListingId(listingId: string) {
    return this.prisma.vehicle.findUnique({ where: { listingId } });
  }

  async update(listingId: string, data: any) {
    return this.prisma.vehicle.update({
      where: { listingId },
      data,
    });
  }
}
