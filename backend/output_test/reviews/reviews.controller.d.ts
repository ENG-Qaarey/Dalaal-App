import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(user: any, dto: CreateReviewDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        listingId: string | null;
        title: string | null;
        isVerified: boolean;
        overallRating: number;
        communicationRating: number | null;
        accuracyRating: number | null;
        valueRating: number | null;
        comment: string | null;
        helpfulCount: number;
        response: string | null;
        respondedAt: Date | null;
        reviewerId: string;
        revieweeId: string;
    }>;
    findByRevieweeId(id: string, page?: number, limit?: number): Promise<({
        reviewer: {
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                currency: string | null;
                city: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                bio: string | null;
                country: string | null;
                isDiaspora: boolean;
                language: string | null;
                whatsappNumber: string | null;
                telegramHandle: string | null;
                totalListings: number;
                rating: number | null;
                reviewCount: number;
                responseRate: number | null;
            } | null;
        } & {
            email: string;
            password: string | null;
            id: string;
            phone: string | null;
            googleId: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            emailVerified: boolean;
            phoneVerified: boolean;
            twoFactorEnabled: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        listingId: string | null;
        title: string | null;
        isVerified: boolean;
        overallRating: number;
        communicationRating: number | null;
        accuracyRating: number | null;
        valueRating: number | null;
        comment: string | null;
        helpfulCount: number;
        response: string | null;
        respondedAt: Date | null;
        reviewerId: string;
        revieweeId: string;
    })[]>;
    findByListingId(id: string): Promise<({
        reviewer: {
            profile: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                currency: string | null;
                city: string | null;
                firstName: string | null;
                lastName: string | null;
                avatar: string | null;
                bio: string | null;
                country: string | null;
                isDiaspora: boolean;
                language: string | null;
                whatsappNumber: string | null;
                telegramHandle: string | null;
                totalListings: number;
                rating: number | null;
                reviewCount: number;
                responseRate: number | null;
            } | null;
        } & {
            email: string;
            password: string | null;
            id: string;
            phone: string | null;
            googleId: string | null;
            role: import(".prisma/client").$Enums.UserRole;
            status: import(".prisma/client").$Enums.UserStatus;
            emailVerified: boolean;
            phoneVerified: boolean;
            twoFactorEnabled: boolean;
            lastLoginAt: Date | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        listingId: string | null;
        title: string | null;
        isVerified: boolean;
        overallRating: number;
        communicationRating: number | null;
        accuracyRating: number | null;
        valueRating: number | null;
        comment: string | null;
        helpfulCount: number;
        response: string | null;
        respondedAt: Date | null;
        reviewerId: string;
        revieweeId: string;
    })[]>;
}
