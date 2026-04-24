import { UsersRepository } from './users.repository';
import { UpdateProfileDto, UpdateUserDto, VerifyIdentityDto } from './dto';
export declare class UsersService {
    private readonly usersRepository;
    constructor(usersRepository: UsersRepository);
    findAll(page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    findById(id: string): Promise<any>;
    findByEmail(email: string): Promise<any>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<any>;
    updateUser(userId: string, updateUserDto: UpdateUserDto, requestingUser: any): Promise<any>;
    verifyIdentity(userId: string, verifyIdentityDto: VerifyIdentityDto): Promise<void>;
    deleteUser(userId: string, requestingUser: any): Promise<{
        message: string;
    }>;
    getProfile(userId: string): Promise<any>;
    private sanitizeUser;
}
