import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgentsService } from './agents.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CurrentUser, Permissions } from '../common/decorators';
import { Permission } from '../common/enums';
import { AnalyticsPeriodQueryDto } from '../admin/dto';

@ApiTags('Agents')
@Controller('agents')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Get('me/stats')
  @Permissions(Permission.AGENT_STATS_OWN)
  @ApiOperation({
    summary: 'Get analytics stats for the current agent/seller',
  })
  async getMyStats(
    @CurrentUser('id') userId: string,
    @Query() query: AnalyticsPeriodQueryDto,
  ) {
    return this.agentsService.getMyStats(userId, query.period);
  }

  @Get('me/leads')
  @Permissions(Permission.AGENT_LEADS_OWN)
  @ApiOperation({
    summary: 'Get recent leads for the current agent/seller',
  })
  async getMyLeads(
    @CurrentUser('id') userId: string,
    @Query('limit') limit = 10,
  ) {
    return this.agentsService.getRecentLeads(userId, +limit);
  }

  @Get('me/listings')
  @Permissions(Permission.AGENT_LISTINGS_OWN)
  @ApiOperation({
    summary: 'Get listings owned by the current agent/seller',
  })
  async getMyListings(
    @CurrentUser('id') userId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.agentsService.getMyListings(userId, +page, +limit);
  }
}
