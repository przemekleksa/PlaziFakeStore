import { ChangeEvent } from 'react';

interface ProductsSearchProps {
  value: string;
  onChange: (_value: string) => void;
  onClear: () => void;
}

const ProductsSearch = ({ value, onChange, onClear }: ProductsSearchProps) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <form className="lg:mb-6 mb-4 shadow-md relative">
      <label htmlFor="product-search" className="sr-only">
        Search products
      </label>
      <input
        id="product-search"
        type="text"
        placeholder="Search products..."
        value={value}
        onChange={handleChange}
        aria-label="Search products"
        className="input-field pr-12"
      />
      {value && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
          aria-label="Clear search"
        >
          <div className="w-4 h-4 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-0.5 bg-gray-400 group-hover:bg-gray-600 dark:bg-gray-500 dark:group-hover:bg-gray-300 rotate-45 absolute"></div>
              <div className="w-3 h-0.5 bg-gray-400 group-hover:bg-gray-600 dark:bg-gray-500 dark:group-hover:bg-gray-300 -rotate-45 absolute"></div>
            </div>
          </div>
        </button>
      )}
    </form>
  );
};

export default ProductsSearch;
