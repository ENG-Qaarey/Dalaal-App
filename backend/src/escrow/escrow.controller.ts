import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EscrowService } from './escrow.service';
import { CreateEscrowDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators';
import { Permission } from '../common/enums';

@ApiTags('Escrow')
@Controller('escrow')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class EscrowController {
  constructor(private readonly escrowService: EscrowService) {}

  @Post()
  @Permissions(Permission.ESCROW_CREATE)
  @ApiOperation({ summary: 'Create a new escrow transaction' })
  async create(
    @CurrentUser() user: any,
    @Body() dto: CreateEscrowDto,
  ) {
    return this.escrowService.createEscrow(user.id, dto);
  }

  @Get('my')
  @Permissions(Permission.ESCROW_VIEW_OWN)
  @ApiOperation({ summary: 'Get my escrow history' })
  async getMyEscrows(@CurrentUser() user: any) {
    return this.escrowService.getMyEscrows(user.id);
  }

  @Post(':id/release')
  @Permissions(Permission.ESCROW_RELEASE)
  @ApiOperation({ summary: 'Release escrow funds' })
  async release(@Param('id') id: string, @CurrentUser() user: any) {
    return this.escrowService.releaseEscrow(id, user.id);
  }
}
