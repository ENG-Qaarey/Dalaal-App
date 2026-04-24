import { ListingType } from '../../common/enums';
export declare class SearchQueryDto {
    q?: string;
    type?: ListingType;
    city?: string;
    minPrice?: number;
    maxPrice?: number;
}
