import { Injectable, Logger } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';
import { FirebaseProvider } from '../providers/push/firebase.provider';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);

  constructor(private readonly firebaseProvider: FirebaseProvider) {}

  async sendSms(to: string, message: string) {
    this.logger.log(`Sending SMS to ${to}: ${message} (simulated)`);
    // Note: To send actual SMS via Firebase, you typically use Firebase Auth 
    // on the client side, or Cloud Functions with a triggered SMS service.
  }

  async verifyFirebaseToken(idToken: string): Promise<DecodedIdToken> {
    try {
      const decodedToken = await this.firebaseProvider.getAdminApp().auth().verifyIdToken(idToken);
      this.logger.log(`Firebase token verified for user: ${decodedToken.uid}`);
      return decodedToken;
    } catch (error) {
      this.logger.error('Failed to verify Firebase token', error.stack);
      throw error;
    }
  }
}
