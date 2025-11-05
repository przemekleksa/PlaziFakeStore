import { useAuth } from '@/contexts/AuthContext';
import PageHeader from '@/components/layout/PageHeader';

const DashboardPage = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={logout}
        />

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {/* Welcome Message */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 mb-6">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome back, {user?.name || 'User'}! 👋
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              You're successfully logged in to your Platzi Store dashboard. Use
              the navigation above to manage your products and categories.
            </p>
          </div>

          {/* User Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Your Account Information
            </h3>

            {/* Large User Avatar */}
            <div className="flex flex-col items-center mb-6">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name || user.email}
                  className="w-32 h-32 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600 shadow-lg"
                  loading="lazy"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center shadow-lg">
                  <span className="text-4xl text-gray-500 dark:text-gray-400">
                    👤
                  </span>
                </div>
              )}
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
                {user?.name || 'User'}
              </h4>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Name:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {user?.name || 'Not provided'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Email:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {user?.email || 'Not provided'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  Role:
                </span>
                <span className="text-gray-900 dark:text-white">
                  {user?.role || 'User'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 dark:text-gray-400 font-medium">
                  User ID:
                </span>
                <span className="text-gray-900 dark:text-white font-mono text-sm">
                  {user?.id || 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
