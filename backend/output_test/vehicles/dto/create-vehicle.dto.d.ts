import { VehicleType, FuelType, Transmission } from '../../common/enums';
export declare class CreateVehicleDto {
    vehicleType: VehicleType;
    make: string;
    model: string;
    year: number;
    mileage?: number;
    fuelType?: FuelType;
    transmission?: Transmission;
    color?: string;
    seats?: number;
}
export declare class UpdateVehicleDto extends CreateVehicleDto {
}
