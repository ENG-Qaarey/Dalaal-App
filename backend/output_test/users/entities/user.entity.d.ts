export interface UserEntity {
    id: string;
    email: string;
    phone?: string;
    role: string;
    status: string;
    emailVerified: boolean;
    phoneVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    profile?: ProfileEntity;
}
export interface ProfileEntity {
    id: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    avatar?: string;
    bio?: string;
    city?: string;
    country?: string;
    isDiaspora: boolean;
    whatsappNumber?: string;
    telegramHandle?: string;
    totalListings: number;
    rating?: number;
    reviewCount: number;
    createdAt: Date;
    updatedAt: Date;
}
