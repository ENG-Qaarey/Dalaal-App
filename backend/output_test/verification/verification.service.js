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
exports.VerificationService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const enums_1 = require("../common/enums");
let VerificationService = class VerificationService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createVerification(userId, dto) {
        return this.prisma.identityVerification.create({
            data: {
                userId,
                ...dto,
                status: enums_1.VerificationStatus.PENDING,
            },
        });
    }
    async getMyVerification(userId) {
        return this.prisma.identityVerification.findUnique({
            where: { userId },
        });
    }
    async updateStatus(id, status, reason) {
        return this.prisma.$transaction(async (tx) => {
            const verification = await tx.identityVerification.update({
                where: { id },
                data: {
                    status,
                    rejectionReason: reason,
                    reviewedAt: status === enums_1.VerificationStatus.APPROVED ? new Date() : undefined,
                },
            });
            if (status === enums_1.VerificationStatus.APPROVED) {
                await tx.user.update({
                    where: { id: verification.userId },
                    data: { status: 'ACTIVE' },
                });
            }
            return verification;
        });
    }
    async findAllPending() {
        return this.prisma.identityVerification.findMany({
            where: { status: enums_1.VerificationStatus.PENDING },
            include: { user: { include: { profile: true } } },
        });
    }
};
exports.VerificationService = VerificationService;
exports.VerificationService = VerificationService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VerificationService);
//# sourceMappingURL=verification.service.js.map