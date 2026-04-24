import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../database/prisma.service';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly prisma;
    constructor(prisma: PrismaService, configService: ConfigService);
    validate(payload: JwtPayload): Promise<{
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
