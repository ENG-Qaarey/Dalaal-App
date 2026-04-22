import { Injectable, BadRequestException } from '@nestjs/common';
import { PaymentsRepository } from './payments.repository';
import { CreatePaymentDto } from './dto';
import { PaymentStatus } from '../common/enums';

@Injectable()
export class PaymentsService {
  constructor(private readonly paymentsRepository: PaymentsRepository) {}

  async createPayment(userId: string, dto: CreatePaymentDto) {
    const payment = await this.paymentsRepository.create({
      userId,
      amount: dto.amount,
      provider: dto.provider,
      type: dto.type,
      listingId: dto.listingId,
      recipientId: dto.recipientId,
      status: PaymentStatus.PENDING,
    });

    // Here we would call the mobile money provider API (EVC+, ZAAD, SAHAL)
    // For now, we simulate success
    return payment;
  }

  async getMyPayments(userId: string) {
    return this.paymentsRepository.findByUserId(userId);
  }

  async verifyPayment(paymentId: string, transactionId: string) {
    const payment = await this.paymentsRepository.findById(paymentId);
    if (!payment) throw new BadRequestException('Payment not found');

    // Simulate verification with provider
    return this.paymentsRepository.updateStatus(paymentId, PaymentStatus.COMPLETED, transactionId);
  }
}
