import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    toggle(user: any, listingId: string): Promise<{
        favorited: boolean;
    }>;
    getMy(user: any): Promise<({
        listing: {
            images: {
                url: string;
                id: string;
                createdAt: Date;
                listingId: string;
                order: number;
                thumbnail: string | null;
                isPrimary: boolean;
            }[];
        } & {
            description: string | null;
            id: string;
            status: import(".prisma/client").$Enums.ListingStatus;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            currency: string;
            type: import(".prisma/client").$Enums.ListingType;
            title: string;
            slug: string;
            price: import("@prisma/client/runtime/library").Decimal;
            priceNegotiable: boolean;
            city: string;
            district: string | null;
            address: string | null;
            latitude: number | null;
            longitude: number | null;
            isVerified: boolean;
            isFeatured: boolean;
            viewCount: number;
            favoriteCount: number;
            inquiryCount: number;
            featuredImage: string | null;
            videoUrl: string | null;
            availableFrom: Date | null;
            expiresAt: Date | null;
            publishedAt: Date | null;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        listingId: string;
    })[]>;
}
