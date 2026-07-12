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

  async findByIdentifier(identifier: string) {
    const trimmed = identifier.trim().replace(/\s+/g, '');
    return this.prisma.user.findFirst({
      where: {
        OR: [
          { email: trimmed },
          { phone: trimmed },
          { phone: trimmed.replace(/^\+/, '') },
          { phone: '+' + trimmed },
          { username: { equals: trimmed, mode: 'insensitive' } },
        ],
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
