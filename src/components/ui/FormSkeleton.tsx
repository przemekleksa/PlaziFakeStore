import Skeleton from './Skeleton';

const FormSkeleton = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="space-y-6">
        {/* Title field */}
        <div>
          <Skeleton height="h-4" width="w-16" className="mb-2" />
          <Skeleton height="h-10" width="w-full" />
        </div>

        {/* Description field */}
        <div>
          <Skeleton height="h-4" width="w-20" className="mb-2" />
          <Skeleton height="h-24" width="w-full" />
        </div>

        {/* Price field */}
        <div>
          <Skeleton height="h-4" width="w-12" className="mb-2" />
          <Skeleton height="h-10" width="w-32" />
        </div>

        {/* Category field */}
        <div>
          <Skeleton height="h-4" width="w-16" className="mb-2" />
          <Skeleton height="h-10" width="w-48" />
        </div>

        {/* Images field */}
        <div>
          <Skeleton height="h-4" width="w-14" className="mb-2" />
          <div className="space-y-2">
            <Skeleton height="h-10" width="w-full" />
            <Skeleton height="h-10" width="w-full" />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 pt-4">
          <Skeleton height="h-10" width="w-24" />
          <Skeleton height="h-10" width="w-20" />
        </div>
      </div>
    </div>
  );
};

export default FormSkeleton;
