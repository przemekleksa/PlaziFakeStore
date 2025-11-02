import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDeleteProduct, useProducts } from '@/hooks/useProducts';
import { useState, useCallback, useMemo, useEffect } from 'react';

import ProductCard from '@/components/product/ProductCard';
import useDebounce from '@/hooks/useDebounce';
import { useCategories } from '@/hooks/useCategories';

ProductCard.displayName = 'ProductCard';

const ProductsPage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState({
    priceMin: '',
    priceMax: '',
  });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300, 3);
  const debouncedPriceMin = useDebounce(priceFilter.priceMin, 500, 0);
  const debouncedPriceMax = useDebounce(priceFilter.priceMax, 500, 0);

  const [pagination, setPagination] = useState({ limit: 12, offset: 0 });

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
      categoryId: selectedCategory ? Number(selectedCategory) : undefined,

      limit: pagination.limit,
      offset: pagination.offset,
    }),
    [
      debouncedSearch,
      debouncedPriceMax,
      debouncedPriceMin,
      selectedCategory,
      pagination,
    ]
  );

  const { data: products, isLoading, error } = useProducts(filters);
  const { data: allProducts } = useProducts({
    ...filters,
    limit: 0,
  });

  const { data: categories } = useCategories();

  const nextPage = () => {
    setPagination(prev => ({
      ...prev,
      offset: prev.offset + prev.limit,
    }));
  };

  const prevPage = () => {
    setPagination(prev => ({
      ...prev,
      offset: Math.max(0, prev.offset - prev.limit),
    }));
  };

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil((allProducts?.length || 0) / pagination.limit);

  useEffect(() => {
    console.log(pagination, currentPage, totalPages);
  }, [pagination]);

  // There is an issue here an it is connected to API architecture.
  // If we want to use pagination (limit & offset) from API then sorting on clients side works only for displayed products as described in task requirements:
  // * Use the official filter & pagination params when listing products:
  // `title`, `price`, `price_min`, `price_max`, `categoryId`/`categorySlug`, `limit`, `offset`.

  const sortedProducts = useMemo(() => {
    if (!products) return undefined;

    const productsCopy = [...products];

    switch (sortBy) {
      case 'price-high':
        return productsCopy.sort((a, b) => b.price - a.price);
      case 'price-low':
        return productsCopy.sort((a, b) => a.price - b.price);
      case 'name-az':
        return productsCopy.sort((a, b) => a.title.localeCompare(b.title));
      case 'name-za':
        return productsCopy.sort((a, b) => b.title.localeCompare(a.title));
      case 'newest':
        return productsCopy.sort((a, b) => {
          const dateA = new Date(a.creationAt);
          const dateB = new Date(b.creationAt);
          return dateB.getTime() - dateA.getTime();
        });
      case 'oldest':
        return productsCopy.sort((a, b) => {
          const dateA = new Date(a.creationAt);
          const dateB = new Date(b.creationAt);
          return dateA.getTime() - dateB.getTime();
        });
      default:
        return productsCopy;
    }
  }, [products, sortBy]);

  const remove = useDeleteProduct();

  const handleDelete = useCallback(
    (id: number) => {
      remove.mutate(id);
    },
    [remove]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
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
              value={searchTerm}
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
            className={`${filtersOpen ? 'block' : 'hidden'} lg:block bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 shadow-sm`}
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
                    value={priceFilter.priceMin}
                    onChange={e =>
                      setPriceFilter({
                        ...priceFilter,
                        priceMin: e.target.value,
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
                    value={priceFilter.priceMax}
                    onChange={e =>
                      setPriceFilter({
                        ...priceFilter,
                        priceMax: e.target.value,
                      })
                    }
                    onKeyDown={e => {
                      if (['e', 'E', '+', '-'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white"
                  />
                  {(priceFilter.priceMin || priceFilter.priceMax) && (
                    <button
                      onClick={() =>
                        setPriceFilter({
                          ...priceFilter,
                          priceMin: '',
                          priceMax: '',
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
                    value={selectedCategory}
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">All Categories</option>
                    {categories?.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {selectedCategory && (
                    <button
                      onClick={() => setSelectedCategory('')}
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white"
                  onChange={e => setSortBy(e.target.value)}
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

          <div className="flex justify-between items-center mt-8 ">
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={prevPage}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={nextPage}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
              Next Steps:
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p>• Replace placeholder cards with real product data from API</p>
              <p>• Add search and filtering functionality</p>
              <p>• Implement pagination</p>
              <p>• Add shopping cart functionality</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;
