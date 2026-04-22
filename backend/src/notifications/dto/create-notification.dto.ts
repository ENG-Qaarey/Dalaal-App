import { IsString, IsNotEmpty, IsEnum, IsOptional, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '../../common/enums';

export class CreateNotificationDto {
  @ApiProperty({ enum: NotificationType })
  @IsEnum(NotificationType)
  type: NotificationType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  body: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObject()
  data?: any;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  actionUrl?: string;
}
