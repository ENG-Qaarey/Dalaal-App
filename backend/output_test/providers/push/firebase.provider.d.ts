import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FirebaseApp } from 'firebase/app';
import * as admin from 'firebase-admin';
export declare class FirebaseProvider implements OnModuleInit {
    private configService;
    private readonly logger;
    private app;
    private adminApp;
    constructor(configService: ConfigService);
    onModuleInit(): void;
    private initializeFirebase;
    getApp(): FirebaseApp;
    getAdminApp(): admin.app.App;
}
