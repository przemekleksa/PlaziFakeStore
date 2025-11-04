import { Category } from '@/types';
import CategoryCard from './CategoryCard';

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
    return (
      <div className="flex justify-center items-center py-12">
        <div
          data-testid="loading-spinner"
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
        <p className="text-red-800 dark:text-red-200">
          Error loading categories. Please try again later.
        </p>
      </div>
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
