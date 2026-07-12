import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseProvider {
  private readonly logger = new Logger(FirebaseProvider.name);
  private app: admin.app.App;

  constructor() {
    if (!admin.apps.length) {
      this.app = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
      this.logger.log('Firebase Admin initialized');
    } else {
      this.app = admin.apps[0]!;
    }
  }

  getAdminApp(): admin.app.App {
    return this.app;
  }
}
