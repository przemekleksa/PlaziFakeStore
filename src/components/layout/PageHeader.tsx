import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '@/types';

interface PageHeaderProps {
  isAuthenticated: boolean;
  user: User | null;
  onLogout: () => void;
}

const PageHeader = ({ isAuthenticated, user, onLogout }: PageHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isProductsPage = location.pathname === '/';
  const isCategoriesPage = location.pathname === '/categories';
  const isDashboardPage = location.pathname === '/dashboard';

  return (
    <>
      <header className="flex justify-between items-center mb-4 sm:mb-8">
        <div className="flex flex-col">
          {/* Logo and Brand Name - Clickable Link to Home */}
          <Link to="/" className="flex items-center mb-1 group">
            <img
              src="/assets/images/platziStoreLogo.png"
              alt="Platzi Store Logo"
              className="w-12 h-12 sm:w-16 sm:h-16 mr-4 object-contain group-hover:scale-105 transition-transform duration-200"
            />
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
              Platzi Fake Store
            </h1>
          </Link>
          {/* User Welcome Message */}
          {isAuthenticated && (
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base ml-16 sm:ml-20">
              {isDashboardPage
                ? `Your personal dashboard, ${user?.name || user?.email}!`
                : isCategoriesPage
                  ? `Browse categories, ${user?.name || user?.email}!`
                  : `Welcome back, ${user?.name || user?.email}!`}
            </p>
          )}
          {!isAuthenticated && (
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base ml-16 sm:ml-20">
              {isCategoriesPage
                ? 'Browse products by category'
                : 'Discover amazing products'}
            </p>
          )}
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-4 self-start mt-2">
          {isAuthenticated && (
            <Link to="/products/new" className="btn-primary">
              Add Product
            </Link>
          )}

          {/* Toggle between Products/Categories */}
          {isProductsPage ? (
            <Link to="/categories" className="btn-secondary">
              Categories
            </Link>
          ) : (
            <Link to="/" className="btn-secondary">
              All Products
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <button onClick={onLogout} className="btn-secondary">
                Logout
              </button>
              {/* User Avatar - clickable link to dashboard */}
              {user?.avatar && (
                <Link to="/dashboard" className="flex-shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name || user.email}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
                  />
                </Link>
              )}
            </>
          ) : (
            <Link to="/login" className="btn-primary">
              Login
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="lg:hidden shadow-md self-start mt-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
          >
            <svg
              className="w-6 h-6 text-gray-600 dark:text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-4">
          <div className="space-y-3">
            {isAuthenticated && (
              <Link
                to="/products/new"
                className="block w-full text-center btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Add Product
              </Link>
            )}

            {/* Toggle between Products/Categories */}
            {isProductsPage ? (
              <Link
                to="/categories"
                className="block w-full text-center btn-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
            ) : (
              <Link
                to="/"
                className="block w-full text-center btn-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>
            )}

            {isAuthenticated ? (
              <>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-center btn-secondary"
                >
                  Logout
                </button>

                {/* User info in mobile - clickable link to dashboard */}
                {user && (
                  <Link
                    to="/dashboard"
                    className="flex items-center justify-center space-x-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {user.avatar && (
                      <img
                        src={user.avatar}
                        alt={user.name || user.email}
                        className="w-8 h-8 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600"
                      />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {user.name || user.email}
                    </span>
                  </Link>
                )}
              </>
            ) : (
              <Link
                to="/login"
                className="block w-full text-center btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default PageHeader;
