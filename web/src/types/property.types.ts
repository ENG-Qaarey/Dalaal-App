export type PropertyType = 'APARTMENT' | 'VILLA' | 'HOUSE' | 'LAND' | 'COMMERCIAL';
export type ListingStatus = 'ACTIVE' | 'SOLD' | 'RENTED' | 'INACTIVE';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: ListingStatus;
  price: number;
  currency: string;
  location: Location;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  amenities?: string[];
  agentId: string;
  agentName?: string;
  agentAvatar?: string;
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  views?: number;
  favorites?: number;
}

export interface Location {
  address: string;
  city: string;
  district?: string;
  country: string;
  latitude?: number;
  longitude?: number;
  postalCode?: string;
}

export interface PropertyFilter {
  type?: PropertyType[];
  status?: ListingStatus[];
  minPrice?: number;
  maxPrice?: number;
  city?: string;
  bedrooms?: number;
  bathrooms?: number;
  sortBy?: 'newest' | 'popular' | 'price_low' | 'price_high';
  page?: number;
  limit?: number;
}

export interface CreatePropertyPayload {
  title: string;
  description: string;
  type: PropertyType;
  price: number;
  currency: string;
  location: Location;
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  amenities?: string[];
}
