"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const auth_repository_1 = require("./auth.repository");
const email_service_1 = require("../notifications/email.service");
const sms_service_1 = require("../notifications/sms.service");
const password_utils_1 = require("../common/utils/password.utils");
const enums_1 = require("../common/enums");
const uuid_1 = require("uuid");
let AuthService = class AuthService {
    authRepository;
    jwtService;
    configService;
    emailService;
    smsService;
    constructor(authRepository, jwtService, configService, emailService, smsService) {
        this.authRepository = authRepository;
        this.jwtService = jwtService;
        this.configService = configService;
        this.emailService = emailService;
        this.smsService = smsService;
    }
    async validateUser(identifier, password) {
        let user = await this.authRepository.findByEmail(identifier);
        if (!user) {
            user = await this.authRepository.findByPhone(identifier);
        }
        if (!user || !user.password) {
            return null;
        }
        const isPasswordValid = await (0, password_utils_1.comparePassword)(password, user.password);
        if (!isPasswordValid) {
            return null;
        }
        return user;
    }
    async register(registerDto) {
        try {
            const existingUser = await this.authRepository.findByEmail(registerDto.email);
            if (existingUser) {
                throw new common_1.ConflictException('Email already exists');
            }
            const hashedPassword = registerDto.password
                ? await (0, password_utils_1.hashPassword)(registerDto.password)
                : null;
            let firstName = registerDto.firstName;
            let lastName = registerDto.lastName;
            if (registerDto.fullName && (!firstName || !lastName)) {
                const parts = registerDto.fullName.trim().split(/\s+/);
                firstName = firstName || parts[0] || '';
                lastName = lastName || parts.slice(1).join(' ') || '';
            }
            const user = await this.authRepository.create({
                email: registerDto.email,
                password: hashedPassword,
                phone: registerDto.phone,
                role: enums_1.UserRole.CUSTOMER,
                status: enums_1.UserStatus.PENDING_VERIFICATION,
                profile: {
                    create: {
                        firstName,
                        lastName,
                    },
                },
            });
            await this.sendVerificationEmail(user);
            const tokens = await this.generateTokens(user);
            return {
                user: this.sanitizeUser(user),
                ...tokens,
            };
        }
        catch (error) {
            console.error('Error in register:', error);
            if (error instanceof common_1.ConflictException) {
                throw error;
            }
            throw new common_1.BadRequestException(error.message || 'Failed to register');
        }
    }
    async sendVerificationEmail(user) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);
        await this.authRepository.deleteUserVerificationCodes(user.id);
        await this.authRepository.createVerificationCode(user.id, code, expiresAt);
        const appName = this.configService.get('email.appName');
        await this.emailService.sendEmail(user.email, `Verify your email - ${appName}`, `<h1>Welcome to ${appName}</h1>
       <p>Your verification code is: <strong>{{code}}</strong></p>
       <p>This code will expire in 10 minutes.</p>`, { code });
    }
    async verifyEmail(email, code) {
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const verificationCode = await this.authRepository.findVerificationCode(user.id, code);
        if (!verificationCode || verificationCode.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired verification code');
        }
        await this.authRepository.update(user.id, {
            emailVerified: true,
            status: enums_1.UserStatus.ACTIVE,
        });
        await this.authRepository.deleteUserVerificationCodes(user.id);
        return { message: 'Email verified successfully' };
    }
    async resendVerification(email) {
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.emailVerified) {
            throw new common_1.BadRequestException('Email is already verified');
        }
        await this.sendVerificationEmail(user);
        return { message: 'Verification email resent' };
    }
    async sendOtp(email) {
        try {
            if (!email || !email.includes('@')) {
                throw new common_1.BadRequestException('Invalid email address');
            }
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date();
            expiresAt.setMinutes(expiresAt.getMinutes() + 10);
            let user = await this.authRepository.findByEmail(email);
            if (!user) {
                user = await this.authRepository.create({
                    email,
                    status: enums_1.UserStatus.PENDING_VERIFICATION,
                    role: enums_1.UserRole.CUSTOMER,
                });
            }
            await this.authRepository.deleteUserVerificationCodes(user.id);
            await this.authRepository.createVerificationCode(user.id, code, expiresAt);
            const appName = this.configService.get('email.appName');
            await this.emailService.sendEmail(email, `Your ${appName} Login Code`, '<h1>Login Verification</h1><p>Your 6-digit verification code is: <strong>{{code}}</strong></p><p>This code will expire in 10 minutes.</p>', { code });
            return { message: 'OTP sent successfully' };
        }
        catch (error) {
            console.error('Error in sendOtp:', error);
            if (error instanceof common_1.BadRequestException || error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.BadRequestException(error.message || 'Failed to send OTP');
        }
    }
    async verifyOtp(email, code) {
        if (!email || !code || code.length !== 6) {
            throw new common_1.BadRequestException('Invalid email or OTP code');
        }
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new common_1.BadRequestException('User not found');
        }
        const verificationCode = await this.authRepository.findVerificationCode(user.id, code);
        if (!verificationCode) {
            throw new common_1.BadRequestException('Invalid verification code');
        }
        if (verificationCode.expiresAt < new Date()) {
            await this.authRepository.deleteVerificationCode(verificationCode.id);
            throw new common_1.BadRequestException('Verification code has expired');
        }
        await this.authRepository.update(user.id, {
            status: enums_1.UserStatus.ACTIVE,
            emailVerified: true,
        });
        await this.authRepository.deleteVerificationCode(verificationCode.id);
        await this.authRepository.updateLastLogin(user.id);
        const tokens = await this.generateTokens(user);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async login(loginDto) {
        const user = await this.validateUser(loginDto.email, loginDto.password);
        if (!user) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        if (user.status === enums_1.UserStatus.SUSPENDED) {
            throw new common_1.UnauthorizedException('Your account has been suspended');
        }
        if (user.status === enums_1.UserStatus.BANNED) {
            throw new common_1.UnauthorizedException('Your account has been banned');
        }
        await this.authRepository.updateLastLogin(user.id);
        const tokens = await this.generateTokens(user);
        return {
            user: this.sanitizeUser(user),
            ...tokens,
        };
    }
    async refreshToken(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('jwt.refreshSecret'),
            });
            const user = await this.authRepository.findById(payload.sub);
            if (!user) {
                throw new common_1.UnauthorizedException('User not found');
            }
            const tokens = await this.generateTokens(user);
            return tokens;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async forgotPassword(forgotPasswordDto) {
        const user = await this.authRepository.findByEmail(forgotPasswordDto.email);
        if (!user) {
            return { message: 'If the email exists, a reset link has been sent' };
        }
        await this.authRepository.deleteUserPasswordResetTokens(user.id);
        const token = (0, uuid_1.v4)();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);
        await this.authRepository.createPasswordResetToken(user.id, token, expiresAt);
        const appName = this.configService.get('email.appName');
        const resetUrl = `${this.configService.get('app.frontendUrl')}/reset-password?token=${token}`;
        await this.emailService.sendEmail(user.email, `Password Reset Request - ${appName}`, `<h1>Password Reset</h1>
       <p>You requested a password reset. Click the link below to reset your password:</p>
       <a href="{{resetUrl}}">Reset Password</a>
       <p>This link will expire in 1 hour.</p>`, { resetUrl });
        return { message: 'If the email exists, a reset link has been sent' };
    }
    async resetPassword(resetPasswordDto) {
        const resetToken = await this.authRepository.findPasswordResetToken(resetPasswordDto.token);
        if (!resetToken || resetToken.expiresAt < new Date()) {
            throw new common_1.BadRequestException('Invalid or expired reset token');
        }
        const hashedPassword = await (0, password_utils_1.hashPassword)(resetPasswordDto.newPassword);
        await this.authRepository.update(resetToken.userId, {
            password: hashedPassword,
        });
        await this.authRepository.deletePasswordResetToken(resetPasswordDto.token);
        return { message: 'Password reset successful' };
    }
    async verifyPhone(phone, firebaseToken) {
        const user = await this.authRepository.findByPhone(phone);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        await this.authRepository.update(user.id, {
            phoneVerified: true,
        });
        return { message: 'Phone verified successfully' };
    }
    async generateTokens(user) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.secret'),
            expiresIn: (this.configService.get('jwt.expiresIn') || '1d'),
        });
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get('jwt.refreshSecret'),
            expiresIn: (this.configService.get('jwt.refreshExpiresIn') || '7d'),
        });
        return { accessToken, refreshToken };
    }
    sanitizeUser(user) {
        const { password, ...result } = user;
        return result;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [auth_repository_1.AuthRepository,
        jwt_1.JwtService,
        config_1.ConfigService,
        email_service_1.EmailService,
        sms_service_1.SmsService])
], AuthService);
//# sourceMappingURL=auth.service.js.map