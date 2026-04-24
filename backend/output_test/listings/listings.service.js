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
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const enums_1 = require("../common/enums");
const slug_utils_1 = require("../common/utils/slug.utils");
let ListingsService = class ListingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createListingDto) {
        const slug = (0, slug_utils_1.generateSlug)(createListingDto.title);
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
                status: enums_1.ListingStatus.DRAFT,
            },
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
        await this.prisma.listing.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
        return listing;
    }
    async update(id, userId, updateListingDto) {
        const listing = await this.prisma.listing.findUnique({ where: { id } });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        if (listing.userId !== userId)
            throw new common_1.ForbiddenException('You can only update your own listings');
        return this.prisma.listing.update({
            where: { id },
            data: updateListingDto,
        });
    }
    async delete(id, userId) {
        const listing = await this.prisma.listing.findUnique({ where: { id } });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        if (listing.userId !== userId)
            throw new common_1.ForbiddenException('You can only delete your own listings');
        await this.prisma.listing.delete({ where: { id } });
        return { message: 'Listing deleted successfully' };
    }
    async publish(id, userId) {
        const listing = await this.prisma.listing.findUnique({ where: { id } });
        if (!listing)
            throw new common_1.NotFoundException('Listing not found');
        if (listing.userId !== userId)
            throw new common_1.ForbiddenException('You can only publish your own listings');
        return this.prisma.listing.update({
            where: { id },
            data: { status: enums_1.ListingStatus.PENDING_REVIEW, publishedAt: new Date() },
        });
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map