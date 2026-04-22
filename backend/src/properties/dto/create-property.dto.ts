import { IsString, IsNumber, IsOptional, IsEnum, IsBoolean, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PropertyType } from '../../common/enums';

export class CreatePropertyDto {
  @ApiProperty({ enum: PropertyType })
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  bedrooms?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  bathrooms?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  squareMeters?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  yearBuilt?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  furnished?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  parking?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  garden?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  security?: boolean;
}

export class UpdatePropertyDto extends CreatePropertyDto {}
