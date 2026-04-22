import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  mediaUrl?: string;
}
