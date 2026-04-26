import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { User, Prisma } from '@prisma/client';

@Injectable()
export class AuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });
  }

  async findByPhone(phone: string) {
    return this.prisma.user.findUnique({
      where: { phone },
      include: { profile: true },
    });
  }

  async findByUsername(username: string) {
    if (!username) return null;
    return this.prisma.user.findFirst({
      where: { 
        username: {
          equals: username,
          mode: 'insensitive',
        },
      },
      include: { profile: true },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { profile: true },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
      include: { profile: true },
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: { profile: true },
    });
  }

  async updateLastLogin(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { lastLoginAt: new Date() },
      include: { profile: true },
    });
  }

  async createPasswordResetToken(userId: string, token: string, expiresAt: Date) {
    return this.prisma.passwordResetToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  async findPasswordResetToken(token: string) {
    return this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });
  }

  async deletePasswordResetToken(token: string) {
    return this.prisma.passwordResetToken.delete({
      where: { token },
    });
  }

  async deleteUserPasswordResetTokens(userId: string) {
    return this.prisma.passwordResetToken.deleteMany({
      where: { userId },
    });
  }

  async createVerificationCode(userId: string, code: string, expiresAt: Date) {
    return this.prisma.verificationCode.create({
      data: {
        userId,
        code,
        expiresAt,
      },
    });
  }

  async findVerificationCode(userId: string, code: string) {
    return this.prisma.verificationCode.findFirst({
      where: {
        userId,
        code,
      },
    });
  }

  async deleteVerificationCode(id: string) {
    return this.prisma.verificationCode.delete({
      where: { id },
    });
  }

  async deleteUserVerificationCodes(userId: string) {
    return this.prisma.verificationCode.deleteMany({
      where: { userId },
    });
  }
}
