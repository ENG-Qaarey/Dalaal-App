import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReportDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reportedId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  listingId?: string;

  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsString()
  description: string;
}

export class UpdateReportStatusDto {
  @ApiProperty({ enum: ['SUBMITTED', 'INVESTIGATING', 'RESOLVED', 'DISMISSED'] })
  @IsString()
  status: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  resolution?: string;
}
