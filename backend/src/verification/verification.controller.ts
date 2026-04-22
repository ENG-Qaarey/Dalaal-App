import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { CreateVerificationDto, UpdateVerificationStatusDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators';
import { UserRole, VerificationStatus } from '../common/enums';

@ApiTags('Verification')
@Controller('verification')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Post()
  @ApiOperation({ summary: 'Submit verification documents' })
  async create(@CurrentUser() user: any, @Body() dto: CreateVerificationDto) {
    return this.verificationService.createVerification(user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my verification status' })
  async getMy(@CurrentUser() user: any) {
    return this.verificationService.getMyVerification(user.id);
  }

  @Get('pending')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Get all pending verifications (admin only)' })
  async findAllPending() {
    return this.verificationService.findAllPending();
  }

  @Put(':id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.MODERATOR)
  @ApiOperation({ summary: 'Update verification status (admin only)' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateVerificationStatusDto,
  ) {
    return this.verificationService.updateStatus(id, dto.status as VerificationStatus, dto.rejectionReason);
  }
}
