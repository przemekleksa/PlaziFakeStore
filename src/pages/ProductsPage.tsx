import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const ProductsPage = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Platzi Fake Store
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isAuthenticated
                ? `Welcome back, ${user?.name || user?.email}!`
                : 'Discover amazing products'
              }
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/products/new"
                  className="btn-primary"
                >
                  Add Product
                </Link>
                <Link
                  to="/categories"
                  className="btn-secondary"
                >
                  Categories
                </Link>
                <Link
                  to="/dashboard"
                  className="btn-secondary"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-primary"
              >
                Login
              </Link>
            )}
          </div>
        </header>

        <main className="max-w-6xl mx-auto">
          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Placeholder product cards - will be replaced with real data */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((id) => (
              <div key={id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                <div className="h-48 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-500 dark:text-gray-400">Product Image</span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Product {id}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                    Product description goes here...
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary-600">
                      $99.99
                    </span>
                    <div className="flex space-x-2">
                      <Link
                        to={`/products/${id}`}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                      >
                        View
                      </Link>
                      {isAuthenticated && (
                        <Link
                          to={`/products/${id}/edit`}
                          className="text-gray-600 hover:text-gray-700 text-sm font-medium"
                        >
                          Edit
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Info for developers */}
          <div className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800 dark:text-blue-200 mb-2">
              Next Steps:
            </h3>
            <div className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <p>• Replace placeholder cards with real product data from API</p>
              <p>• Add search and filtering functionality</p>
              <p>• Implement pagination</p>
              <p>• Add shopping cart functionality</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;