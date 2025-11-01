import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const PublicProductsPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Platzi Fake Store
              </h1>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Home
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="btn-primary"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  to="/login"
                  className="btn-primary"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Browse Products
          </h2>
          
          {!isAuthenticated && (
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Want to manage products?
              </p>
              <Link
                to="/login"
                className="btn-primary"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>

        {/* Search and Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search products..."
                className="input-field"
              />
            </div>
            <div className="flex gap-4">
              <select className="input-field">
                <option>All Categories</option>
                <option>Electronics</option>
                <option>Clothing</option>
                <option>Books</option>
              </select>
              <select className="input-field">
                <option>Sort by</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Name A-Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Placeholder product cards */}
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="bg-gray-200 dark:bg-gray-700 h-48 rounded-lg mb-4"></div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Product {i}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                  Product description goes here...
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-primary-600">
                    $99.99
                  </span>
                  <button className="btn-primary text-sm">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              <button className="btn-secondary">Previous</button>
              <button className="btn-primary">1</button>
              <button className="btn-secondary">2</button>
              <button className="btn-secondary">3</button>
              <button className="btn-secondary">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProductsPage;