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

  async validateUser(identifier: string, password: string) {
    let user = await this.authRepository.findByEmail(identifier);
    
    if (!user) {
      user = await this.authRepository.findByPhone(identifier);
    }

    if (!user) {
      user = await this.authRepository.findByUsername(identifier);
    }

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
        role: UserRole.CUSTOMER,
        status: UserStatus.PENDING_VERIFICATION,
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
      const tokens = await this.generateTokens(user);

      return {
        user: this.sanitizeUser(user),
        ...tokens,
      };
    } catch (error) {
      console.error('Error in register:', error);
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

    // Log code to console for development
    console.log('\n========================================');
    console.log('📧 VERIFICATION CODE');
    console.log('Email:', user.email);
    console.log('Code:', code);
    console.log('========================================\n');

    // Send email to user
    try {
      const appName = this.configService.get<string>('email.appName');
      await this.emailService.sendEmail(
        user.email,
        `Verify your email - ${appName}`,
        `<h1>Welcome to ${appName}</h1>
         <p>Your verification code is: <strong>${code}</strong></p>
         <p>This code will expire in 10 minutes.</p>`,
        { code },
      );
      console.log('✅ Verification email sent to:', user.email);
    } catch (emailError) {
      console.log('⚠️ Failed to send email:', emailError.message);
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

    await this.authRepository.update(user.id, {
      emailVerified: true,
      status: UserStatus.ACTIVE,
    });

    await this.authRepository.deleteUserVerificationCodes(user.id);

    return { message: 'Email verified successfully' };
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
      const appName = this.configService.get<string>('email.appName');
      await this.emailService.sendEmail(
        email,
        `Your ${appName} Login Code`,
        '<h1>Login Verification</h1><p>Your 6-digit verification code is: <strong>{{code}}</strong></p><p>This code will expire in 10 minutes.</p>',
        { code },
      );

      return { message: 'OTP sent successfully' };
    } catch (error) {
      console.error('Error in sendOtp:', error);
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

    // Mark user as active and email verified
    await this.authRepository.update(user.id, {
      status: UserStatus.ACTIVE,
      emailVerified: true,
    });

    // Delete the code after successful verification
    await this.authRepository.deleteVerificationCode(verificationCode.id);

    // Update last login and return the freshest user payload to the app.
    const updatedUser = await this.authRepository.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user);

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

    const updatedUser = await this.authRepository.updateLastLogin(user.id);

    const tokens = await this.generateTokens(user);

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

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.authRepository.findByEmail(forgotPasswordDto.email);
    if (!user) {
      throw new NotFoundException('User with this email does not exist');
    }

    // Delete existing verification codes for this user
    await this.authRepository.deleteUserVerificationCodes(user.id);

    // Create new 6-digit OTP code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes expiry

    await this.authRepository.createVerificationCode(user.id, code, expiresAt);

    // Send email
    const appName = this.configService.get<string>('email.appName');
    await this.emailService.sendEmail(
      user.email,
      `Password Reset Code - ${appName}`,
      `<h1>Password Reset</h1>
       <p>You requested a password reset. Your 6-digit verification code is:</p>
       <h2 style="font-size: 32px; letter-spacing: 5px;">${code}</h2>
       <p>This code will expire in 15 minutes.</p>`,
      { code },
    );

    return { message: 'Verification code has been sent to your email' };
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
