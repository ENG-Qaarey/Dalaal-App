import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PropertiesRepository } from './properties.repository';
import { ListingsService } from '../listings/listings.repository';
import { CreatePropertyDto, UpdatePropertyDto } from './dto';

@Injectable()
export class PropertiesService {
  constructor(
    private readonly propertiesRepository: PropertiesRepository,
    private readonly listingsService: ListingsService,
  ) {}

  async create(userId: string, listingId: string, createPropertyDto: CreatePropertyDto) {
    const listing = await this.listingsService.findById(listingId);
    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only add details to your own listings');
    }
    return this.propertiesRepository.create(listingId, createPropertyDto);
  }

  async update(userId: string, listingId: string, updatePropertyDto: UpdatePropertyDto) {
    const listing = await this.listingsService.findById(listingId);
    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only update details of your own listings');
    }
    return this.propertiesRepository.update(listingId, updatePropertyDto);
  }

  async findByListingId(listingId: string) {
    const property = await this.propertiesRepository.findByListingId(listingId);
    if (!property) throw new NotFoundException('Property details not found');
    return property;
  }
}
