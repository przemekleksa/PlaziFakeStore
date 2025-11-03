import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDeleteProduct, useProducts } from '@/hooks/useProducts';
import { useState, useCallback, useMemo, useEffect } from 'react';

import ProductCard from '@/components/product/ProductCard';
import useDebounce from '@/hooks/useDebounce';
import { useCategories } from '@/hooks/useCategories';
import { useUrlParams } from '@/hooks/useUrlParams';

ProductCard.displayName = 'ProductCard';

interface ProductsPageParams {
  sortBy: string;
  category: string;
  priceMin: string;
  priceMax: string;
  title: string;
  limit: number;
  offset: number;
}

const ProductsPage = () => {
  const { user, logout, isAuthenticated } = useAuth();

  // URL params management
  const {
    params: urlParams,
    updateParams,
    isInitialized,
  } = useUrlParams<ProductsPageParams>({
    defaultValues: {
      sortBy: '',
      category: '',
      priceMin: '',
      priceMax: '',
      title: '',
      limit: 12,
      offset: 0,
    },
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(urlParams.title, 300, 3);
  const debouncedPriceMin = useDebounce(urlParams.priceMin, 500, 0);
  const debouncedPriceMax = useDebounce(urlParams.priceMax, 500, 0);

  const useSorting = urlParams.sortBy !== '';

  const filters = useMemo(
    () => ({
      title: debouncedSearch,
      price_min:
        debouncedPriceMin || debouncedPriceMax
          ? debouncedPriceMin
            ? Number(debouncedPriceMin)
            : 1
          : undefined,
      price_max:
        debouncedPriceMin || debouncedPriceMax
          ? debouncedPriceMax
            ? Number(debouncedPriceMax)
            : 999999
          : undefined,
      categoryId: urlParams.category ? Number(urlParams.category) : undefined,

      ...(useSorting
        ? {}
        : {
            limit: urlParams.limit,
            offset: urlParams.offset,
          }),
    }),
    [
      debouncedSearch,
      debouncedPriceMax,
      debouncedPriceMin,
      urlParams.category,
      urlParams.limit,
      urlParams.offset,
      useSorting,
    ]
  );

  const { data: products, isLoading, error } = useProducts(filters);
  const { data: allProducts } = useProducts({
    ...filters,
    limit: 0,
  });

  const { data: categories } = useCategories();

  const nextPage = () => {
    updateParams({
      offset: urlParams.offset + urlParams.limit,
    });
  };

  const prevPage = () => {
    updateParams({
      offset: Math.max(0, urlParams.offset - urlParams.limit),
    });
  };

  const totalProducts = useSorting
    ? products?.length || 0
    : allProducts?.length || 0;

  const totalPages =
    totalProducts > 0 ? Math.ceil(totalProducts / urlParams.limit) : 0;

  const currentPage =
    totalProducts > 0 ? Math.floor(urlParams.offset / urlParams.limit) + 1 : 0;

  const isLastPage = useSorting
    ? urlParams.offset + urlParams.limit >= totalProducts
    : products && products.length < urlParams.limit;

  const [previousSortBy, setPreviousSortBy] = useState(urlParams.sortBy);

  // Reset offset when sort changes (but not on initial load)
  useEffect(() => {
    if (isInitialized && urlParams.sortBy !== previousSortBy) {
      updateParams({ offset: 0 });
      setPreviousSortBy(urlParams.sortBy);
    }
  }, [urlParams.sortBy, isInitialized, previousSortBy, updateParams]);

  const sortedProducts = useMemo(() => {
    if (!products) return undefined;

    const productsCopy = [...products];

    if (!useSorting) {
      return productsCopy;
    }
    let sorted;
    switch (urlParams.sortBy) {
      case 'price-high':
        sorted = productsCopy.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        sorted = productsCopy.sort((a, b) => a.price - b.price);
        break;
      case 'name-az':
        sorted = productsCopy.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-za':
        sorted = productsCopy.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
        sorted = productsCopy.sort((a, b) => {
          const dateA = new Date(a.creationAt);
          const dateB = new Date(b.creationAt);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case 'oldest':
        sorted = productsCopy.sort((a, b) => {
          const dateA = new Date(a.creationAt);
          const dateB = new Date(b.creationAt);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      default:
        sorted = productsCopy;
    }

    const start = urlParams.offset;
    const end = start + urlParams.limit;
    return sorted.slice(start, end);
  }, [
    products,
    urlParams.sortBy,
    useSorting,
    urlParams.offset,
    urlParams.limit,
  ]);

  const remove = useDeleteProduct();

  const handleDelete = useCallback(
    (id: number) => {
      remove.mutate(id);
    },
    [remove]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      updateParams({
        title: e.target.value,
        offset: 0, // Reset pagination when searching
      });
    },
    [updateParams]
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Platzi Fake Store
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {isAuthenticated
                ? `Welcome back, ${user?.name || user?.email}!`
                : 'Discover amazing products'}
            </p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/products/new" className="btn-primary">
                  Add Product
                </Link>
                <Link to="/categories" className="btn-secondary">
                  Categories
                </Link>
                <Link to="/dashboard" className="btn-secondary">
                  Dashboard
                </Link>
                <button onClick={logout} className="btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="lg:hidden shadow-md ">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
            >
              <svg
                className="w-6 h-6 text-gray-600 dark:text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </header>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
            <div className="space-y-3">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/products/new"
                    className="block w-full text-center btn-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Add Product
                  </Link>
                  <Link
                    to="/categories"
                    className="block w-full text-center btn-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Categories
                  </Link>
                  <Link
                    to="/dashboard"
                    className="block w-full text-center btn-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-center btn-secondary"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center btn-primary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}

        <main className="max-w-6xl mx-auto">
          <form className="lg:mb-6 mb-4 shadow-md ">
            <input
              type="text"
              placeholder="Search products..."
              value={urlParams.title}
              onChange={handleSearchChange}
              className="input-field"
            />
            <button type="submit"></button>
          </form>

          {/* Mobile Filters Toggle */}
          <div className="lg:hidden mb-4 shadow-md ">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-600 dark:text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="font-medium text-gray-900 dark:text-white">
                  Filters & Sort
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-gray-600 dark:text-gray-300 transform transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>

          {/* Filters Content */}
          <div
            className={`${filtersOpen ? 'block' : 'hidden'} lg:block bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 shadow-md`}
          >
            <div className="flex flex-wrap items-end gap-6">
              {/* Price Filter */}
              <div className="flex-1 min-w-[200px] space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Price Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    min="0"
                    value={urlParams.priceMin}
                    onChange={e =>
                      updateParams({
                        priceMin: e.target.value,
                        offset: 0, // Reset pagination when filtering
                      })
                    }
                    onKeyDown={e => {
                      if (['e', 'E', '+', '-'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white"
                  />
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    to
                  </span>
                  <input
                    type="number"
                    placeholder="Max"
                    min="0"
                    value={urlParams.priceMax}
                    onChange={e =>
                      updateParams({
                        priceMax: e.target.value,
                        offset: 0, // Reset pagination when filtering
                      })
                    }
                    onKeyDown={e => {
                      if (['e', 'E', '+', '-'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white"
                  />
                  {(urlParams.priceMin || urlParams.priceMax) && (
                    <button
                      onClick={() =>
                        updateParams({
                          priceMin: '',
                          priceMax: '',
                          offset: 0,
                        })
                      }
                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-2"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex-1 min-w-[180px] space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <div className="flex items-center gap-2">
                  <select
                    value={urlParams.category}
                    onChange={e =>
                      updateParams({
                        category: e.target.value,
                        offset: 0, // Reset pagination when filtering
                      })
                    }
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    {categories?.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {urlParams.category && (
                    <button
                      onClick={() =>
                        updateParams({
                          category: '',
                          offset: 0,
                        })
                      }
                      className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 px-2"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Sort Filter */}
              <div className="flex-1 min-w-[160px] space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Sort by
                </label>
                <select
                  value={urlParams.sortBy}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white"
                  onChange={e =>
                    updateParams({
                      sortBy: e.target.value,
                      offset: 0, // Reset pagination when sorting changes
                    })
                  }
                >
                  <option value="">Default</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="name-az">Name: A - Z</option>
                  <option value="name-za">Name: Z - A</option>
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
              <p className="text-red-800 dark:text-red-200">
                Error loading products. Please try again later.
              </p>
            </div>
          )}

          {!isLoading && !error && products && products.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                {debouncedSearch
                  ? 'No products found matching your search.'
                  : 'No products available.'}
              </p>
            </div>
          )}

          {!isLoading && !error && products && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedProducts?.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isAuthenticated={isAuthenticated}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}

          {/* Pagination - only show when there are products or multiple pages */}
          {!isLoading && !error && totalProducts > 0 && (
            <div className="flex justify-between items-center mt-8">
              <span className="text-sm text-gray-700 dark:text-gray-300">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={prevPage}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Previous
                </button>
                <button
                  disabled={
                    useSorting ? isLastPage : currentPage === totalPages
                  }
                  onClick={nextPage}
                  className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
