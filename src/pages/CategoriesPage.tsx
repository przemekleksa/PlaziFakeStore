import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import { useScrollShrink } from '../hooks/useScrollShrink';
import PageHeader from '@/components/layout/PageHeader';
import CompactHeader from '@/components/layout/CompactHeader';
import CategoriesGrid from '@/components/categories/CategoriesGrid';

const CategoriesPage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { data: categories, isError, isLoading } = useCategories();
  const isScrolled = useScrollShrink(100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Normal Header - always takes space */}
      {!isScrolled && (
        <div className="container mx-auto px-4 py-8">
          <PageHeader
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={logout}
          />
        </div>
      )}

      {/* Invisible placeholder when scrolled to maintain layout */}
      {isScrolled && (
        <div className="container mx-auto px-4 py-8 invisible">
          <PageHeader
            isAuthenticated={isAuthenticated}
            user={user}
            onLogout={logout}
          />
        </div>
      )}

      {/* Sticky Compact Header - visible when scrolled */}
      {isScrolled && (
        <div className="sticky top-0 z-50 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 transition-all duration-300">
          <div className="container mx-auto px-4 py-3">
            <div className="max-w-6xl mx-auto relative">
              <CompactHeader
                isAuthenticated={isAuthenticated}
                onLogout={logout}
                user={user}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-8">
        <main className="max-w-6xl mx-auto">
          <CategoriesGrid
            categories={categories}
            isLoading={isLoading}
            error={isError ? new Error('Failed to load categories') : null}
            emptyMessage="No categories available."
          />
        </main>
      </div>
    </div>
  );
};

export default CategoriesPage;
