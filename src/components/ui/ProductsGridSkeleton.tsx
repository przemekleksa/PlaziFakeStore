import ProductCardSkeleton from './ProductCardSkeleton';

interface ProductsGridSkeletonProps {
  count?: number;
}

const ProductsGridSkeleton = ({ count = 12 }: ProductsGridSkeletonProps) => {
  return (
    <div
      data-testid="products-grid-skeleton"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {[...Array(count)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ProductsGridSkeleton;
