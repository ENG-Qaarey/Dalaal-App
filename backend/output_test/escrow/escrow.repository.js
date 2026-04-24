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
exports.EscrowRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const enums_1 = require("../common/enums");
let EscrowRepository = class EscrowRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.escrow.create({ data });
    }
    async findById(id) {
        return this.prisma.escrow.findUnique({
            where: { id },
            include: { listing: true, buyer: true, seller: true },
        });
    }
    async findByUserId(userId) {
        return this.prisma.escrow.findMany({
            where: { OR: [{ buyerId: userId }, { sellerId: userId }] },
            include: { listing: true, buyer: true, seller: true },
        });
    }
    async updateStatus(id, status) {
        return this.prisma.escrow.update({
            where: { id },
            data: { status, releasedAt: status === enums_1.EscrowStatus.RELEASED ? new Date() : undefined },
        });
    }
};
exports.EscrowRepository = EscrowRepository;
exports.EscrowRepository = EscrowRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EscrowRepository);
//# sourceMappingURL=escrow.repository.js.map