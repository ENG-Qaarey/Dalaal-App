import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { EmailService } from '../notifications/email.service';
import { SmsService } from '../notifications/sms.service';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { hashPassword, comparePassword } from '../common/utils/password.utils';
import { UserRole, UserStatus } from '../common/enums';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);
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
    const existingUser = await this.authRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await hashPassword(registerDto.password);

    const user = await this.authRepository.create({
      email: registerDto.email,
      password: hashedPassword,
      phone: registerDto.phone,
      role: UserRole.CUSTOMER,
      status: UserStatus.PENDING_VERIFICATION,
      profile: {
        create: {
          firstName: registerDto.firstName,
          lastName: registerDto.lastName,
        },
      },
    });

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.status === UserStatus.SUSPENDED) {
      throw new UnauthorizedException('Your account has been suspended');
    }

    if (user.status === UserStatus.BANNED) {
      throw new UnauthorizedException('Your account has been banned');
    }

    await this.authRepository.updateLastLogin(user.id);

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
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

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.authRepository.findByEmail(forgotPasswordDto.email);
    if (!user) {
      // Don't reveal if user exists
      return { message: 'If the email exists, a reset link has been sent' };
    }

    // Delete existing tokens
    await this.authRepository.deleteUserPasswordResetTokens(user.id);

    // Create new token
    const token = uuidv4();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1 hour expiry

    await this.authRepository.createPasswordResetToken(user.id, token, expiresAt);

    // Send email
    const appName = this.configService.get<string>('email.appName');
    const resetUrl = `${this.configService.get<string>('app.frontendUrl')}/reset-password?token=${token}`;

    await this.emailService.sendEmail(
      user.email,
      `Password Reset Request - ${appName}`,
      `<h1>Password Reset</h1>
       <p>You requested a password reset. Click the link below to reset your password:</p>
       <a href="{{resetUrl}}">Reset Password</a>
       <p>This link will expire in 1 hour.</p>`,
      { resetUrl },
    );

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const resetToken = await this.authRepository.findPasswordResetToken(resetPasswordDto.token);

    if (!resetToken || resetToken.expiresAt < new Date()) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hashedPassword = await hashPassword(resetPasswordDto.newPassword);

    await this.authRepository.update(resetToken.userId, {
      password: hashedPassword,
    });

    await this.authRepository.deletePasswordResetToken(resetPasswordDto.token);

    return { message: 'Password reset successful' };
  }

  async googleLogin(googleUser: any) {
    if (!googleUser) {
      throw new BadRequestException('Google authentication failed');
    }

    let user: any = await this.authRepository.findByEmail(googleUser.email);

    if (!user) {
      // Create new user if they don't exist
      user = await this.authRepository.create({
        email: googleUser.email,
        googleId: googleUser.googleId,
        status: UserStatus.ACTIVE, // Google users are pre-verified
        emailVerified: true,
        role: UserRole.CUSTOMER,
        profile: {
          create: {
            firstName: googleUser.name?.split(' ')?.[0] || '',
            lastName: googleUser.name?.split(' ')?.[1] || '',
            avatar: googleUser.avatar,
          },
        },
      });
    } else if (!user.googleId) {
      // If user exists but hasn't linked Google yet
      user = await this.authRepository.update(user.id, {
        googleId: googleUser.googleId,
        emailVerified: true,
      });
    }

    if (!user) {
      throw new BadRequestException('Failed to process Google login');
    }

    await this.authRepository.updateLastLogin(user.id);

    const tokens = await this.generateTokens(user);

    return {
      user: this.sanitizeUser(user),
      ...tokens,
    };
  }

  async verifyPhone(phone: string, firebaseToken: string) {
    try {
      const decodedToken = await this.smsService.verifyFirebaseToken(firebaseToken);
      
      // The token verification ensures the user has access to the phone number
      // Check if the user exists and update their status
      const user = await this.authRepository.findByEmail(decodedToken.email || '');
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this.authRepository.update(user.id, {
        phoneVerified: true,
        status: UserStatus.ACTIVE,
      });

      return { message: 'Phone number verified successfully' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired Firebase token');
    }
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: (this.configService.get<string>('jwt.expiresIn') || '1d') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: (this.configService.get<string>('jwt.refreshExpiresIn') || '7d') as any,
    });

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { password, ...result } = user;
    return result;
  }
}
