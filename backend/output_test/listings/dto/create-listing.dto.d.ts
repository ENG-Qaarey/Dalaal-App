import { ListingType, ListingStatus, PropertyType, VehicleType } from '../../common/enums';
export declare class CreateListingDto {
    type: ListingType;
    title: string;
    description?: string;
    price: number;
    priceNegotiable?: boolean;
    city: string;
    district?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    featuredImage?: string;
}
export declare class UpdateListingDto {
    title?: string;
    description?: string;
    price?: number;
    priceNegotiable?: boolean;
    city?: string;
    district?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    status?: ListingStatus;
}
export declare class ListingFilterDto {
    type?: ListingType;
    status?: ListingStatus;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    propertyType?: PropertyType;
    vehicleType?: VehicleType;
}
