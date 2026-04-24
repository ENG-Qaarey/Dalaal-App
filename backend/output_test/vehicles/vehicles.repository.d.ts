import { PrismaService } from '../database/prisma.service';
export declare class VehiclesRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(listingId: string, data: any): Promise<{
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
    }>;
    findByListingId(listingId: string): Promise<{
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
    } | null>;
    update(listingId: string, data: any): Promise<{
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
    }>;
}
