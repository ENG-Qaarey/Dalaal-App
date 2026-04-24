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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const payments_repository_1 = require("./payments.repository");
const enums_1 = require("../common/enums");
let PaymentsService = class PaymentsService {
    paymentsRepository;
    constructor(paymentsRepository) {
        this.paymentsRepository = paymentsRepository;
    }
    async createPayment(userId, dto) {
        const payment = await this.paymentsRepository.create({
            userId,
            amount: dto.amount,
            provider: dto.provider,
            type: dto.type,
            listingId: dto.listingId,
            recipientId: dto.recipientId,
            status: enums_1.PaymentStatus.PENDING,
        });
        return payment;
    }
    async getMyPayments(userId) {
        return this.paymentsRepository.findByUserId(userId);
    }
    async verifyPayment(paymentId, transactionId) {
        const payment = await this.paymentsRepository.findById(paymentId);
        if (!payment)
            throw new common_1.BadRequestException('Payment not found');
        return this.paymentsRepository.updateStatus(paymentId, enums_1.PaymentStatus.COMPLETED, transactionId);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [payments_repository_1.PaymentsRepository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map