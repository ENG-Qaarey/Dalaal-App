import { UserStatus, UserRole } from '../../common/enums';
export declare class UpdateUserDto {
    status?: UserStatus;
    role?: UserRole;
    phone?: string;
}
