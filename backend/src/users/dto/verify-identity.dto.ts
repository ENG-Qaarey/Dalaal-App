import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType } from '../../common/enums';

export class VerifyIdentityDto {
  @ApiProperty({ enum: DocumentType })
  @IsEnum(DocumentType)
  documentType: DocumentType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  documentNumber?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  documentImage?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  selfieImage?: string;
}
