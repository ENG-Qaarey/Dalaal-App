import { IsNumber, IsString, IsNotEmpty, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReviewDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  revieweeId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  listingId?: string;

  @ApiProperty()
  @IsNumber()
  @Min(1)
  @Max(5)
  overallRating: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  communicationRating?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  accuracyRating?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  valueRating?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  comment?: string;
}
