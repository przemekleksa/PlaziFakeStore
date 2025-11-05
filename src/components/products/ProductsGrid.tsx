import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import ProductsGridSkeleton from '@/components/ui/ProductsGridSkeleton';
import ErrorFallback from '@/components/ui/ErrorFallback';

interface ProductsGridProps {
  products: Product[] | undefined;
  isAuthenticated: boolean;
  onDelete: (id: number, title: string) => void;
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
    return <ProductsGridSkeleton count={12} />;
  }

  if (error) {
    return (
      <ErrorFallback
        error={error}
        resetError={undefined}
        title="Failed to load products"
        message="We couldn't load the products. Please check your connection and try again."
        queryKey={['products']}
      />
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
          onDelete={id => onDelete(id, product.title)}
        />
      ))}
    </div>
  );
};

export default ProductsGrid;
