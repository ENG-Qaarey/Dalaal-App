import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
declare const LocalStrategy_base: new (...args: [] | [options: import("passport-local").IStrategyOptionsWithRequest] | [options: import("passport-local").IStrategyOptions]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class LocalStrategy extends LocalStrategy_base {
    private readonly authService;
    constructor(authService: AuthService);
    validate(email: string, password: string): Promise<{
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            currency: string | null;
            city: string | null;
            firstName: string | null;
            lastName: string | null;
            avatar: string | null;
            bio: string | null;
            country: string | null;
            isDiaspora: boolean;
            language: string | null;
            whatsappNumber: string | null;
            telegramHandle: string | null;
            totalListings: number;
            rating: number | null;
            reviewCount: number;
            responseRate: number | null;
        } | null;
    } & {
        email: string;
        password: string | null;
        id: string;
        phone: string | null;
        googleId: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        status: import(".prisma/client").$Enums.UserStatus;
        emailVerified: boolean;
        phoneVerified: boolean;
        twoFactorEnabled: boolean;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
