import Skeleton from './Skeleton';

const CategoryCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />

      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton height="h-6" width="w-3/4" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton height="h-3" width="w-full" />
          <Skeleton height="h-3" width="w-2/3" />
        </div>

        {/* Action button skeleton */}
        <div className="pt-2">
          <Skeleton height="h-8" width="w-24" />
        </div>
      </div>
    </div>
  );
};

export default CategoryCardSkeleton;
