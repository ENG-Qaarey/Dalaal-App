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
exports.AuthRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let AuthRepository = class AuthRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: { profile: true },
        });
    }
    async findByPhone(phone) {
        return this.prisma.user.findUnique({
            where: { phone },
            include: { profile: true },
        });
    }
    async findById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { profile: true },
        });
    }
    async create(data) {
        return this.prisma.user.create({
            data,
            include: { profile: true },
        });
    }
    async update(id, data) {
        return this.prisma.user.update({
            where: { id },
            data,
            include: { profile: true },
        });
    }
    async updateLastLogin(id) {
        return this.prisma.user.update({
            where: { id },
            data: { lastLoginAt: new Date() },
        });
    }
    async createPasswordResetToken(userId, token, expiresAt) {
        return this.prisma.passwordResetToken.create({
            data: {
                userId,
                token,
                expiresAt,
            },
        });
    }
    async findPasswordResetToken(token) {
        return this.prisma.passwordResetToken.findUnique({
            where: { token },
            include: { user: true },
        });
    }
    async deletePasswordResetToken(token) {
        return this.prisma.passwordResetToken.delete({
            where: { token },
        });
    }
    async deleteUserPasswordResetTokens(userId) {
        return this.prisma.passwordResetToken.deleteMany({
            where: { userId },
        });
    }
    async createVerificationCode(userId, code, expiresAt) {
        return this.prisma.verificationCode.create({
            data: {
                userId,
                code,
                expiresAt,
            },
        });
    }
    async findVerificationCode(userId, code) {
        return this.prisma.verificationCode.findFirst({
            where: {
                userId,
                code,
            },
        });
    }
    async deleteVerificationCode(id) {
        return this.prisma.verificationCode.delete({
            where: { id },
        });
    }
    async deleteUserVerificationCodes(userId) {
        return this.prisma.verificationCode.deleteMany({
            where: { userId },
        });
    }
};
exports.AuthRepository = AuthRepository;
exports.AuthRepository = AuthRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AuthRepository);
//# sourceMappingURL=auth.repository.js.map