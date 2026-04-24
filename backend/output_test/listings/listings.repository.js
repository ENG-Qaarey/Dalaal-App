"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingsService = exports.ListingsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const enums_1 = require("../common/enums");
const slug_utils_1 = require("../common/utils/slug.utils");
let ListingsRepository = class ListingsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.listing.create({ data });
    }
    async findAll(args) {
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
    async findById(id) {
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
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        return listing;
    }
    async findBySlug(slug) {
        return this.prisma.listing.findUnique({ where: { slug } });
    }
    async update(id, data) {
        return this.prisma.listing.update({ where: { id }, data });
    }
    async delete(id) {
        return this.prisma.listing.delete({ where: { id } });
    }
    async count(args) {
        return this.prisma.listing.count(args);
    }
    async incrementViewCount(id) {
        return this.prisma.listing.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
    }
};
exports.ListingsRepository = ListingsRepository;
exports.ListingsRepository = ListingsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingsRepository);
let ListingsService = class ListingsService {
    listingsRepository;
    prisma;
    constructor(listingsRepository, prisma) {
        this.listingsRepository = listingsRepository;
        this.prisma = prisma;
    }
    async create(userId, createListingDto) {
        const slug = (0, slug_utils_1.generateSlug)(createListingDto.title);
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
            status: enums_1.ListingStatus.DRAFT,
        });
        return listing;
    }
    async findAll(page = 1, limit = 20, filters) {
        const skip = (page - 1) * limit;
        const where = {};
        if (filters?.type)
            where.type = filters.type;
        if (filters?.status)
            where.status = filters.status;
        else
            where.status = enums_1.ListingStatus.ACTIVE;
        if (filters?.city)
            where.city = filters.city;
        if (filters?.minPrice)
            where.price = { ...where.price, gte: filters.minPrice };
        if (filters?.maxPrice)
            where.price = { ...where.price, lte: filters.maxPrice };
        const [listings, total] = await Promise.all([
            this.listingsRepository.findAll({ skip, take: limit, where, orderBy: { createdAt: 'desc' } }),
            this.listingsRepository.count({ where }),
        ]);
        return { data: listings, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async findById(id) {
        const listing = await this.listingsRepository.findById(id);
        await this.listingsRepository.incrementViewCount(id);
        return listing;
    }
    async findByUser(userId, page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const where = { userId };
        const [listings, total] = await Promise.all([
            this.listingsRepository.findAll({ skip, take: limit, where }),
            this.listingsRepository.count({ where }),
        ]);
        return { data: listings, total, page, limit, totalPages: Math.ceil(total / limit) };
    }
    async update(id, userId, updateListingDto) {
        const listing = await this.listingsRepository.findById(id);
        if (listing.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update your own listings');
        }
        return this.listingsRepository.update(id, updateListingDto);
    }
    async delete(id, userId) {
        const listing = await this.listingsRepository.findById(id);
        if (listing.userId !== userId) {
            throw new common_1.ForbiddenException('You can only delete your own listings');
        }
        await this.listingsRepository.delete(id);
        return { message: 'Listing deleted successfully' };
    }
    async publish(id, userId) {
        const listing = await this.listingsRepository.findById(id);
        if (listing.userId !== userId) {
            throw new common_1.ForbiddenException('You can only publish your own listings');
        }
        return this.listingsRepository.update(id, {
            status: enums_1.ListingStatus.PENDING_REVIEW,
            publishedAt: new Date(),
        });
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ListingsRepository,
        prisma_service_1.PrismaService])
], ListingsService);
//# sourceMappingURL=listings.repository.js.map