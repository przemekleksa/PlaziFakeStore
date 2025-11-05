import { useProduct, useUpdateProduct } from '@/hooks/useProducts';
import { Link, useParams } from 'react-router-dom';
import ProductForm from '@/components/forms/ProductForm';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { toast } from 'react-toastify';

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;

  const { data: product, isLoading, isError } = useProduct(id);
  const updateProduct = useUpdateProduct();
  const breadcrumbs = useBreadcrumbs({ product });

  const handleSubmit = (updateData: any) => {
    if (product) {
      updateProduct.mutate(
        {
          id: product.id,
          productData: updateData,
        },
        {
          onSuccess: () => {
            toast.success(`${product.title} updated successfully!`);
          },
          onError: () => {
            toast.error('Failed to update product. Please try again.');
          },
        }
      );
    }
  };

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
          <Link to="/" className="btn-primary">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Product
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Link to={`/products/${id}`} className="btn-secondary text-center">
              View Product
            </Link>
            <Link to="/" className="btn-secondary text-center">
              Back to Products
            </Link>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <ProductForm
            initialProduct={product}
            mode="edit"
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
            isSubmitting={updateProduct.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
