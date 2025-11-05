import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from '@/contexts/AuthContext';
import AuthGuard from '@/components/layout/AuthGuard';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import PageErrorBoundary from '@/components/ui/PageErrorBoundary';
import SkipToContent from '@/components/accessibility/SkipToContent';
import Skeleton from '@/components/ui/Skeleton';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const ProductsPage = React.lazy(() => import('@/pages/ProductsPage'));
const CreateProductPage = React.lazy(() => import('@/pages/CreateProductPage'));
const ProductDetailPage = React.lazy(() => import('@/pages/ProductDetailPage'));
const EditProductPage = React.lazy(() => import('@/pages/EditProductPage'));
const CategoriesPage = React.lazy(() => import('@/pages/CategoriesPage'));

const NotFoundPage = React.lazy(() => import('@/pages/NotFoundPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000, // 10 seconds cache
      retry: (failureCount, error: any) => {
        // Don't retry on 404s or 401s
        if (
          error?.response?.status === 404 ||
          error?.response?.status === 401
        ) {
          return false;
        }
        // Retry up to 2 times for other errors
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const PageLoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-8">
          <Skeleton height="h-8" width="w-48" />
          <div className="flex gap-4">
            <Skeleton height="h-10" width="w-20" />
            <Skeleton height="h-10" width="w-24" />
          </div>
        </div>

        {/* Search skeleton */}
        <div className="mb-6">
          <Skeleton height="h-12" width="w-full" />
        </div>

        {/* Filters skeleton */}
        <div className="mb-6 flex gap-4">
          <Skeleton height="h-10" width="w-32" />
          <Skeleton height="h-10" width="w-32" />
          <Skeleton height="h-10" width="w-32" />
        </div>

        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
            >
              <div className="aspect-square bg-gray-200 dark:bg-gray-700 animate-pulse" />
              <div className="p-4 space-y-3">
                <Skeleton height="h-5" width="w-3/4" />
                <Skeleton height="h-4" width="w-1/2" />
                <Skeleton height="h-6" width="w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <SkipToContent />
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <Suspense fallback={<PageLoadingSkeleton />}>
                <ErrorBoundary>
                  <Routes>
                    {/* Public routes */}
                    <Route
                      path="/login"
                      element={
                        <PageErrorBoundary pageName="login page">
                          <LoginPage />
                        </PageErrorBoundary>
                      }
                    />

                    {/* Main routes - work for both public and authenticated users */}
                    <Route
                      path="/"
                      element={
                        <PageErrorBoundary pageName="products page">
                          <ProductsPage />
                        </PageErrorBoundary>
                      }
                    />
                    <Route
                      path="/products/:id"
                      element={
                        <PageErrorBoundary pageName="product detail page">
                          <ProductDetailPage />
                        </PageErrorBoundary>
                      }
                    />

                    {/* Protected routes - require authentication */}
                    <Route
                      path="/dashboard"
                      element={
                        <PageErrorBoundary pageName="dashboard">
                          <AuthGuard>
                            <DashboardPage />
                          </AuthGuard>
                        </PageErrorBoundary>
                      }
                    />

                    <Route
                      path="/products/new"
                      element={
                        <PageErrorBoundary pageName="create product page">
                          <AuthGuard>
                            <CreateProductPage />
                          </AuthGuard>
                        </PageErrorBoundary>
                      }
                    />

                    <Route
                      path="/products/:id/edit"
                      element={
                        <PageErrorBoundary pageName="edit product page">
                          <AuthGuard>
                            <EditProductPage />
                          </AuthGuard>
                        </PageErrorBoundary>
                      }
                    />

                    <Route
                      path="/categories"
                      element={
                        <PageErrorBoundary pageName="categories page">
                          <CategoriesPage />
                        </PageErrorBoundary>
                      }
                    />

                    {/* 404 route */}
                    <Route
                      path="*"
                      element={
                        <PageErrorBoundary pageName="404 page">
                          <NotFoundPage />
                        </PageErrorBoundary>
                      }
                    />
                  </Routes>
                </ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;
