import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import { useProductsLogic } from '@/hooks/useProductsLogic';
import { useScrollShrink } from '../hooks/useScrollShrink';
import PageHeader from '@/components/layout/PageHeader';
import ProductsSearch from '@/components/products/ProductsSearch';
import ProductsFilters from '@/components/products/ProductsFilters';
import CompactSearchFilters from '@/components/products/CompactSearchFilters';
import ProductsGrid from '@/components/products/ProductsGrid';
import Pagination from '@/components/ui/Pagination';
import ConfirmModal from '@/components/ui/confimModal';

const ProductsPage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { data: categories } = useCategories();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerHeight, setHeaderHeight] = useState(300);
  const isScrolled = useScrollShrink(headerHeight);

  useEffect(() => {
    if (headerRef.current) {
      const height = headerRef.current.offsetHeight;
      setHeaderHeight(height - 20); // Subtract a bit to trigger before completely hidden
    }
  }, []);

  const {
    urlParams,
    sortedProducts,
    totalProducts,
    totalPages,
    currentPage,
    isLoading,
    error,
    debouncedSearch,
    deleteModalState,
    showDeleteModal,
    hideDeleteModal,
    handleConfirmDelete,
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
      {/* Normal Header and Search/Filters - always take space */}
      {!isScrolled && (
        <div
          ref={headerRef}
          className="container mx-auto px-4 py-8 pb-2 sm:pb-4"
        >
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
          </main>
        </div>
      )}

      {/* Invisible placeholder when scrolled to maintain layout */}
      {isScrolled && (
        <div className="container mx-auto px-4 py-8 invisible">
          <PageHeader
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={logout}
          />
          <main className="max-w-6xl mx-auto">
            <ProductsSearch value="" onChange={() => {}} onClear={() => {}} />
            <ProductsFilters
              filters={{
                priceMin: '',
                priceMax: '',
                category: '',
                sortBy: '',
              }}
              categories={[]}
              onFiltersChange={() => {}}
              isOpen={false}
              onToggle={() => {}}
            />
          </main>
        </div>
      )}

      {/* Sticky Compact Header - visible when scrolled */}
      {isScrolled && (
        <div className="sticky top-0 z-50 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
          <div className="container mx-auto px-4 py-3">
            <div className="max-w-6xl mx-auto relative">
              <CompactSearchFilters
                searchValue={urlParams.title}
                onSearchChange={handleSearchChange}
                onClearSearch={clearSearch}
                filters={{
                  priceMin: urlParams.priceMin,
                  priceMax: urlParams.priceMax,
                  category: urlParams.category,
                  sortBy: urlParams.sortBy,
                }}
                categories={categories || []}
                onFiltersChange={handleFiltersChange}
                isAuthenticated={isAuthenticated}
                onLogout={logout}
                user={user}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <main id="main-content" className="max-w-6xl mx-auto" tabIndex={-1}>
          <ProductsGrid
            products={sortedProducts}
            isAuthenticated={isAuthenticated}
            onDelete={showDeleteModal}
            isLoading={isLoading}
            error={error}
            emptyMessage={emptyMessage}
          />

          {!isLoading && !error && totalProducts > 0 && totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModalState.isOpen && (
        <ConfirmModal
          action={`Are you sure you want to delete "${deleteModalState.productTitle}"?`}
          accept={handleConfirmDelete}
          deny={hideDeleteModal}
          acceptLabel="Delete"
          denyLabel="Cancel"
        />
      )}
    </div>
  );
};

export default ProductsPage;
