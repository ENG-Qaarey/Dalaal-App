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
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const properties_repository_1 = require("./properties.repository");
const listings_service_1 = require("../listings/listings.service");
let PropertiesService = class PropertiesService {
    propertiesRepository;
    listingsService;
    constructor(propertiesRepository, listingsService) {
        this.propertiesRepository = propertiesRepository;
        this.listingsService = listingsService;
    }
    async create(userId, listingId, createPropertyDto) {
        const listing = await this.listingsService.findById(listingId);
        if (listing.userId !== userId) {
            throw new common_1.ForbiddenException('You can only add details to your own listings');
        }
        return this.propertiesRepository.create(listingId, createPropertyDto);
    }
    async update(userId, listingId, updatePropertyDto) {
        const listing = await this.listingsService.findById(listingId);
        if (listing.userId !== userId) {
            throw new common_1.ForbiddenException('You can only update details of your own listings');
        }
        return this.propertiesRepository.update(listingId, updatePropertyDto);
    }
    async findByListingId(listingId) {
        const property = await this.propertiesRepository.findByListingId(listingId);
        if (!property)
            throw new common_1.NotFoundException('Property details not found');
        return property;
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [properties_repository_1.PropertiesRepository,
        listings_service_1.ListingsService])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map