import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Favorites')
@Controller('favorites')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post(':listingId')
  @ApiOperation({ summary: 'Toggle favorite status for a listing' })
  async toggle(@CurrentUser() user: any, @Param('listingId') listingId: string) {
    return this.favoritesService.toggleFavorite(user.id, listingId);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my favorite listings' })
  async getMy(@CurrentUser() user: any) {
    return this.favoritesService.getMyFavorites(user.id);
  }
}
