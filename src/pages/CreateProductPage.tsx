import { Link } from 'react-router-dom';

const CreateProductPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create New Product
          </h1>
          <Link
            to="/dashboard/products"
            className="btn-secondary"
          >
            Back to Products
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400">
            Product creation form will be implemented here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateProductPage;