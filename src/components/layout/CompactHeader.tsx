import { useState } from 'react';
import { Link } from 'react-router-dom';

interface CompactHeaderProps {
  isAuthenticated: boolean;
  onLogout: () => void;
  user: any;
}

const CompactHeader = ({
  isAuthenticated,
  onLogout,
  user,
}: CompactHeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex items-center justify-between">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/assets/images/platziStoreLogo.png"
          alt="Platzi Store"
          className="w-9 h-9 object-contain hover:scale-105 transition-transform duration-200"
        />
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          Platzi Fake Store
        </span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden lg:flex items-center space-x-3">
        {isAuthenticated && (
          <Link
            to="/products/new"
            className="px-3 py-2.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 h-9 flex items-center"
          >
            Add Product
          </Link>
        )}

        <Link
          to="/"
          className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 h-9 flex items-center"
        >
          All Products
        </Link>

        {isAuthenticated ? (
          <>
            <button
              onClick={onLogout}
              className="px-3 py-2.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 h-9 flex items-center"
            >
              Logout
            </button>
            {user?.avatar && (
              <Link to="/dashboard">
                <img
                  src={user.avatar}
                  alt="User avatar"
                  className="w-9 h-9 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600 hover:border-primary-500 transition-colors cursor-pointer"
                />
              </Link>
            )}
          </>
        ) : (
          <Link
            to="/login"
            className="px-3 py-2.5 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 h-9 flex items-center"
          >
            Login
          </Link>
        )}
      </div>

      {/* Mobile Hamburger Menu */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2.5 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 h-9 flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 text-gray-600 dark:text-gray-300"
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

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute right-3.5 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 z-50">
            123
            <div className="space-y-3">
              {isAuthenticated && (
                <Link
                  to="/products/new"
                  className="block w-full text-left px-3 py-2 text-sm bg-primary-600 text-white hover:bg-primary-700 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Add Product1
                </Link>
              )}

              <Link
                to="/"
                className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                onClick={() => setMobileMenuOpen(false)}
              >
                All Products
              </Link>

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-left px-3 py-2 text-sm bg-primary-600 text-white hover:bg-primary-700 rounded"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompactHeader;
