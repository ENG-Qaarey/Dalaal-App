import { FirebaseProvider } from '../providers/push/firebase.provider';
export declare class SmsService {
    private readonly firebaseProvider;
    private readonly logger;
    constructor(firebaseProvider: FirebaseProvider);
    sendSms(to: string, message: string): Promise<void>;
    verifyFirebaseToken(idToken: string): Promise<import("firebase-admin/lib/auth/token-verifier").DecodedIdToken>;
}
