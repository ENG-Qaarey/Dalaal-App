import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Properties')
@Controller('properties')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post(':listingId')
  @ApiOperation({ summary: 'Add property details to a listing' })
  async create(
    @CurrentUser() user: any,
    @Param('listingId') listingId: string,
    @Body() createPropertyDto: CreatePropertyDto,
  ) {
    return this.propertiesService.create(user.id, listingId, createPropertyDto);
  }

  @Put(':listingId')
  @ApiOperation({ summary: 'Update property details' })
  async update(
    @CurrentUser() user: any,
    @Param('listingId') listingId: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(user.id, listingId, updatePropertyDto);
  }

  @Get(':listingId')
  @ApiOperation({ summary: 'Get property details by listing ID' })
  async findByListingId(@Param('listingId') listingId: string) {
    return this.propertiesService.findByListingId(listingId);
  }
}
