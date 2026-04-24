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
exports.SearchRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const enums_1 = require("../common/enums");
let SearchRepository = class SearchRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async searchListings(dto, skip = 0, take = 20) {
        const where = {
            status: enums_1.ListingStatus.ACTIVE,
        };
        if (dto.q) {
            where.OR = [
                { title: { contains: dto.q, mode: 'insensitive' } },
                { description: { contains: dto.q, mode: 'insensitive' } },
            ];
        }
        if (dto.type)
            where.type = dto.type;
        if (dto.city)
            where.city = { contains: dto.city, mode: 'insensitive' };
        if (dto.minPrice)
            where.price = { ...where.price, gte: dto.minPrice };
        if (dto.maxPrice)
            where.price = { ...where.price, lte: dto.maxPrice };
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
    async countResults(dto) {
        const where = { status: enums_1.ListingStatus.ACTIVE };
        if (dto.q) {
            where.OR = [
                { title: { contains: dto.q, mode: 'insensitive' } },
                { description: { contains: dto.q, mode: 'insensitive' } },
            ];
        }
        if (dto.type)
            where.type = dto.type;
        if (dto.city)
            where.city = { contains: dto.city, mode: 'insensitive' };
        return this.prisma.listing.count({ where });
    }
};
exports.SearchRepository = SearchRepository;
exports.SearchRepository = SearchRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SearchRepository);
//# sourceMappingURL=search.repository.js.map