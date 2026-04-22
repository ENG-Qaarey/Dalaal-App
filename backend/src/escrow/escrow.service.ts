import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { EscrowRepository } from './escrow.repository';
import { CreateEscrowDto } from './dto';
import { EscrowStatus } from '../common/enums';

@Injectable()
export class EscrowService {
  constructor(private readonly escrowRepository: EscrowRepository) {}

  async createEscrow(buyerId: string, dto: CreateEscrowDto) {
    const platformFee = dto.amount * 0.025; // 2.5%
    const netAmount = dto.amount - platformFee;

    return this.escrowRepository.create({
      buyerId,
      sellerId: dto.sellerId,
      listingId: dto.listingId,
      amount: dto.amount,
      platformFee,
      netAmount,
      status: EscrowStatus.PENDING_DEPOSIT,
    });
  }

  async getMyEscrows(userId: string) {
    return this.escrowRepository.findByUserId(userId);
  }

  async releaseEscrow(escrowId: string, userId: string) {
    const escrow = await this.escrowRepository.findById(escrowId);
    if (!escrow) throw new NotFoundException('Escrow not found');
    if (escrow.buyerId !== userId) throw new ForbiddenException('Only the buyer can release the escrow');

    return this.escrowRepository.updateStatus(escrowId, EscrowStatus.RELEASED);
  }
}
