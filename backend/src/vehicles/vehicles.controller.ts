import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto, UpdateVehicleDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Vehicles')
@Controller('vehicles')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post(':listingId')
  @ApiOperation({ summary: 'Add vehicle details to a listing' })
  async create(
    @CurrentUser() user: any,
    @Param('listingId') listingId: string,
    @Body() createVehicleDto: CreateVehicleDto,
  ) {
    return this.vehiclesService.create(user.id, listingId, createVehicleDto);
  }

  @Put(':listingId')
  @ApiOperation({ summary: 'Update vehicle details' })
  async update(
    @CurrentUser() user: any,
    @Param('listingId') listingId: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(user.id, listingId, updateVehicleDto);
  }

  @Get(':listingId')
  @ApiOperation({ summary: 'Get vehicle details by listing ID' })
  async findByListingId(@Param('listingId') listingId: string) {
    return this.vehiclesService.findByListingId(listingId);
  }
}
