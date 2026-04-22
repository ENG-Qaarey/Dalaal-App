import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../../common/enums';

export class CreateVerificationDto {
  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  documentNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  frontImageUrl: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  backImageUrl?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  selfieImageUrl: string;
}

export class UpdateVerificationStatusDto {
  @ApiProperty({ enum: ['APPROVED', 'REJECTED'] })
  @IsEnum(['APPROVED', 'REJECTED'])
  status: 'APPROVED' | 'REJECTED';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
