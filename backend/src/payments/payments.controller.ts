import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, VerifyPaymentDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiOperation({ summary: 'Initiate a payment' })
  async create(@CurrentUser() user: any, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.createPayment(user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my payment history' })
  async getMyPayments(@CurrentUser() user: any) {
    return this.paymentsService.getMyPayments(user.id);
  }

  @Post(':id/verify')
  @ApiOperation({ summary: 'Verify a payment' })
  async verify(@Param('id') id: string, @Body() dto: VerifyPaymentDto) {
    return this.paymentsService.verifyPayment(id, dto.transactionId);
  }
}
