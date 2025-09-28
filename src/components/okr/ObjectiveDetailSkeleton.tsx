import React from 'react';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
export const ObjectiveDetailSkeleton: React.FC = () => {
  return (
    <Card className="w-full border-gray-200 dark:border-gray-800 shadow-lg bg-white dark:bg-kelly-charcoal/90">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-8 w-20" />
        </div>
        <Skeleton className="h-8 w-3/4 mt-4" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-2 w-full mt-4" />
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-16 w-full" />
        </div>
        <div>
          <Skeleton className="h-6 w-1/4 mb-4" />
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-5/6" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-2 flex-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-4/6" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-2 flex-1" />
                <Skeleton className="h-4 w-12" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Skeleton className="h-5 w-32" />
      </CardFooter>
    </Card>
  );
};