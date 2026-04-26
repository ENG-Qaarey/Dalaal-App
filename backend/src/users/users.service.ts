import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  NotImplementedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { UpdateProfileDto, UpdateUserDto, VerifyIdentityDto } from './dto';
import { hashPassword } from '../common/utils/password.utils';
import { UserRole, UserStatus } from '../common/enums';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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

  async searchUsers(query: string, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const where: any = {};

    if (query) {
      where.OR = [
        { email: { contains: query, mode: 'insensitive' } },
        { username: { contains: query, mode: 'insensitive' } },
        { phone: { contains: query, mode: 'insensitive' } },
        {
          profile: {
            OR: [
              { firstName: { contains: query, mode: 'insensitive' } },
              { lastName: { contains: query, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    const [users, total] = await Promise.all([
      this.usersRepository.findAll({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.usersRepository.count({ where }),
    ]);

    return {
      data: users.map((u) => this.sanitizeUser(u)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string) {
    const user = await this.usersRepository.findById(id);
    return this.sanitizeUser(user);
  }

  async findByEmail(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.sanitizeUser(user);
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    const user = await this.usersRepository.findById(userId);

    const updatedUser = await this.usersRepository.update(userId, {
      profile: {
        update: updateProfileDto,
      },
    });

    return this.sanitizeUser(updatedUser);
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto, requestingUser: any) {
    if (requestingUser.id === userId) {
      throw new ForbiddenException('Cannot update your own account');
    }

    if (requestingUser.role !== UserRole.SUPER_ADMIN && requestingUser.role !== UserRole.MODERATOR) {
      throw new ForbiddenException('Only admins can update user roles and statuses');
    }

    const updatedUser = await this.usersRepository.update(userId, updateUserDto);
    return this.sanitizeUser(updatedUser);
  }

  async verifyIdentity(userId: string, verifyIdentityDto: VerifyIdentityDto) {
    throw new NotImplementedException('Identity verification not implemented');
  }

  async deleteUser(userId: string, requestingUser: any) {
    if (requestingUser.id === userId) {
      throw new ForbiddenException('Cannot delete your own account');
    }

    if (requestingUser.role !== UserRole.SUPER_ADMIN) {
      throw new ForbiddenException('Only super admins can delete users');
    }

    await this.usersRepository.delete(userId);
    return { message: 'User deleted successfully' };
  }

  async getProfile(userId: string) {
    const user = await this.usersRepository.findById(userId);
    return {
      ...this.sanitizeUser(user),
      listings: [],
    };
  }

  private sanitizeUser(user: any) {
    if (!user) return null;
    const { password, ...result } = user;
    return result;
  }
}
