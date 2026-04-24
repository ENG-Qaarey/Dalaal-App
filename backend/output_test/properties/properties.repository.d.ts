import { PrismaService } from '../database/prisma.service';
export declare class PropertiesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(listingId: string, data: any): Promise<{
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
    }>;
    findByListingId(listingId: string): Promise<{
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
    } | null>;
    update(listingId: string, data: any): Promise<{
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
    }>;
}
