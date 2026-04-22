import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EscrowService } from './escrow.service';
import { CreateEscrowDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Escrow')
@Controller('escrow')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new escrow transaction' })
  async create(@CurrentUser() user: any, @Body() dto: CreateEscrowDto) {
    return this.escrowService.createEscrow(user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my escrow history' })
  async getMyEscrows(@CurrentUser() user: any) {
    return this.escrowService.getMyEscrows(user.id);
  }

  @Post(':id/release')
  @ApiOperation({ summary: 'Release escrow funds' })
  async release(@Param('id') id: string, @CurrentUser() user: any) {
    return this.escrowService.releaseEscrow(id, user.id);
  }
}
