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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const users_repository_1 = require("./users.repository");
const enums_1 = require("../common/enums");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findAll(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            this.usersRepository.findAll({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
            this.usersRepository.count(),
        ]);
        return {
            data: users.map((u) => this.sanitizeUser(u)),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findById(id) {
        const user = await this.usersRepository.findById(id);
        return this.sanitizeUser(user);
    }
    async findByEmail(email) {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.sanitizeUser(user);
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.usersRepository.findById(userId);
        const updatedUser = await this.usersRepository.update(userId, {
            profile: {
                update: updateProfileDto,
            },
        });
        return this.sanitizeUser(updatedUser);
    }
    async updateUser(userId, updateUserDto, requestingUser) {
        if (requestingUser.id === userId) {
            throw new common_1.ForbiddenException('Cannot update your own account');
        }
        if (requestingUser.role !== enums_1.UserRole.SUPER_ADMIN && requestingUser.role !== enums_1.UserRole.MODERATOR) {
            throw new common_1.ForbiddenException('Only admins can update user roles and statuses');
        }
        const updatedUser = await this.usersRepository.update(userId, updateUserDto);
        return this.sanitizeUser(updatedUser);
    }
    async verifyIdentity(userId, verifyIdentityDto) {
        throw new common_1.NotImplementedException('Identity verification not implemented');
    }
    async deleteUser(userId, requestingUser) {
        if (requestingUser.id === userId) {
            throw new common_1.ForbiddenException('Cannot delete your own account');
        }
        if (requestingUser.role !== enums_1.UserRole.SUPER_ADMIN) {
            throw new common_1.ForbiddenException('Only super admins can delete users');
        }
        await this.usersRepository.delete(userId);
        return { message: 'User deleted successfully' };
    }
    async getProfile(userId) {
        const user = await this.usersRepository.findById(userId);
        return {
            ...this.sanitizeUser(user),
            listings: [],
        };
    }
    sanitizeUser(user) {
        if (!user)
            return null;
        const { password, ...result } = user;
        return result;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository])
], UsersService);
//# sourceMappingURL=users.service.js.map