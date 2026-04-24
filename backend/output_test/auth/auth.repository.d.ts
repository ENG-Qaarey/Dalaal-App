import { PrismaService } from '../database/prisma.service';
import { Prisma } from '@prisma/client';
export declare class AuthRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<({
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
    }) | null>;
    findByPhone(phone: string): Promise<({
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
    }) | null>;
    findById(id: string): Promise<({
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
    }) | null>;
    create(data: Prisma.UserCreateInput): Promise<{
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
    update(id: string, data: Prisma.UserUpdateInput): Promise<{
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
    updateLastLogin(id: string): Promise<{
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
    createPasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
    }>;
    findPasswordResetToken(token: string): Promise<({
        user: {
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
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
    }) | null>;
    deletePasswordResetToken(token: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        token: string;
    }>;
    deleteUserPasswordResetTokens(userId: string): Promise<Prisma.BatchPayload>;
    createVerificationCode(userId: string, code: string, expiresAt: Date): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        code: string;
    }>;
    findVerificationCode(userId: string, code: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        code: string;
    } | null>;
    deleteVerificationCode(id: string): Promise<{
        id: string;
        createdAt: Date;
        userId: string;
        expiresAt: Date;
        code: string;
    }>;
    deleteUserVerificationCodes(userId: string): Promise<Prisma.BatchPayload>;
}
