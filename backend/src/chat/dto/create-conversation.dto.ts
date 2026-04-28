import { IsString, IsNotEmpty, IsOptional, IsArray, ValidateIf, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MessageType } from '../../common/enums/message-type.enum';

export class CreateConversationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  participantId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  listingId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;
}

export class CreateMessageDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.mediaUrl)
  @IsNotEmpty()
  content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @ValidateIf((o) => !o.content)
  @IsNotEmpty()
  mediaUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tempId?: string;

  @ApiProperty({ required: false, enum: MessageType })
  @IsOptional()
  @IsEnum(MessageType)
  type?: MessageType;
}
