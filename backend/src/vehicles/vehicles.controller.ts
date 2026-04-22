import { Controller, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@ApiTags('Vehicles')
@Controller('vehicles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post(':listingId')
  @ApiOperation({ summary: 'Create vehicle details for a listing' })
  async create(@Param('listingId') listingId: string, @Body() data: any) {
    return this.vehiclesService.create(listingId, data);
  }

  @Put(':listingId')
  @ApiOperation({ summary: 'Update vehicle details' })
  async update(@Param('listingId') listingId: string, @Body() data: any) {
    return this.vehiclesService.update(listingId, data);
  }
}
