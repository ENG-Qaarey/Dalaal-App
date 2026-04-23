import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseProvider implements OnModuleInit {
  private readonly logger = new Logger(FirebaseProvider.name);
  private app: FirebaseApp;
  private adminApp: admin.app.App;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    try {
      const firebaseConfig = {
        apiKey: this.configService.get<string>('firebase.apiKey'),
        authDomain: this.configService.get<string>('firebase.authDomain'),
        projectId: this.configService.get<string>('firebase.projectId'),
        storageBucket: this.configService.get<string>('firebase.storageBucket'),
        messagingSenderId: this.configService.get<string>('firebase.messagingSenderId'),
        appId: this.configService.get<string>('firebase.appId'),
        measurementId: this.configService.get<string>('firebase.measurementId'),
      };

      // Initialize Firebase Client SDK (as requested by user)
      this.app = initializeApp(firebaseConfig);
      this.logger.log('Firebase Client SDK initialized successfully');

      // Note: Analytics is typically for browser-only environments.
      // In a Node.js environment, getAnalytics might not work or is not needed.
      // We'll skip it here to avoid server-side errors.

      // Initialize Firebase Admin SDK
      // For full functionality, a service account is recommended.
      // Here we initialize with default credentials or just project ID.
      if (!admin.apps.length) {
        this.adminApp = admin.initializeApp({
          projectId: firebaseConfig.projectId,
        });
        this.logger.log('Firebase Admin SDK initialized successfully');
      }
    } catch (error) {
      this.logger.error('Failed to initialize Firebase', error.stack);
    }
  }

  getApp(): FirebaseApp {
    return this.app;
  }

  getAdminApp(): admin.app.App {
    return this.adminApp;
  }
}
