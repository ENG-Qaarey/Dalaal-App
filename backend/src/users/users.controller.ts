import {
  Controller,
  Get,
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
  ApiQuery,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateProfileDto, UpdateUserDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { PermissionsGuard } from '../common/guards/permissions.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public, Roles, Permissions } from '../common/decorators';
import { UserRole, Permission } from '../common/enums';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard, PermissionsGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions(Permission.USER_LIST)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users or search users' })
  @ApiQuery({ name: 'q', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of users' })
  async findAll(
    @Query('q') q = '',
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @CurrentUser() currentUser: any,
  ) {
    if (q) {
      return this.usersService.searchUsers(
        q,
        +page,
        +limit,
        currentUser?.id,
      );
    }
    return this.usersService.findAll(+page, +limit, currentUser?.id);
  }

  @Get('profile')
  @Permissions(Permission.PROFILE_VIEW_OWN)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'User profile' })
  async getProfile(@CurrentUser() user: any) {
    return this.usersService.getProfile(user.id);
  }

  @Get(':id')
  @Permissions(Permission.USER_VIEW)
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User details' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put('profile')
  @Permissions(Permission.PROFILE_EDIT_OWN)
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Put(':id')
  @Permissions(Permission.USER_UPDATE)
  @ApiOperation({ summary: 'Update user (admin only)' })
  @ApiResponse({ status: 200, description: 'User updated' })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() requestingUser: any,
  ) {
    return this.usersService.updateUser(id, updateUserDto, requestingUser);
  }

  @Delete(':id')
  @Permissions(Permission.USER_DELETE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Delete user (super admin only)' })
  @ApiResponse({ status: 200, description: 'User deleted' })
  async deleteUser(
    @Param('id') id: string,
    @CurrentUser() requestingUser: any,
  ) {
    return this.usersService.deleteUser(id, requestingUser);
  }
}
