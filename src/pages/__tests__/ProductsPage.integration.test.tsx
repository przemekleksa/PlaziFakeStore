import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ProductsPage from '../ProductsPage';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock the services module
vi.mock('@/services', () => ({
  productsService: {
    getProducts: vi.fn(),
    deleteProduct: vi.fn(),
  },
  authService: {
    login: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn().mockResolvedValue({}),
  },
  categoriesService: {
    getCategories: vi.fn().mockResolvedValue([]),
  },
  getStoredToken: vi.fn().mockReturnValue('mock-token'),
  removeStoredToken: vi.fn(),
}));

// Import mocked services
import { productsService } from '@/services';

const mockProductsService = vi.mocked(productsService);

const createMockProduct = (overrides: Partial<any> = {}) => ({
  id: 1,
  title: 'Test Product',
  slug: 'test-product',
  price: 100,
  description: 'Test description',
  images: ['test-image.jpg'],
  category: {
    id: 1,
    name: 'Test Category',
    slug: 'test-category',
    image: 'category.jpg',
    creationAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  creationAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
  ...overrides,
});

const createTestWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>{children}</AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('ProductsPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display products list on load', async () => {
    const mockProducts = [
      createMockProduct({ id: 1, title: 'Laptop', price: 1000 }),
      createMockProduct({ id: 2, title: 'Phone', price: 500 }),
    ];

    mockProductsService.getProducts.mockResolvedValue(mockProducts);

    const TestWrapper = createTestWrapper();
    render(<ProductsPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
    });

    expect(mockProductsService.getProducts).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 12,
        offset: 0,
      })
    );
  });

  it('should render search input', async () => {
    const mockProducts = [
      createMockProduct({ id: 1, title: 'Laptop', price: 1000 }),
      createMockProduct({ id: 2, title: 'Phone', price: 500 }),
    ];

    mockProductsService.getProducts.mockResolvedValue(mockProducts);

    const TestWrapper = createTestWrapper();
    render(<ProductsPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search products/i);
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: 'laptop' } });
    expect(searchInput).toHaveValue('laptop');
  });

  it('should render category filter', async () => {
    const mockProducts = [
      createMockProduct({ id: 1, title: 'Laptop', price: 1000 }),
    ];

    mockProductsService.getProducts.mockResolvedValue(mockProducts);

    const TestWrapper = createTestWrapper();
    render(<ProductsPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });

    const categorySelect = screen.getByDisplayValue('All Categories');
    expect(categorySelect).toBeInTheDocument();
  });

  it('should render pagination controls', async () => {
    const mockProducts = Array.from({ length: 25 }, (_, i) =>
      createMockProduct({ id: i + 1, title: `Product ${i + 1}`, price: 100 })
    );

    mockProductsService.getProducts.mockResolvedValue(mockProducts);

    const TestWrapper = createTestWrapper();
    render(<ProductsPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
    });

    // Previous button should not be visible on first page
    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText(/of \d+/)).toBeInTheDocument();
  });

  it('should show loading state', async () => {
    let resolveProducts: (value: any) => void;
    const productsPromise = new Promise<any[]>(resolve => {
      resolveProducts = resolve;
    });

    mockProductsService.getProducts.mockReturnValue(productsPromise);

    const TestWrapper = createTestWrapper();
    render(<ProductsPage />, { wrapper: TestWrapper });

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    resolveProducts!([
      createMockProduct({ id: 1, title: 'Laptop', price: 1000 }),
    ]);

    await waitFor(() => {
      expect(screen.getByText('Laptop')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    const apiError = new Error('Failed to fetch products');
    mockProductsService.getProducts.mockRejectedValue(apiError);

    const TestWrapper = createTestWrapper();
    render(<ProductsPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText(/error loading products/i)).toBeInTheDocument();
    });
  });

  it('should render price range inputs', async () => {
    const mockProducts = [
      createMockProduct({ id: 1, title: 'Gaming Laptop', price: 1500 }),
    ];

    mockProductsService.getProducts.mockResolvedValue(mockProducts);

    const TestWrapper = createTestWrapper();
    render(<ProductsPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
    });

    const priceMinInput = screen.getByPlaceholderText('Min');
    const priceMaxInput = screen.getByPlaceholderText('Max');

    expect(priceMinInput).toBeInTheDocument();
    expect(priceMaxInput).toBeInTheDocument();

    fireEvent.change(priceMinInput, { target: { value: '1000' } });
    fireEvent.change(priceMaxInput, { target: { value: '2000' } });

    expect(priceMinInput).toHaveValue(1000);
    expect(priceMaxInput).toHaveValue(2000);
  });
});
