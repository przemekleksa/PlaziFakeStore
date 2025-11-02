import { Product } from '@/types';
import { memo } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = memo(
  ({
    product,
    isAuthenticated,
    onDelete,
  }: {
    product: Product;
    isAuthenticated: boolean;
    onDelete: (id: number) => void;
  }) => (
    <Link
      to={`/product/${product.id}`}
      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden h-full flex flex-col">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <img
            src={product.images[0]}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-3">
            {product.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
            {product.description}
          </p>

          <div className="flex items-center justify-between mt-auto">
            <span className="text-xl font-bold text-primary-600">
              ${product.price}
            </span>
            <div className="flex space-x-2">
              {/* <Link
              to={`/product/${product.id}`}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View
            </Link> */}
              {/* {isAuthenticated && (
              <Link
                to={`/products/${product.id}/edit`}
                className="text-gray-600 hover:text-gray-700 text-sm font-medium"
              >
                Edit
              </Link>
            )}
            {isAuthenticated && (
              <button
                className="text-red-600 hover:text-red-700 text-sm font-medium"
                onClick={() => onDelete(product.id)}
              >
                Delete
              </button>
            )} */}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
);

export default ProductCard;
