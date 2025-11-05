import CategoryCardSkeleton from './CategoryCardSkeleton';

interface CategoriesGridSkeletonProps {
  count?: number;
}

const CategoriesGridSkeleton = ({ count = 6 }: CategoriesGridSkeletonProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        <CategoryCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default CategoriesGridSkeleton;
