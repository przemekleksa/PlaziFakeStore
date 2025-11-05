import { useCreateProduct } from '@/hooks/useProducts';
import { Link, useNavigate } from 'react-router-dom';
import ProductForm from '@/components/forms/ProductForm';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import { useBreadcrumbs } from '@/hooks/useBreadcrumbs';
import { toast } from 'react-toastify';

const CreateProductPage = () => {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();
  const breadcrumbs = useBreadcrumbs();

  const handleSubmit = (productData: any) => {
    console.log('Creating product:', productData);

    createProduct.mutate(productData, {
      onSuccess: newProduct => {
        console.log('Product created successfully:', newProduct);
        toast.success(`${newProduct.title} created successfully!`);
        navigate(`/products/${newProduct.id}`);
      },
      onError: error => {
        console.error('Failed to create product:', error);
        toast.error('Failed to create product. Please try again.');
      },
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Breadcrumbs items={breadcrumbs} />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Product
          </h1>
          <Link to="/" className="btn-secondary text-center">
            Back to Products
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <ProductForm
            mode="create"
            onSubmit={handleSubmit}
            submitLabel="Create Product"
            isSubmitting={createProduct.isPending}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;
