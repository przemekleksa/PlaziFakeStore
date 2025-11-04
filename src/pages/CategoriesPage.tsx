import { useAuth } from '@/contexts/AuthContext';
import { useCategories } from '@/hooks/useCategories';
import PageHeader from '@/components/layout/PageHeader';
import CategoriesGrid from '@/components/categories/CategoriesGrid';

const CategoriesPage = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { data: categories, isError, isLoading } = useCategories();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <PageHeader
          isAuthenticated={isAuthenticated}
          user={user}
          onLogout={logout}
        />

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
