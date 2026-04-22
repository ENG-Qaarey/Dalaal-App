import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { VehicleType, FuelType, Transmission } from '../../common/enums';

export class CreateVehicleDto {
  @ApiProperty({ enum: VehicleType })
  @IsEnum(VehicleType)
  vehicleType: VehicleType;

  @ApiProperty()
  @IsString()
  make: string;

  @ApiProperty()
  @IsString()
  model: string;

  @ApiProperty()
  @IsNumber()
  year: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  mileage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(FuelType)
  fuelType?: FuelType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(Transmission)
  transmission?: Transmission;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  seats?: number;
}

export class UpdateVehicleDto extends CreateVehicleDto {}
