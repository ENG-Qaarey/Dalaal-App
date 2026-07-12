import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class ListingsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.listing.create({ data });
  }

  async findAll(args?: any) {
    return this.prisma.listing.findMany({
      ...args,
      include: {
        user: { select: { id: true, email: true, profile: true } },
        property: true,
        vehicle: true,
        images: { orderBy: { order: 'asc' } },
      },
    });
  }

  async findById(id: string) {
    const listing = await this.prisma.listing.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, profile: true } },
        property: true,
        vehicle: true,
        images: { orderBy: { order: 'asc' } },
        reviews: true,
      },
    });
    if (!listing) throw new NotFoundException('Listing not found');
    return listing;
  }

  async findBySlug(slug: string) {
    return this.prisma.listing.findUnique({ where: { slug } });
  }

  async update(id: string, data: any) {
    return this.prisma.listing.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.listing.delete({ where: { id } });
  }

  async count(args?: any) {
    return this.prisma.listing.count(args);
  }

  async incrementViewCount(id: string) {
    return this.prisma.listing.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });
  }
}
