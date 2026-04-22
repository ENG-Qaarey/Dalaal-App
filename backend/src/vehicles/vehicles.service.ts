import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { VehiclesRepository } from './vehicles.repository';
import { ListingsService } from '../listings/listings.repository';
import { CreateVehicleDto, UpdateVehicleDto } from './dto';

@Injectable()
export class VehiclesService {
  constructor(
    private readonly vehiclesRepository: VehiclesRepository,
    private readonly listingsService: ListingsService,
  ) {}

  async create(userId: string, listingId: string, createVehicleDto: CreateVehicleDto) {
    const listing = await this.listingsService.findById(listingId);
    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only add details to your own listings');
    }
    return this.vehiclesRepository.create(listingId, createVehicleDto);
  }

  async update(userId: string, listingId: string, updateVehicleDto: UpdateVehicleDto) {
    const listing = await this.listingsService.findById(listingId);
    if (listing.userId !== userId) {
      throw new ForbiddenException('You can only update details of your own listings');
    }
    return this.vehiclesRepository.update(listingId, updateVehicleDto);
  }

  async findByListingId(listingId: string) {
    const vehicle = await this.vehiclesRepository.findByListingId(listingId);
    if (!vehicle) throw new NotFoundException('Vehicle details not found');
    return vehicle;
  }
}
