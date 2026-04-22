import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ListingType, ListingStatus, PropertyType, VehicleType } from '../../common/enums';

export class CreateListingDto {
  @ApiProperty({ enum: ListingType })
  @IsEnum(ListingType)
  type: ListingType;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  priceNegotiable?: boolean;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  featuredImage?: string;
}

export class UpdateListingDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  price?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  priceNegotiable?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  district?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;
}

export class ListingFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ListingType)
  type?: ListingType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(VehicleType)
  vehicleType?: VehicleType;
}
