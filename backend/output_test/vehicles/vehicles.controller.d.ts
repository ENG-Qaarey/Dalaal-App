import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto';
export declare class VehiclesController {
    private readonly vehiclesService;
    constructor(vehiclesService: VehiclesService);
    create(user: any, listingId: string, createVehicleDto: CreateVehicleDto): Promise<{
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
    update(user: any, listingId: string, updateVehicleDto: UpdateVehicleDto): Promise<{
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
    }>;
}
