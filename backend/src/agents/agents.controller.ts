import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { CurrentUser, Roles } from '../common/decorators';
import { UserRole } from '../common/enums';
import { AnalyticsPeriodQueryDto } from '../admin/dto';

const AGENT_ROLES = [
  UserRole.VERIFIED_DALAAL,
  UserRole.REGULAR_DALAAL,
  UserRole.PROPERTY_OWNER,
  UserRole.VEHICLE_OWNER,
];

@ApiTags('Agents')
@Controller('agents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(...AGENT_ROLES)
@ApiBearerAuth()
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get('me/stats')
  @ApiOperation({ summary: 'Get analytics stats for the current agent/seller' })
  async getMyStats(@CurrentUser('id') userId: string, @Query() query: AnalyticsPeriodQueryDto) {
    return this.agentsService.getMyStats(userId, query.period);
  }

  @Get('me/leads')
  @ApiOperation({ summary: 'Get recent leads for the current agent/seller' })
  async getMyLeads(@CurrentUser('id') userId: string, @Query('limit') limit = 10) {
    return this.agentsService.getRecentLeads(userId, +limit);
  }

  @Get('me/listings')
  @ApiOperation({ summary: 'Get listings owned by the current agent/seller' })
  async getMyListings(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.agentsService.getMyListings(userId, +page, +limit);
  }
}
