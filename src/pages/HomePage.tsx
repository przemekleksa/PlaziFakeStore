import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Platzi Fake Store
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                to="/products"
                className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              >
                Browse Products
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

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Welcome to Platzi Fake Store
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Discover amazing products from our curated collection. 
            Browse, explore, and find exactly what you're looking for.
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link
              to="/products"
              className="btn-primary text-lg px-8 py-3"
            >
              Browse Products
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="btn-secondary text-lg px-8 py-3"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Store?
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Experience the best online shopping with our amazing features
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🛍️</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Wide Selection
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Thousands of products across multiple categories
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Fast & Easy
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Quick browsing and seamless shopping experience
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Secure
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Safe and secure shopping with trusted payment methods
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Start Shopping?
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Join thousands of satisfied customers today
          </p>
          
          <div className="flex justify-center space-x-4">
            <Link
              to="/products"
              className="btn-primary text-lg px-8 py-3"
            >
              Start Browsing
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                className="btn-secondary text-lg px-8 py-3"
              >
                Create Account
              </Link>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;