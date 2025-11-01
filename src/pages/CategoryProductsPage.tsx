import React from 'react';
import { Link, useParams } from 'react-router-dom';

const CategoryProductsPage = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Category: {slug}
          </h1>
          <div className="space-x-3">
            <Link
              to="/categories"
              className="btn-secondary"
            >
              All Categories
            </Link>
            <Link
              to="/dashboard/products"
              className="btn-secondary"
            >
              All Products
            </Link>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400">
            Products in category "{slug}" will be displayed here.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductsPage;