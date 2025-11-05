import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Category } from '@/types';
import { ProductsPageParams } from '@/hooks/useProductsLogic';

interface CompactSearchFiltersProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
  filters: {
    priceMin: string;
    priceMax: string;
    category: string;
    sortBy: string;
  };
  categories: Category[];
  onFiltersChange: (filters: Partial<ProductsPageParams>) => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  user: any;
}

const CompactSearchFilters = ({
  searchValue,
  onSearchChange,
  onClearSearch,
  filters,
  categories,
  onFiltersChange,
  isAuthenticated,
  onLogout,
  user,
}: CompactSearchFiltersProps) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleFiltersToggle = () => {
    setFiltersOpen(!filtersOpen);
    if (mobileMenuOpen) setMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    if (filtersOpen) setFiltersOpen(false);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      priceMin: '',
      priceMax: '',
      category: '',
      sortBy: '',
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  return (
    <div className="flex items-center gap-3">
      {/* Logo */}
      <Link to="/" className="flex-shrink-0">
        <img
          src="/assets/images/platziStoreLogo.png"
          alt="Platzi Store"
          className="w-10 h-10 object-contain hover:scale-105 transition-transform duration-200"
        />
      </Link>

      {/* Search Input */}
      <div className="flex-1 relative h-10">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        {searchValue && (
          <button
            type="button"
            onClick={onClearSearch}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Filters Button */}
      <button
        onClick={handleFiltersToggle}
        aria-label={filtersOpen ? 'Close filters' : 'Open filters'}
        aria-expanded={filtersOpen}
        className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 h-10"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.707A1 1 0 013 7V4z"
          />
        </svg>
        <span className="hidden sm:inline">Filters</span>
      </button>

      {/* Mobile Hamburger Menu */}
      <div className="lg:hidden">
        <button
          onClick={handleMobileMenuToggle}
          aria-label={
            mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
          }
          aria-expanded={mobileMenuOpen}
          className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-10"
        >
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
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
            <div className="space-y-3">
              {isAuthenticated && (
                <Link
                  to="/products/new"
                  className="block w-full text-left px-3 py-2 text-sm bg-primary-600 text-white hover:bg-primary-700 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Add Product
                </Link>
              )}

              <Link
                to="/categories"
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-left px-3 py-2 text-sm bg-primary-600 text-white hover:bg-primary-700 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-3">
        {isAuthenticated && (
          <Link
            to="/products/new"
            className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Add Product
          </Link>
        )}

        <Link
          to="/categories"
          className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Categories
        </Link>

        {isAuthenticated ? (
          <>
            <button
              onClick={onLogout}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Logout
            </button>
            {user?.avatar && (
              <Link to="/dashboard">
                <img
                  src={user.avatar}
                  alt="User avatar"
                  className="w-9 h-9 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors cursor-pointer"
                />
              </Link>
            )}
          </>
        ) : (
          <Link
            to="/login"
            className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Login
          </Link>
        )}
      </div>

      {/* Filters Dropdown */}
      {filtersOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-40">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Filters
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Clear All
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Min Price
              </label>
              <input
                type="number"
                placeholder="0"
                value={filters.priceMin}
                onChange={e => onFiltersChange({ priceMin: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Max Price
              </label>
              <input
                type="number"
                placeholder="1000"
                value={filters.priceMax}
                onChange={e => onFiltersChange({ priceMax: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Category
              </label>
              <select
                value={filters.category}
                onChange={e => onFiltersChange({ category: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Sort By
              </label>
              <select
                value={filters.sortBy}
                onChange={e => onFiltersChange({ sortBy: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-az">Name: A to Z</option>
                <option value="name-za">Name: Z to A</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompactSearchFilters;
