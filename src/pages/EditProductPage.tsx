import { Link, useParams } from 'react-router-dom';

const EditProductPage = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="lg:flex items-center justify-between mb-6 grid gap-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Edit Product
          </h1>
          <div className="space-x-3 lg:flex ">
            <Link to={`/dashboard/products/${id}`} className="btn-secondary">
              View Product
            </Link>
            <Link to="/dashboard/products" className="btn-secondary">
              Back to Products
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400">
            Product edit form for ID: {id} will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EditProductPage;
