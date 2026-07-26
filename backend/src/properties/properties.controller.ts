import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto, UpdatePropertyDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Permissions } from '../common/decorators';
import { Permission } from '../common/enums';

@ApiTags('Properties')
@Controller('properties')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post(':listingId')
  @Permissions(Permission.PROPERTY_CREATE)
  @ApiOperation({ summary: 'Add property details to a listing' })
  async create(
    @CurrentUser() user: any,
    @Param('listingId') listingId: string,
    @Body() createPropertyDto: CreatePropertyDto,
  ) {
    return this.propertiesService.create(
      user.id,
      listingId,
      createPropertyDto,
    );
  }

  @Put(':listingId')
  @Permissions(Permission.PROPERTY_EDIT_OWN)
  @ApiOperation({ summary: 'Update property details' })
  async update(
    @CurrentUser() user: any,
    @Param('listingId') listingId: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertiesService.update(
      user.id,
      listingId,
      updatePropertyDto,
    );
  }

  @Get(':listingId')
  @Permissions(Permission.LISTING_VIEW)
  @ApiOperation({ summary: 'Get property details by listing ID' })
  async findByListingId(@Param('listingId') listingId: string) {
    return this.propertiesService.findByListingId(listingId);
  }
}
