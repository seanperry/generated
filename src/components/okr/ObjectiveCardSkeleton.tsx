import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
export const ObjectiveCardSkeleton: React.FC = () => {
  return (
    <Card className="h-full flex flex-col border-gray-200 dark:border-gray-800 bg-white dark:bg-kelly-charcoal/90">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-12" />
        </div>
        <Skeleton className="h-4 w-full mt-2" />
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <Skeleton className="h-2 w-full" />
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-5/6" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-2 flex-1" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-3 w-1/3" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-4/6" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-2 flex-1" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};