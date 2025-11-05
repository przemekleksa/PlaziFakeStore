import Skeleton from './Skeleton';

const ProductCardSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />

      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <Skeleton height="h-5" width="w-3/4" />

        {/* Category skeleton */}
        <Skeleton height="h-4" width="w-1/2" />

        {/* Price skeleton */}
        <Skeleton height="h-6" width="w-1/3" />

        {/* Description skeleton */}
        <div className="space-y-2">
          <Skeleton height="h-3" width="w-full" />
          <Skeleton height="h-3" width="w-5/6" />
        </div>

        {/* Action buttons skeleton */}
        <div className="flex gap-2 pt-2">
          <Skeleton height="h-8" width="w-16" />
          <Skeleton height="h-8" width="w-16" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
