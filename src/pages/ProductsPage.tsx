import React from 'react';
import { useAuth } from '@/contexts/AuthContext';

const ProductsPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Platzi Fake Store
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {user?.name || user?.email}!
            </p>
          </div>
          
          <button
            onClick={logout}
            className="btn-secondary"
          >
            Logout
          </button>
        </header>
        
        <main className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
              Authentication Working! 🎉
            </h2>
            
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>✅ Successfully logged in</p>
              <p>✅ AuthContext working</p>
              <p>✅ User data loaded</p>
            </div>
            
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">
                User Information:
              </h3>
              <div className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <p><strong>ID:</strong> {user?.id}</p>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Role:</strong> {user?.role}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProductsPage;