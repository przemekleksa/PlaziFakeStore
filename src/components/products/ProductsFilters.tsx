import { Category } from '@/types';
import { ProductsPageParams } from '@/hooks/useProductsLogic';

interface ProductsFiltersProps {
  filters: {
    priceMin: string;
    priceMax: string;
    category: string;
    sortBy: string;
  };
  categories: Category[];
  onFiltersChange: (filters: Partial<ProductsPageParams>) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const ProductsFilters = ({
  filters,
  categories,
  onFiltersChange,
  isOpen,
  onToggle,
}: ProductsFiltersProps) => {
  const handlePriceMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ priceMin: e.target.value });
  };

  const handlePriceMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ priceMax: e.target.value });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ category: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ sortBy: e.target.value });
  };

  const clearPriceFilters = () => {
    onFiltersChange({ priceMin: '', priceMax: '' });
  };

  const clearCategoryFilter = () => {
    onFiltersChange({ category: '' });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (['e', 'E', '+', '-'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <>
      {/* Mobile Filters Toggle */}
      <div className="lg:hidden mb-4 shadow-md ">
        <button
          onClick={onToggle}
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
            className={`w-5 h-5 text-gray-600 dark:text-gray-300 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
        className={`${isOpen ? 'block' : 'hidden'} lg:block bg-white dark:bg-gray-800 rounded-lg p-6 mb-6 border border-gray-200 dark:border-gray-700 shadow-md`}
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
                value={filters.priceMin}
                onChange={handlePriceMinChange}
                onKeyDown={handleKeyDown}
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white"
              />
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                to
              </span>
              <input
                type="number"
                placeholder="Max"
                min="0"
                value={filters.priceMax}
                onChange={handlePriceMaxChange}
                onKeyDown={handleKeyDown}
                className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white"
              />
              {(filters.priceMin || filters.priceMax) && (
                <button
                  onClick={clearPriceFilters}
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
                value={filters.category}
                onChange={handleCategoryChange}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white"
              >
                <option value="">All Categories</option>
                {categories?.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {filters.category && (
                <button
                  onClick={clearCategoryFilter}
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
              value={filters.sortBy}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white"
              onChange={handleSortChange}
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
    </>
  );
};

export default ProductsFilters;
