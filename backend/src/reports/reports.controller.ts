import {
  Controller, Get, Post, Put, Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { CreateReportDto, UpdateReportStatusDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators';
import { Permission } from '../common/enums';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Post()
  @Permissions(Permission.REPORT_SUBMIT)
  @ApiOperation({ summary: 'Submit a report' })
  async create(@CurrentUser() user: any, @Body() dto: CreateReportDto) {
    return this.reportsService.create(user.id, dto);
  }

  @Get('mine')
  @Permissions(Permission.REPORT_SUBMIT)
  @ApiOperation({ summary: 'Get my submitted reports' })
  async getMine(@CurrentUser() user: any) {
    return this.reportsService.findByUser(user.id);
  }

  @Get()
  @Permissions(Permission.REPORT_VIEW_ALL)
  @ApiOperation({ summary: 'Get all reports (admin)' })
  async findAll() {
    return this.reportsService.findAll();
  }

  @Put(':id/status')
  @Permissions(Permission.REPORT_RESOLVE)
  @ApiOperation({ summary: 'Update report status (admin)' })
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateReportStatusDto) {
    return this.reportsService.updateStatus(id, dto);
  }
}
