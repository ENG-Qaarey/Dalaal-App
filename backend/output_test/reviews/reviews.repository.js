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
exports.ReviewsRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ReviewsRepository = class ReviewsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(reviewerId, data) {
        return this.prisma.review.create({
            data: {
                reviewerId,
                ...data,
            },
        });
    }
    async findByRevieweeId(revieweeId, skip = 0, take = 20) {
        return this.prisma.review.findMany({
            where: { revieweeId },
            include: { reviewer: { include: { profile: true } } },
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        });
    }
    async findByListingId(listingId) {
        return this.prisma.review.findMany({
            where: { listingId },
            include: { reviewer: { include: { profile: true } } },
            orderBy: { createdAt: 'desc' },
        });
    }
    async getAverageRating(revieweeId) {
        return this.prisma.review.aggregate({
            where: { revieweeId },
            _avg: { overallRating: true },
            _count: { id: true },
        });
    }
};
exports.ReviewsRepository = ReviewsRepository;
exports.ReviewsRepository = ReviewsRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsRepository);
//# sourceMappingURL=reviews.repository.js.map