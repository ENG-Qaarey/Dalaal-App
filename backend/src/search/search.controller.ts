import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto';
import { Public } from '../common/decorators';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'Search listings' })
  async search(
    @Query() dto: SearchQueryDto,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.searchService.search(dto, +page, +limit);
  }
}
