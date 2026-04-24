import { UsersService } from './users.service';
import { UpdateProfileDto, UpdateUserDto } from './dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(page?: number, limit?: number): Promise<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getProfile(user: any): Promise<any>;
    findById(id: string): Promise<any>;
    updateProfile(user: any, updateProfileDto: UpdateProfileDto): Promise<any>;
    updateUser(id: string, updateUserDto: UpdateUserDto, requestingUser: any): Promise<any>;
    deleteUser(id: string, requestingUser: any): Promise<{
        message: string;
    }>;
}
