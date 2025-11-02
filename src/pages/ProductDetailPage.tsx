import { useProduct } from '@/hooks/useProducts';
import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;

  const [selectedImage, setSelectedImage] = useState(0);

  const { data: product, isLoading, isError } = useProduct(id);
  console.log(product);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">
            Product not found or failed to load.
          </p>
          <Link to="/" className="btn-primary mt-4">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Product Details
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link
              to={`/dashboard/products/${id}/edit`}
              className="btn-primary text-center"
            >
              Edit Product
            </Link>
            <Link
              to="/dashboard/products"
              className="btn-secondary text-center"
            >
              Back to Products
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImage]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 overflow-hidden ${
                      selectedImage === index
                        ? 'border-blue-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {product.title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Category: {product.category.name}
                </p>
              </div>

              <div className="text-3xl font-bold text-primary-600">
                ${product.price}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Description
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Created: {new Date(product.creationAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
