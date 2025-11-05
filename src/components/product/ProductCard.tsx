import { Product } from '@/types';
import { memo } from 'react';
import { Link } from 'react-router-dom';
import { usePrefetch } from '@/hooks/usePrefetch';

interface ProductCardProps {
  product: Product;
  isAuthenticated?: boolean;
  onDelete?: (id: number) => void;
}

const ProductCard = memo(
  ({ product, isAuthenticated = false, onDelete }: ProductCardProps) => {
    const { prefetchProduct } = usePrefetch();

    const handleMouseEnter = () => {
      prefetchProduct(product.id.toString());
    };

    const handleFocus = () => {
      prefetchProduct(product.id.toString());
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col">
        {/* Image and title are clickable */}
        <Link
          to={`/products/${product.id}`}
          className="block"
          onMouseEnter={handleMouseEnter}
          onFocus={handleFocus}
        >
          <div className="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            <img
              src={product.images[0]}
              alt={product.title}
              className="h-full w-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        </Link>

        <div className="p-4 flex flex-col flex-1">
          <Link
            to={`/products/${product.id}`}
            className="block mb-3"
            onMouseEnter={handleMouseEnter}
            onFocus={handleFocus}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-3 hover:text-primary-600 transition-colors">
              {product.title}
            </h3>
          </Link>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-bold text-primary-600">
              ${product.price}
            </span>

            {isAuthenticated && (
              <div className="flex space-x-2">
                <Link
                  to={`/products/${product.id}/edit`}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 text-sm"
                  onClick={e => e.stopPropagation()}
                  onMouseEnter={handleMouseEnter}
                  onFocus={handleFocus}
                >
                  ✏️ Edit
                </Link>
                {onDelete && (
                  <button
                    className="focus:outline-none text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-3 py-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 transition-colors duration-200"
                    onClick={e => {
                      e.stopPropagation();
                      onDelete(product.id);
                    }}
                  >
                    🗑️ Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default ProductCard;
