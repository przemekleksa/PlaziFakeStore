import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import { useProductsLogic } from '@/hooks/useProductsLogic';
import PageHeader from '@/components/layout/PageHeader';
import ProductsSearch from '@/components/products/ProductsSearch';
import ProductsFilters from '@/components/products/ProductsFilters';
import ProductsGrid from '@/components/products/ProductsGrid';
import Pagination from '@/components/ui/Pagination';

const ProductsPage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { data: categories } = useCategories();
  const [filtersOpen, setFiltersOpen] = useState(false);

  const {
    urlParams,
    sortedProducts,
    totalProducts,
    totalPages,
    currentPage,
    isLoading,
    error,
    debouncedSearch,
    handleDelete,
    handleSearchChange,
    clearSearch,
    handlePageChange,
    handleFiltersChange,
  } = useProductsLogic();

  const emptyMessage = debouncedSearch
    ? 'No products found matching your search.'
    : 'No products available.';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={logout}
        />

        <main className="max-w-6xl mx-auto">
          <ProductsSearch
            value={urlParams.title}
            onChange={handleSearchChange}
            onClear={clearSearch}
          />

          <ProductsFilters
            filters={{
              priceMin: urlParams.priceMin,
              priceMax: urlParams.priceMax,
              category: urlParams.category,
              sortBy: urlParams.sortBy,
            }}
            categories={categories || []}
            onFiltersChange={handleFiltersChange}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
          />

          <ProductsGrid
            products={sortedProducts}
            isAuthenticated={isAuthenticated}
            onDelete={handleDelete}
            isLoading={isLoading}
            error={error}
            emptyMessage={emptyMessage}
          />

          {/* Pagination - only show when there are products or multiple pages */}
          {!isLoading && !error && totalProducts > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
