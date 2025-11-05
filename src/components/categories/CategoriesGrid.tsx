import { Category } from '@/types';
import CategoryCard from './CategoryCard';
import CategoriesGridSkeleton from '@/components/ui/CategoriesGridSkeleton';
import ErrorFallback from '@/components/ui/ErrorFallback';

interface CategoriesGridProps {
  categories: Category[] | undefined;
  isLoading: boolean;
  error: Error | null;
  emptyMessage?: string;
}

const CategoriesGrid = ({
  categories,
  isLoading,
  error,
  emptyMessage = 'No categories available.',
}: CategoriesGridProps) => {
  if (isLoading) {
    return <CategoriesGridSkeleton count={6} />;
  }

  if (error) {
    return (
      <ErrorFallback
        error={error}
        resetError={undefined}
        title="Failed to load categories"
        message="We couldn't load the categories. Please check your connection and try again."
        queryKey={['categories']}
      />
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map(category => (
        <CategoryCard key={category.id} category={category} />
      ))}
    </div>
  );
};

export default CategoriesGrid;
