import {
  Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { ModerationService } from './moderation.service';
import { AdminManagementService } from './admin-management.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { Permissions } from '../common/decorators';
import { Permission } from '../common/enums';
import {
  AnalyticsPeriodQueryDto,
  BreakdownQueryDto,
  BrokersQueryDto,
  TimeseriesQueryDto,
} from './dto';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(
    private readonly analyticsService: AnalyticsService,
    private readonly moderationService: ModerationService,
    private readonly managementService: AdminManagementService,
  ) {}

  // ── Dashboard & Analytics ──
  @Get('stats')
  @Permissions(Permission.ADMIN_DASHBOARD)
  @ApiOperation({ summary: 'Get dashboard statistics' })
  async getStats() {
    return this.analyticsService.getDashboardStats();
  }

  @Get('dashboard')
  @Permissions(Permission.ADMIN_DASHBOARD)
  @ApiOperation({ summary: 'Get full super admin dashboard data' })
  async getDashboard() {
    return this.analyticsService.getFullDashboard();
  }

  @Get('analytics/overview')
  @Permissions(Permission.ADMIN_ANALYTICS)
  @ApiOperation({ summary: 'Get platform analytics overview' })
  async getAnalyticsOverview(@Query() query: AnalyticsPeriodQueryDto) {
    return this.analyticsService.getOverview(query.period);
  }

  @Get('analytics/timeseries')
  @Permissions(Permission.ADMIN_ANALYTICS)
  @ApiOperation({ summary: 'Get platform analytics time-series' })
  async getAnalyticsTimeseries(@Query() query: TimeseriesQueryDto) {
    return this.analyticsService.getTimeseries(query.metric, query.period, query.granularity);
  }

  @Get('analytics/listings/breakdown')
  @Permissions(Permission.ADMIN_ANALYTICS)
  @ApiOperation({ summary: 'Get listings breakdown' })
  async getListingsBreakdown(@Query() query: BreakdownQueryDto) {
    return this.analyticsService.getListingsBreakdown(query.groupBy, query.period);
  }

  @Get('analytics/brokers')
  @Permissions(Permission.ADMIN_ANALYTICS)
  @ApiOperation({ summary: 'Get top broker performance stats' })
  async getBrokerStats(@Query() query: BrokersQueryDto) {
    return this.analyticsService.getBrokerStats(query.period, query.limit, query.sortBy);
  }

  // ── Listings Moderation ──
  @Get('pending-listings')
  @Permissions(Permission.LISTING_VIEW_ALL)
  @ApiOperation({ summary: 'Get listings pending review' })
  async getPendingListings() {
    return this.moderationService.getPendingListings();
  }

  @Post('listings/:id/approve')
  @Permissions(Permission.LISTING_APPROVE)
  @ApiOperation({ summary: 'Approve a listing' })
  async approveListing(@Param('id') id: string) {
    return this.moderationService.approveListing(id);
  }

  @Post('listings/:id/reject')
  @Permissions(Permission.LISTING_REJECT)
  @ApiOperation({ summary: 'Reject a listing' })
  async rejectListing(@Param('id') id: string, @Body('reason') reason: string) {
    return this.moderationService.rejectListing(id, reason);
  }

  // ── Users ──
  @Get('users')
  @Permissions(Permission.USER_LIST)
  @ApiOperation({ summary: 'List all users with filters' })
  async getUsers(
    @Query('q') q?: string,
    @Query('role') role?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.managementService.getUsers({
      q, role, status,
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  @Get('users/:id')
  @Permissions(Permission.USER_VIEW)
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: string) {
    return this.managementService.getUserById(id);
  }

  @Put('users/:id/status')
  @Permissions(Permission.USER_UPDATE)
  @ApiOperation({ summary: 'Update user status (suspend/ban/restore)' })
  async updateUserStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.managementService.updateUserStatus(id, status);
  }

  // ── All Listings ──
  @Get('listings')
  @Permissions(Permission.LISTING_VIEW_ALL)
  @ApiOperation({ summary: 'List all listings with filters' })
  async getAllListings(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('type') type?: string,
    @Query('q') q?: string,
  ) {
    return this.managementService.getAllListings({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
      status, type, q,
    });
  }

  // ── All Properties ──
  @Get('properties')
  @Permissions(Permission.LISTING_VIEW_ALL)
  @ApiOperation({ summary: 'List all properties' })
  async getAllProperties(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.managementService.getAllProperties({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  // ── All Vehicles ──
  @Get('vehicles')
  @Permissions(Permission.LISTING_VIEW_ALL)
  @ApiOperation({ summary: 'List all vehicles' })
  async getAllVehicles(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.managementService.getAllVehicles({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  // ── Payments ──
  @Get('payments')
  @Permissions(Permission.PAYMENT_VIEW_ALL)
  @ApiOperation({ summary: 'List all payments' })
  async getPayments(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.managementService.getPayments({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
      status,
    });
  }

  // ── Escrow ──
  @Get('escrow')
  @Permissions(Permission.ESCROW_VIEW_ALL)
  @ApiOperation({ summary: 'List all escrow transactions' })
  async getEscrow(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.managementService.getEscrow({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
      status,
    });
  }

  // ── Reviews ──
  @Get('reviews')
  @Permissions(Permission.REVIEW_MANAGE)
  @ApiOperation({ summary: 'List all reviews' })
  async getReviews(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.managementService.getReviews({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  @Delete('reviews/:id')
  @Permissions(Permission.REVIEW_MANAGE)
  @ApiOperation({ summary: 'Delete a review' })
  async deleteReview(@Param('id') id: string) {
    return this.managementService.deleteReview(id);
  }

  // ── Reports ──
  @Get('reports')
  @Permissions(Permission.REPORT_VIEW_ALL)
  @ApiOperation({ summary: 'List all reports' })
  async getReports(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
  ) {
    return this.managementService.getReports({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
      status,
    });
  }

  @Put('reports/:id/status')
  @Permissions(Permission.REPORT_RESOLVE)
  @ApiOperation({ summary: 'Update report status' })
  async updateReportStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('resolution') resolution?: string,
  ) {
    return this.managementService.updateReportStatus(id, status, resolution);
  }

  // ── Notifications ──
  @Get('notifications')
  @Permissions(Permission.NOTIFICATION_MANAGE)
  @ApiOperation({ summary: 'List all notifications' })
  async getNotifications(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.managementService.getNotifications({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  // ── Announcements ──
  @Get('announcements')
  @Permissions(Permission.ADMIN_ANNOUNCEMENTS)
  @ApiOperation({ summary: 'List all announcements' })
  async getAnnouncements() {
    return this.managementService.getAnnouncements();
  }

  @Post('announcements')
  @Permissions(Permission.ADMIN_ANNOUNCEMENTS)
  @ApiOperation({ summary: 'Create announcement' })
  async createAnnouncement(@Body() body: { title: string; content: string; type?: string; isActive?: boolean }) {
    return this.managementService.createAnnouncement(body);
  }

  @Put('announcements/:id')
  @Permissions(Permission.ADMIN_ANNOUNCEMENTS)
  @ApiOperation({ summary: 'Update announcement' })
  async updateAnnouncement(@Param('id') id: string, @Body() body: any) {
    return this.managementService.updateAnnouncement(id, body);
  }

  @Delete('announcements/:id')
  @Permissions(Permission.ADMIN_ANNOUNCEMENTS)
  @ApiOperation({ summary: 'Delete announcement' })
  async deleteAnnouncement(@Param('id') id: string) {
    return this.managementService.deleteAnnouncement(id);
  }

  // ── Contact Messages ──
  @Get('contact-messages')
  @Permissions(Permission.ADMIN_DASHBOARD)
  @ApiOperation({ summary: 'List all contact messages' })
  async getContactMessages(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.managementService.getContactMessages({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  @Put('contact-messages/:id')
  @Permissions(Permission.ADMIN_DASHBOARD)
  @ApiOperation({ summary: 'Update contact message (respond/mark read)' })
  async updateContactMessage(@Param('id') id: string, @Body() body: { status?: string; response?: string }) {
    return this.managementService.updateContactMessage(id, body);
  }

  // ── FAQs ──
  @Get('faqs')
  @Permissions(Permission.ADMIN_SETTINGS)
  @ApiOperation({ summary: 'List all FAQs' })
  async getFaqs() {
    return this.managementService.getFaqs();
  }

  @Post('faqs')
  @Permissions(Permission.ADMIN_SETTINGS)
  @ApiOperation({ summary: 'Create FAQ' })
  async createFaq(@Body() body: { question: string; answer: string; category?: string; language?: string }) {
    return this.managementService.createFaq(body);
  }

  @Put('faqs/:id')
  @Permissions(Permission.ADMIN_SETTINGS)
  @ApiOperation({ summary: 'Update FAQ' })
  async updateFaq(@Param('id') id: string, @Body() body: any) {
    return this.managementService.updateFaq(id, body);
  }

  @Delete('faqs/:id')
  @Permissions(Permission.ADMIN_SETTINGS)
  @ApiOperation({ summary: 'Delete FAQ' })
  async deleteFaq(@Param('id') id: string) {
    return this.managementService.deleteFaq(id);
  }

  // ── Audit Logs ──
  @Get('audit-logs')
  @Permissions(Permission.ADMIN_AUDIT_LOG)
  @ApiOperation({ summary: 'List audit logs' })
  async getAuditLogs(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.managementService.getAuditLogs({
      page: page ? +page : 1,
      limit: limit ? +limit : 20,
    });
  }

  @Get('reports/export')
  @Permissions(Permission.REPORT_VIEW_ALL)
  @ApiOperation({ summary: 'Export a downloadable system report' })
  async exportSystemReport() {
    return this.managementService.exportSystemReport();
  }
}
