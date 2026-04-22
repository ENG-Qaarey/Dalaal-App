import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthRepository } from './auth.repository';
import { RegisterDto, LoginDto, ForgotPasswordDto, ResetPasswordDto } from './dto';
import { hashPassword, comparePassword, generateOTP } from '../common/utils/password.utils';
import { UserRole, UserStatus } from '../common/enums';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.authRepository.findByEmail(email);
    if (!user) {
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
      return { message: 'If the email exists, a reset link has been sent' };
    }

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    throw new BadRequestException('Password reset not implemented');
  }

  async verifyPhone(phone: string, otp: string) {
    throw new BadRequestException('Phone verification not implemented');
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get<string>('jwt.refreshExpiresIn'),
    });

    return { accessToken, refreshToken };
  }

  private sanitizeUser(user: any) {
    const { password, ...result } = user;
    return result;
  }
}
