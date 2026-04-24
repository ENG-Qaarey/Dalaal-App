import { PropertyType } from '../../common/enums';
export declare class CreatePropertyDto {
    propertyType: PropertyType;
    bedrooms?: number;
    bathrooms?: number;
    squareMeters?: number;
    yearBuilt?: number;
    furnished?: boolean;
    parking?: boolean;
    garden?: boolean;
    security?: boolean;
}
export declare class UpdatePropertyDto extends CreatePropertyDto {
}
