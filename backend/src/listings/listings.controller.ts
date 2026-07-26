import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ListingsService } from './listings.service';
import {
  CreateListingDto,
  UpdateListingDto,
  ListingFilterDto,
} from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public, Permissions } from '../common/decorators';
import { Permission } from '../common/enums';

@ApiTags('Listings')
@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.LISTING_CREATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a new listing' })
  @ApiResponse({ status: 201, description: 'Listing created' })
  async create(
    @CurrentUser() user: any,
    @Body() createListingDto: CreateListingDto,
  ) {
    return this.listingsService.create(user.id, createListingDto);
  }

  @Get()
  @Public()
  @Permissions(Permission.LISTING_VIEW)
  @ApiOperation({ summary: 'Get all listings' })
  @ApiResponse({ status: 200, description: 'List of listings' })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query() filters?: ListingFilterDto,
  ) {
    return this.listingsService.findAll(+page, +limit, filters);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.LISTING_VIEW)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get listings owned by the current user' })
  @ApiResponse({ status: 200, description: 'User listings' })
  async findMine(
    @CurrentUser() user: any,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.listingsService.findMine(user.id, +page, +limit);
  }

  @Get(':id')
  @Public()
  @Permissions(Permission.LISTING_VIEW)
  @ApiOperation({ summary: 'Get listing by ID' })
  @ApiResponse({ status: 200, description: 'Listing details' })
  async findById(@Param('id') id: string) {
    return this.listingsService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.LISTING_EDIT_OWN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a listing' })
  @ApiResponse({ status: 200, description: 'Listing updated' })
  async update(
    @Param('id') id: string,
    @CurrentUser() user: any,
    @Body() updateListingDto: UpdateListingDto,
  ) {
    return this.listingsService.update(id, user.id, updateListingDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.LISTING_DELETE_OWN)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete a listing' })
  @ApiResponse({ status: 200, description: 'Listing deleted' })
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.listingsService.delete(id, user.id);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Permissions(Permission.LISTING_CREATE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publish a listing' })
  @ApiResponse({ status: 200, description: 'Listing published' })
  async publish(@Param('id') id: string, @CurrentUser() user: any) {
    return this.listingsService.publish(id, user.id);
  }
}
