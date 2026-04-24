"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehiclesService = void 0;
const common_1 = require("@nestjs/common");
const vehicles_repository_1 = require("./vehicles.repository");
const listings_service_1 = require("../listings/listings.service");
let VehiclesService = class VehiclesService {
    vehiclesRepository;
    listingsService;
    constructor(vehiclesRepository, listingsService) {
        this.vehiclesRepository = vehiclesRepository;
        this.listingsService = listingsService;
    }
    async create(userId, listingId, createVehicleDto) {
        const listing = await this.listingsService.findById(listingId);
        if (listing.userId !== userId) {
            throw new common_1.ForbiddenException('You can only add details to your own listings');
        }
        return this.vehiclesRepository.create(listingId, createVehicleDto);
    }
    async update(userId, listingId, updateVehicleDto) {
        const listing = await this.listingsService.findById(listingId);
        if (listing.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update details of your own listings');
        }
        return this.vehiclesRepository.update(listingId, updateVehicleDto);
    }
    async findByListingId(listingId) {
        const vehicle = await this.vehiclesRepository.findByListingId(listingId);
        if (!vehicle)
            throw new common_1.NotFoundException('Vehicle details not found');
        return vehicle;
    }
};
exports.VehiclesService = VehiclesService;
exports.VehiclesService = VehiclesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [vehicles_repository_1.VehiclesRepository,
        listings_service_1.ListingsService])
], VehiclesService);
//# sourceMappingURL=vehicles.service.js.map