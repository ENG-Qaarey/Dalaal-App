'use client';

import { Card } from '@/components/ui/Card';

export const PropertyCardSkeleton: React.FC = () => {
  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-gray-200 animate-pulse" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 rounded animate-pulse" />
        <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3 mt-4" />
      </div>
    </Card>
  );
};
