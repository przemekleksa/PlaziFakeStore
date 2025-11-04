import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/layout/AuthGuard';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const ProductsPage = React.lazy(() => import('@/pages/ProductsPage'));
const CreateProductPage = React.lazy(() => import('@/pages/CreateProductPage'));
const ProductDetailPage = React.lazy(() => import('@/pages/ProductDetailPage'));
const EditProductPage = React.lazy(() => import('@/pages/EditProductPage'));
const CategoriesPage = React.lazy(() => import('@/pages/CategoriesPage'));
const CategoryProductsPage = React.lazy(
  () => import('@/pages/CategoryProductsPage')
);
const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000, // 10 seconds cache
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
});

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    <span className="ml-3 text-gray-600 dark:text-gray-400">Loading...</span>
  </div>
);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public routes */}
                <Route path="/login" element={<LoginPage />} />

                {/* Main routes - work for both public and authenticated users */}
                <Route path="/" element={<ProductsPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                {/* Protected routes - require authentication */}
                <Route
                  path="/dashboard"
                  element={
                    <AuthGuard>
                      <DashboardPage />
                    </AuthGuard>
                  }
                />

                <Route
                  path="/products/new"
                  element={
                    <AuthGuard>
                      <CreateProductPage />
                    </AuthGuard>
                  }
                />

                <Route
                  path="/products/:id/edit"
                  element={
                    <AuthGuard>
                      <EditProductPage />
                    </AuthGuard>
                  }
                />

                <Route path="/categories" element={<CategoriesPage />} />

                <Route
                  path="/categories/:slug"
                  element={
                    <AuthGuard>
                      <CategoryProductsPage />
                    </AuthGuard>
                  }
                />

                {/* 404 route */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </AuthProvider>

      <ReactQueryDevtools initialIsOpen={false} />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </QueryClientProvider>
  );
}

export default App;
