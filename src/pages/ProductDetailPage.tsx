import ConfirmModal from '@/components/ui/confimModal';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ProductDetailSkeleton from '@/components/ui/ProductDetailSkeleton';
import ErrorFallback from '@/components/ui/ErrorFallback';
import { useAuth } from '@/contexts/AuthContext';
import { useDeleteProduct, useProduct } from '@/hooks/useProducts';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';

import { useCallback, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PageHeader from '@/components/layout/PageHeader';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  if (!id) return null;

  const [selectedImage, setSelectedImage] = useState(0);
  const { user, logout, isAuthenticated } = useAuth();

  // Always go back to products page
  const backUrl = '/';

  const { data: product, isLoading, isError } = useProduct(id);
  const breadcrumbs = useBreadcrumbs({ product });

  const [isDeleteModalShown, setIsDeleteModalShown] = useState(false);

  const showDeleteModal = () => {
    setIsDeleteModalShown(true);
  };

  const hideDeleteModal = () => {
    setIsDeleteModalShown(false);
  };

  const remove = useDeleteProduct();

  const handleConfirmDelete = useCallback(() => {
    if (product) {
      remove.mutate(Number(id), {
        onSuccess: () => {
          toast.success(`${product.title} deleted successfully!`);
          navigate(backUrl);
        },
        onError: error => {
          console.error('Failed to delete product:', error);
          toast.error('Failed to delete product. Please try again.');
        },
      });
      setIsDeleteModalShown(false);
    }
  }, [remove, id, product, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 pt-8 pb-4">
          <PageHeader
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={logout}
          />
        </div>

        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <ProductDetailSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 pt-8 pb-4">
          <PageHeader
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={logout}
          />
        </div>

        <div className="container mx-auto px-4 pb-8">
          <div className="max-w-4xl mx-auto">
            <ErrorFallback
              error={undefined}
              resetError={undefined}
              title="Product not found"
              message="The product you're looking for doesn't exist or failed to load."
              showRetry={false}
              queryKey={['product', id]}
            />
            <div className="text-center mt-4">
              <Link to={backUrl} className="btn-primary">
                Back to Products
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="container mx-auto px-4 pt-8 pb-4">
        <PageHeader
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={logout}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <main id="main-content" className="max-w-4xl mx-auto" tabIndex={-1}>
          <Breadcrumbs items={breadcrumbs} />
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            {/* <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Product Details
          </h1> */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Link to={backUrl} className="btn-secondary text-center">
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

                <div className="pt-4 border-t border-gray-200 dark:border-gray-600 flex justify-between">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Created: {new Date(product.creationAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          {isAuthenticated && (
            <div className="mt-6 flex gap-6 justify-end">
              <Link
                to={`/products/${id}/edit`}
                className="btn-primary text-center"
              >
                ✏️ Edit
              </Link>
              <button
                className="focus:outline-none text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                onClick={showDeleteModal}
              >
                🗑️ Delete
              </button>
            </div>
          )}
          {isDeleteModalShown && (
            <ConfirmModal
              action={`Are you sure you want to delete "${product.title}"?`}
              accept={handleConfirmDelete}
              deny={hideDeleteModal}
              acceptLabel="Delete"
              denyLabel="Cancel"
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductDetailPage;
