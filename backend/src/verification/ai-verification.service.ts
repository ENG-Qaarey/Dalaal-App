import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AiVerificationService {
  private readonly logger = new Logger(AiVerificationService.name);

  async verifyDocument(frontUrl: string, backUrl?: string, selfieUrl?: string) {
    this.logger.log('Performing AI verification (simulated)');
    return {
      isVerified: true,
      confidenceScore: 0.95,
      extractedData: {
        fullName: 'Test User',
        documentNumber: 'SO-123456',
        expiryDate: '2030-01-01',
      },
    };
  }
}
