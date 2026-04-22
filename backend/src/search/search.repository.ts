import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { SearchQueryDto } from './dto';
import { ListingStatus } from '../common/enums';

@Injectable()
export class SearchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async searchListings(dto: SearchQueryDto, skip = 0, take = 20) {
    const where: any = {
      status: ListingStatus.ACTIVE,
    };

    if (dto.q) {
      where.OR = [
        { title: { contains: dto.q, mode: 'insensitive' } },
        { description: { contains: dto.q, mode: 'insensitive' } },
      ];
    }

    if (dto.type) where.type = dto.type;
    if (dto.city) where.city = { contains: dto.city, mode: 'insensitive' };
    if (dto.minPrice) where.price = { ...where.price, gte: dto.minPrice };
    if (dto.maxPrice) where.price = { ...where.price, lte: dto.maxPrice };

    return this.prisma.listing.findMany({
      where,
      include: {
        property: true,
        vehicle: true,
        images: { take: 1, orderBy: { order: 'asc' } },
        user: { select: { profile: true } },
      },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  async countResults(dto: SearchQueryDto) {
    const where: any = { status: ListingStatus.ACTIVE };
    if (dto.q) {
      where.OR = [
        { title: { contains: dto.q, mode: 'insensitive' } },
        { description: { contains: dto.q, mode: 'insensitive' } },
      ];
    }
    if (dto.type) where.type = dto.type;
    if (dto.city) where.city = { contains: dto.city, mode: 'insensitive' };
    return this.prisma.listing.count({ where });
  }
}
