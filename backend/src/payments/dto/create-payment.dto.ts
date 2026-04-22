import { IsNumber, IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentProvider, PaymentType } from '../../common/enums';

export class CreatePaymentDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @ApiProperty({ enum: PaymentProvider })
  @IsEnum(PaymentProvider)
  provider: PaymentProvider;

  @ApiProperty({ enum: PaymentType })
  @IsEnum(PaymentType)
  type: PaymentType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  listingId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  recipientId?: string;
}

export class VerifyPaymentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  transactionId: string;
}
