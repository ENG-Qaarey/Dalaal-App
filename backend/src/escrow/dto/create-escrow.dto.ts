import { IsNumber, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEscrowDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  listingId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sellerId: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class ReleaseEscrowDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  escrowId: string;
}
