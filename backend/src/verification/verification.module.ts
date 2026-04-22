import { Module } from '@nestjs/common';
import { VerificationController } from './verification.controller';
import { VerificationService } from './verification.service';
import { VerificationRepository } from './verification.repository';
import { AiVerificationService } from './ai-verification.service';

@Module({
  controllers: [VerificationController],
  providers: [
    VerificationService,
    VerificationRepository,
    AiVerificationService,
  ],
  exports: [VerificationService],
})
export class VerificationModule {}
