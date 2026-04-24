import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsPhoneNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'password123', required: false })
  @IsString()
  @IsOptional()
  @MinLength(8)
  password?: string;

  @ApiProperty({ example: '+252612345678', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'John' })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiProperty({ example: 'Doe' })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  fullName?: string;
}
