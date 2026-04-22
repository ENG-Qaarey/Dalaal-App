import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateListingDto, UpdateListingDto, ListingFilterDto } from './dto';
import { ListingStatus } from '../common/enums';
import { generateSlug } from '../common/utils/slug.utils';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createListingDto: CreateListingDto) {
    const slug = generateSlug(createListingDto.title);

    const listing = await this.prisma.listing.create({
      data: {
        userId,
        type: createListingDto.type,
        title: createListingDto.title,
        slug: `${slug}-${Date.now()}`,
        description: createListingDto.description,
        price: createListingDto.price,
        priceNegotiable: createListingDto.priceNegotiable || false,
        currency: 'USD',
        city: createListingDto.city,
        district: createListingDto.district,
        address: createListingDto.address,
        latitude: createListingDto.latitude,
        longitude: createListingDto.longitude,
        featuredImage: createListingDto.featuredImage,
        status: ListingStatus.DRAFT,
      },
    });

    return listing;
  }

  async findAll(page = 1, limit = 20, filters?: ListingFilterDto) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (filters?.type) where.type = filters.type;
    if (filters?.status) where.status = filters.status;
    else where.status = ListingStatus.ACTIVE;
    if (filters?.city) where.city = filters.city;
    if (filters?.minPrice) where.price = { ...where.price, gte: filters.minPrice };
    if (filters?.maxPrice) where.price = { ...where.price, lte: filters.maxPrice };

    const [listings, total] = await Promise.all([
      this.prisma.listing.findMany({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, profile: true } },
          property: true,
          vehicle: true,
          images: { orderBy: { order: 'asc' } },
        },
      }),
      this.prisma.listing.count({ where }),
    ]);

    return { data: listings, total, page, limit, totalPages: Math.ceil(total / limit) };
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

    await this.prisma.listing.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
    });

    return listing;
  }

  async update(id: string, userId: string, updateListingDto: UpdateListingDto) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.userId !== userId) throw new ForbiddenException('You can only update your own listings');

    return this.prisma.listing.update({
      where: { id },
      data: updateListingDto,
    });
  }

  async delete(id: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.userId !== userId) throw new ForbiddenException('You can only delete your own listings');

    await this.prisma.listing.delete({ where: { id } });
    return { message: 'Listing deleted successfully' };
  }

  async publish(id: string, userId: string) {
    const listing = await this.prisma.listing.findUnique({ where: { id } });
    if (!listing) throw new NotFoundException('Listing not found');
    if (listing.userId !== userId) throw new ForbiddenException('You can only publish your own listings');

    return this.prisma.listing.update({
      where: { id },
      data: { status: ListingStatus.PENDING_REVIEW, publishedAt: new Date() },
    });
  }
}
