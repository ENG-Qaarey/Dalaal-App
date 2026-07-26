import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  IsIn,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({ example: 'password123' })
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password!: string;

  @ApiPropertyOptional({ example: '+252612345678' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: 'johndoe' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  fullName!: string;

  @ApiPropertyOptional({
    example: 'CUSTOMER',
    enum: ['CUSTOMER', 'PROPERTY_OWNER', 'VEHICLE_OWNER', 'BROKER'],
    default: 'CUSTOMER',
  })
  @IsOptional()
  @IsIn(['CUSTOMER', 'PROPERTY_OWNER', 'VEHICLE_OWNER', 'BROKER'])
  role?: string;
}