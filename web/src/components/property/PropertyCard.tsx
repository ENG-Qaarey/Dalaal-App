'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Property } from '@/types/property.types';
import { formatCurrency } from '@/lib/utils';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <Link href={`/properties/${property.id}`}>
      <Card className="cursor-pointer overflow-hidden h-full">
        {/* Image */}
        <div className="relative h-48 bg-gray-200">
          {property.images[0] ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No image
            </div>
          )}
          {property.featured && (
            <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-semibold">
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">
            {property.title}
          </h3>
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {property.location.address}
          </p>

          {/* Details */}
          <div className="flex gap-4 mb-3 text-sm text-gray-600">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <span>🛏️</span>
                <span>{property.bedrooms} bed</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <span>🚿</span>
                <span>{property.bathrooms} bath</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex justify-between items-center pt-3 border-t border-gray-200">
            <span className="text-lg font-bold text-blue-600">
              {formatCurrency(property.price, property.currency)}
            </span>
            <span className="text-xs text-gray-500">{property.type}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};
