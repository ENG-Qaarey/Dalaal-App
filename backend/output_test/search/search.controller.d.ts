import { SearchService } from './search.service';
import { SearchQueryDto } from './dto';
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    search(dto: SearchQueryDto, page?: number, limit?: number): Promise<{
        data: ({
            user: {
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
            };
            property: {
                id: string;
                listingId: string;
                bedrooms: number | null;
                propertyType: import(".prisma/client").$Enums.PropertyType;
                security: boolean;
                bathrooms: number | null;
                squareMeters: number | null;
                yearBuilt: number | null;
                furnished: boolean;
                parking: boolean;
                garden: boolean;
                water: boolean;
                electricity: boolean;
                propertyStatus: string | null;
                depositMonths: number | null;
                minLeaseMonths: number | null;
            } | null;
            vehicle: {
                id: string;
                listingId: string;
                vehicleType: import(".prisma/client").$Enums.VehicleType;
                make: string;
                year: number;
                model: string;
                mileage: number | null;
                condition: string | null;
                fuelType: import(".prisma/client").$Enums.FuelType | null;
                transmission: import(".prisma/client").$Enums.Transmission | null;
                color: string | null;
                seats: number | null;
                vehicleStatus: string | null;
                minRentalDays: number | null;
                depositRequired: boolean;
            } | null;
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
        })[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
}
