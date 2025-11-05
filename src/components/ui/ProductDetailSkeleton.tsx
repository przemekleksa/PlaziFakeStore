import Skeleton from './Skeleton';

const ProductDetailSkeleton = () => {
  return (
    <div data-testid="product-detail-skeleton">
      {/* Breadcrumbs skeleton */}
      <div className="mb-6">
        <div className="flex items-center space-x-2">
          <Skeleton height="h-4" width="w-16" />
          <span className="text-gray-400">/</span>
          <Skeleton height="h-4" width="w-20" />
          <span className="text-gray-400">/</span>
          <Skeleton height="h-4" width="w-24" />
        </div>
      </div>

      {/* Back button skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Skeleton height="h-10" width="w-32" />
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            {/* Main image skeleton */}
            <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />

            {/* Thumbnail images skeleton */}
            <div className="flex gap-2">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded border-2 border-gray-200 animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Title and category */}
            <div>
              <Skeleton height="h-8" width="w-3/4" className="mb-2" />
              <Skeleton height="h-4" width="w-1/3" />
            </div>

            {/* Price */}
            <Skeleton height="h-8" width="w-1/4" />

            {/* Description */}
            <div>
              <Skeleton height="h-6" width="w-1/3" className="mb-2" />
              <div className="space-y-2">
                <Skeleton height="h-4" width="w-full" />
                <Skeleton height="h-4" width="w-full" />
                <Skeleton height="h-4" width="w-3/4" />
              </div>
            </div>

            {/* Created date */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
              <Skeleton height="h-4" width="w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
