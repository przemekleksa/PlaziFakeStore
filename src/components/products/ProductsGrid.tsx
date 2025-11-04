import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';

interface ProductsGridProps {
  products: Product[] | undefined;
  isAuthenticated: boolean;
  onDelete: (id: number) => void;
  isLoading: boolean;
  error: Error | null;
  emptyMessage?: string;
}

const ProductsGrid = ({
  products,
  isAuthenticated,
  onDelete,
  isLoading,
  error,
  emptyMessage = 'No products available.',
}: ProductsGridProps) => {
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
          Error loading products. Please try again later.
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          isAuthenticated={isAuthenticated}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;
