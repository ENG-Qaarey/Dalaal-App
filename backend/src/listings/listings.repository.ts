import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateListingDto, UpdateListingDto, ListingFilterDto } from './dto';
import { ListingStatus, ListingType } from '../common/enums';
import { generateSlug } from '../common/utils/slug.utils';

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

@Injectable()
export class ListingsService {
  constructor(
    private readonly listingsRepository: ListingsRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(userId: string, createListingDto: CreateListingDto) {
    const slug = generateSlug(createListingDto.title);

    const listing = await this.listingsRepository.create({
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
      this.listingsRepository.findAll({ skip, take: limit, where, orderBy: { createdAt: 'desc' } }),
      this.listingsRepository.count({ where }),
    ]);

    return { data: listings, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id: string) {
    const listing = await this.listingsRepository.findById(id);
    await this.listingsRepository.incrementViewCount(id);
    return listing;
  }

  async findByUser(userId: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where = { userId };
    const [listings, total] = await Promise.all([
      this.listingsRepository.findAll({ skip, take: limit, where }),
      this.listingsRepository.count({ where }),
    ]);
    return { data: listings, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async update(id: string, userId: string, updateListingDto: UpdateListingDto) {
    const listing = await this.listingsRepository.findById(id);
    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only update your own listings');
    }
    return this.listingsRepository.update(id, updateListingDto);
  }

  async delete(id: string, userId: string) {
    const listing = await this.listingsRepository.findById(id);
    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only delete your own listings');
    }
    await this.listingsRepository.delete(id);
    return { message: 'Listing deleted successfully' };
  }

  async publish(id: string, userId: string) {
    const listing = await this.listingsRepository.findById(id);
    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only publish your own listings');
    }
    return this.listingsRepository.update(id, {
      status: ListingStatus.PENDING_REVIEW,
      publishedAt: new Date(),
    });
  }
}
