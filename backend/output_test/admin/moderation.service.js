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
exports.ModerationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let ModerationService = class ModerationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPendingListings() {
        return this.prisma.listing.findMany({
            where: { status: 'PENDING_REVIEW' },
            include: { user: { include: { profile: true } } },
        });
    }
    async approveListing(id) {
        return this.prisma.listing.update({
            where: { id },
            data: { status: 'ACTIVE' },
        });
    }
    async rejectListing(id, reason) {
        return this.prisma.listing.update({
            where: { id },
            data: { status: 'REJECTED' },
        });
    }
};
exports.ModerationService = ModerationService;
exports.ModerationService = ModerationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ModerationService);
//# sourceMappingURL=moderation.service.js.map