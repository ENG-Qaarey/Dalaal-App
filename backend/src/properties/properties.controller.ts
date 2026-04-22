import { Controller, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Properties')
@Controller('properties')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post(':listingId')
  @ApiOperation({ summary: 'Create property details for a listing' })
  async create(@Param('listingId') listingId: string, @Body() data: any) {
    return this.propertiesService.create(listingId, data);
  }

  @Put(':listingId')
  @ApiOperation({ summary: 'Update property details' })
  async update(@Param('listingId') listingId: string, @Body() data: any) {
    return this.propertiesService.update(listingId, data);
  }
}
