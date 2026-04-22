import { Injectable } from '@nestjs/common';
import { SearchRepository } from './search.repository';
import { SearchQueryDto } from './dto';

@Injectable()
export class SearchService {
  constructor(private readonly searchRepository: SearchRepository) {}

  async search(dto: SearchQueryDto, page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [results, total] = await Promise.all([
      this.searchRepository.searchListings(dto, skip, limit),
      this.searchRepository.countResults(dto),
    ]);

    return {
      data: results,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
