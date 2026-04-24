import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { EmailService } from '../notifications/email.service';
import { SmsService } from '../notifications/sms.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
export declare class AuthService {
    private readonly authRepository;
    private readonly jwtService;
    private readonly configService;
    private readonly emailService;
    private readonly smsService;
    constructor(authRepository: AuthRepository, jwtService: JwtService, configService: ConfigService, emailService: EmailService, smsService: SmsService);
    validateUser(identifier: string, password: string): Promise<({
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
    register(registerDto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    sendVerificationEmail(user: any): Promise<void>;
    verifyEmail(email: string, code: string): Promise<{
        message: string;
    }>;
    resendVerification(email: string): Promise<{
        message: string;
    }>;
    sendOtp(email: string): Promise<{
        message: string;
    }>;
    verifyOtp(email: string, code: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    login(loginDto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: any;
    }>;
    refreshToken(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
    resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{
        message: string;
    }>;
    verifyPhone(phone: string, firebaseToken: string): Promise<{
        message: string;
    }>;
    private generateTokens;
    private sanitizeUser;
}
