import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { EmailService } from '../notifications/email.service';
import {
  buildVerificationEmailHtml,
  getVerificationEmailSubject,
} from '../notifications/email-templates';
import { SmsService } from '../notifications/sms.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { hashPassword, comparePassword } from '../common/utils/password.utils';
import { UserRole, UserStatus } from '../common/enums';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  async validateUser(identifier: string, password: string) {
    const user = await this.authRepository.findByIdentifier(identifier);

    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async register(registerDto: RegisterDto) {
    try {
      const existingUser = await this.authRepository.findByEmail(registerDto.email);
      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const sessionToken = this.generateSessionToken();

      const hashedPassword = registerDto.password 
        ? await hashPassword(registerDto.password) 
        : null;

      // Handle fullName to extract firstName and lastName
      const nameParts = registerDto.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';

      const user = await this.authRepository.create({
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
        phone: registerDto.phone,
        role: (registerDto.role as any) || UserRole.CUSTOMER,
        status: UserStatus.PENDING_VERIFICATION,
        sessionToken,
        profile: {
          create: {
            firstName,
            lastName,
          },
        },
      });

      // Send verification email
      await this.sendVerificationEmail(user);

      // Generate tokens
      const tokens = await this.generateTokens(user, sessionToken);

      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch (error) {
      this.logger.error('Error in register:', error);
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to register');
    }
  }

  async sendVerificationEmail(user: any) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    await this.authRepository.deleteUserVerificationCodes(user.id);
    await this.authRepository.createVerificationCode(user.id, code, expiresAt);

    // Send email to user
    try {
      const appName = this.configService.get<string>('email.appName') || 'Dalaal-App';
      await this.emailService.sendEmail(
        user.email,
        getVerificationEmailSubject('email-verification', appName),
        buildVerificationEmailHtml({ kind: 'email-verification', code, appName }),
        { code },
      );
      this.logger.log(`Verification email sent to: ${user.email}`);
    } catch (emailError) {
      this.logger.warn(`Failed to send email: ${emailError.message}`);
    }
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const verificationCode = await this.authRepository.findVerificationCode(user.id, code);

    if (!verificationCode || verificationCode.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    const updatedUser = await this.authRepository.update(user.id, {
      emailVerified: true,
      status: UserStatus.ACTIVE,
    });

    await this.authRepository.deleteUserVerificationCodes(user.id);

    const tokens = await this.generateTokens(updatedUser, updatedUser.sessionToken || '');

    return {
      message: 'Email verified successfully',
      user: this.sanitizeUser(updatedUser),
      ...tokens,
    };
  }

  async resendVerification(email: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    await this.sendVerificationEmail(user);
    return { message: 'Verification email resent' };
  }

  async sendOtp(email: string) {
    try {
      // Basic validation
      if (!email || !email.includes('@')) {
        throw new BadRequestException('Invalid email address');
      }

      // Generate 6-digit OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minutes expiry

      // Check if user exists, if not create a pending user or just allow OTP
      let user = await this.authRepository.findByEmail(email);
      if (!user) {
        // Create user if doesn't exist
        user = await this.authRepository.create({
          email,
          status: UserStatus.PENDING_VERIFICATION,
          role: UserRole.CUSTOMER,
        });
      }

      // Delete existing codes
      await this.authRepository.deleteUserVerificationCodes(user.id);

      // Store OTP in database
      await this.authRepository.createVerificationCode(user.id, code, expiresAt);

      // Send email via SMTP
      const appName = this.configService.get<string>('email.appName') || 'Dalaal-App';
      await this.emailService.sendEmail(
        email,
        getVerificationEmailSubject('login', appName),
        buildVerificationEmailHtml({ kind: 'login', code, appName }),
        { code },
      );

      return { message: 'OTP sent successfully' };
    } catch (error) {
      this.logger.error('Error in sendOtp:', error);
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(error.message || 'Failed to send OTP');
    }
  }

  async verifyOtp(email: string, code: string) {
    if (!email || !code || code.length !== 6) {
      throw new BadRequestException('Invalid email or OTP code');
    }

    const user = await this.authRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const verificationCode = await this.authRepository.findVerificationCode(user.id, code);

    if (!verificationCode) {
      throw new BadRequestException('Invalid verification code');
    }

    if (verificationCode.expiresAt < new Date()) {
      await this.authRepository.deleteVerificationCode(verificationCode.id);
      throw new BadRequestException('Verification code has expired');
    }

    const sessionToken = this.generateSessionToken();

    // Mark user as active and email verified
    const updatedUser = await this.authRepository.update(user.id, {
      status: UserStatus.ACTIVE,
      emailVerified: true,
      sessionToken,
      lastLoginAt: new Date(),
    });

    // Delete the code after successful verification
    await this.authRepository.deleteVerificationCode(verificationCode.id);

    // Update last login and return the freshest user payload to the app.
    // Generate tokens
    const tokens = await this.generateTokens(updatedUser, sessionToken);

    return {
      user: this.sanitizeUser(updatedUser),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.identifier, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Your account has been suspended');
    }

    if (user.status === UserStatus.BANNED) {
      throw new UnauthorizedException('Your account has been banned');
    }

    if (user.status === UserStatus.PENDING_VERIFICATION) {
      throw new UnauthorizedException('Please verify your email before logging in');
    }

    const sessionToken = this.generateSessionToken();
    const updatedUser = await this.authRepository.update(user.id, {
      sessionToken,
      lastLoginAt: new Date(),
    });

    const tokens = await this.generateTokens(updatedUser, sessionToken);

    return {
      user: this.sanitizeUser(updatedUser),
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('jwt.refreshSecret'),
      });

      const user = await this.authRepository.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (!payload.sessionToken || !user.sessionToken || payload.sessionToken !== user.sessionToken) {
        throw new UnauthorizedException('Session expired. Logged in on another device.');
      }

      const tokens = await this.generateTokens(user, user.sessionToken);
      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.authRepository.findByEmail(forgotPasswordDto.email);

    // Return generic message to prevent user enumeration
    if (!user) {
      return { message: 'If an account exists with that email, a reset code has been sent.' };
    }

    // Delete existing verification codes for this user
    await this.authRepository.deleteUserVerificationCodes(user.id);

    // Create new 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes expiry

    await this.authRepository.createVerificationCode(user.id, code, expiresAt);

    // Send email
    const appName = this.configService.get<string>('email.appName') || 'Dalaal-App';
    await this.emailService.sendEmail(
      user.email,
      getVerificationEmailSubject('password-reset', appName),
      buildVerificationEmailHtml({ kind: 'password-reset', code, appName }),
      { code },
    );

    return { message: 'If an account exists with that email, a reset code has been sent.' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const user = await this.authRepository.findByEmail(resetPasswordDto.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const verificationCode = await this.authRepository.findVerificationCode(user.id, resetPasswordDto.code);

    if (!verificationCode || verificationCode.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    const hashedPassword = await hashPassword(resetPasswordDto.newPassword);

    await this.authRepository.update(user.id, {
      password: hashedPassword,
    });

    // Delete the code after successful reset
    await this.authRepository.deleteUserVerificationCodes(user.id);

    return { message: 'Password reset successful' };
  }

  async verifyPhone(phone: string, firebaseToken: string) {
    // This is a placeholder for Firebase phone verification
    // In a real app, you'd verify the token with Firebase Admin SDK
    const user = await this.authRepository.findByPhone(phone);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.authRepository.update(user.id, {
      phoneVerified: true,
    });

    return { message: 'Phone verified successfully' };
  }

  async logout(userId: string) {
    await this.authRepository.update(userId, { sessionToken: null });
    return { message: 'Logout successful' };
  }

  private generateSessionToken() {
    return randomBytes(32).toString('hex');
  }

  private async generateTokens(user: any, sessionToken: string) {
    const rolePermissions = await (
      this.authRepository as any
    ).prisma.rolePermission.findMany({
      where: { role: user.role },
      include: { permission: true },
    });

    const permissions = rolePermissions.map((rp: any) => rp.permission.name);

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      permissions,
      sessionToken,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: 604800, // 7 days in seconds
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: 2592000, // 30 days in seconds
    });

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { password, ...result } = user;
    return result;
  }
}
