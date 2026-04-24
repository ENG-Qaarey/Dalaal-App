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
exports.EscrowService = void 0;
const common_1 = require("@nestjs/common");
const escrow_repository_1 = require("./escrow.repository");
const enums_1 = require("../common/enums");
let EscrowService = class EscrowService {
    escrowRepository;
    constructor(escrowRepository) {
        this.escrowRepository = escrowRepository;
    }
    async createEscrow(buyerId, dto) {
        const platformFee = dto.amount * 0.025;
        const netAmount = dto.amount - platformFee;
        return this.escrowRepository.create({
            buyerId,
            sellerId: dto.sellerId,
            listingId: dto.listingId,
            amount: dto.amount,
            platformFee,
            netAmount,
            status: enums_1.EscrowStatus.PENDING_DEPOSIT,
        });
    }
    async getMyEscrows(userId) {
        return this.escrowRepository.findByUserId(userId);
    }
    async releaseEscrow(escrowId, userId) {
        const escrow = await this.escrowRepository.findById(escrowId);
        if (!escrow)
            throw new common_1.NotFoundException('Escrow not found');
        if (escrow.buyerId !== userId)
            throw new common_1.ForbiddenException('Only the buyer can release the escrow');
        return this.escrowRepository.updateStatus(escrowId, enums_1.EscrowStatus.RELEASED);
    }
};
exports.EscrowService = EscrowService;
exports.EscrowService = EscrowService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [escrow_repository_1.EscrowRepository])
], EscrowService);
//# sourceMappingURL=escrow.service.js.map