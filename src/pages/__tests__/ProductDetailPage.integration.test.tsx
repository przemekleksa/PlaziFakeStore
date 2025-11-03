import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import ProductDetailPage from '../ProductDetailPage';
import { AuthProvider } from '@/contexts/AuthContext';

// Mock the services module
vi.mock('@/services', () => ({
  productsService: {
    getProduct: vi.fn(),
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
  description: 'This is a detailed description of the test product.',
  images: [
    'https://example.com/image1.jpg',
    'https://example.com/image2.jpg',
    'https://example.com/image3.jpg',
  ],
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

const createTestWrapper = (initialRoute = '/products/1') => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialRoute]}>
        <AuthProvider>
          <Routes>
            <Route path="/products/:id" element={children} />
          </Routes>
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

describe('ProductDetailPage Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should display product details when loaded successfully', async () => {
    const mockProduct = createMockProduct({
      id: 1,
      title: 'Gaming Laptop',
      price: 1500,
      description: 'High-performance gaming laptop with RTX graphics.',
    });

    mockProductsService.getProduct.mockResolvedValue(mockProduct);

    const TestWrapper = createTestWrapper('/products/1');
    render(<ProductDetailPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
    });

    expect(screen.getByText('$1500')).toBeInTheDocument();
    expect(
      screen.getByText('High-performance gaming laptop with RTX graphics.')
    ).toBeInTheDocument();
    expect(screen.getByText('Category: Test Category')).toBeInTheDocument();
    expect(mockProductsService.getProduct).toHaveBeenCalledWith('1');
  });

  it('should show loading state while fetching product', async () => {
    let resolveProduct: (value: any) => void;
    const productPromise = new Promise<any>(resolve => {
      resolveProduct = resolve;
    });

    mockProductsService.getProduct.mockReturnValue(productPromise);

    const TestWrapper = createTestWrapper('/products/1');
    render(<ProductDetailPage />, { wrapper: TestWrapper });

    // Check for loading spinner by class
    expect(document.querySelector('.animate-spin')).toBeInTheDocument();

    resolveProduct!(createMockProduct());

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  it('should handle API errors gracefully', async () => {
    const apiError = new Error('Failed to fetch product');
    mockProductsService.getProduct.mockRejectedValue(apiError);

    const TestWrapper = createTestWrapper('/products/1');
    render(<ProductDetailPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(
        screen.getByText(/product not found or failed to load/i)
      ).toBeInTheDocument();
    });

    expect(screen.getByText('Back to Products')).toBeInTheDocument();
  });

  it('should display image gallery with thumbnail navigation', async () => {
    const mockProduct = createMockProduct({
      images: [
        'https://example.com/image1.jpg',
        'https://example.com/image2.jpg',
        'https://example.com/image3.jpg',
      ],
    });

    mockProductsService.getProduct.mockResolvedValue(mockProduct);

    const TestWrapper = createTestWrapper('/products/1');
    render(<ProductDetailPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Check main image
    const mainImage = screen.getByAltText('Test Product');
    expect(mainImage).toHaveAttribute('src', 'https://example.com/image1.jpg');

    // Check thumbnails
    const thumbnails = screen
      .getAllByRole('button')
      .filter(button => button.querySelector('img'));
    expect(thumbnails).toHaveLength(3);

    // Click second thumbnail
    fireEvent.click(thumbnails[1]);

    // Main image should change
    await waitFor(() => {
      expect(mainImage).toHaveAttribute(
        'src',
        'https://example.com/image2.jpg'
      );
    });
  });

  it('should display navigation links', async () => {
    const mockProduct = createMockProduct({ id: 1 });
    mockProductsService.getProduct.mockResolvedValue(mockProduct);

    const TestWrapper = createTestWrapper('/products/1');
    render(<ProductDetailPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const editLink = screen.getByText('Edit Product');
    const backLink = screen.getByText('Back to Products');

    expect(editLink).toBeInTheDocument();
    expect(editLink.closest('a')).toHaveAttribute(
      'href',
      '/dashboard/products/1/edit'
    );

    expect(backLink).toBeInTheDocument();
    expect(backLink.closest('a')).toHaveAttribute(
      'href',
      '/dashboard/products'
    );
  });

  it('should display product creation date', async () => {
    const mockProduct = createMockProduct({
      creationAt: '2023-06-15T10:30:00Z',
    });

    mockProductsService.getProduct.mockResolvedValue(mockProduct);

    const TestWrapper = createTestWrapper('/products/1');
    render(<ProductDetailPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Check if creation date is displayed (format may vary based on locale)
    expect(screen.getByText(/created:/i)).toBeInTheDocument();
    expect(
      screen.getByText(/6\/15\/2023|15\/6\/2023|2023-06-15/)
    ).toBeInTheDocument();
  });

  it('should return null when no product ID is provided', () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    const TestWrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/products/']}>
          <AuthProvider>
            <Routes>
              <Route path="/products/" element={children} />
            </Routes>
          </AuthProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const { container } = render(<ProductDetailPage />, {
      wrapper: TestWrapper,
    });

    expect(container.firstChild).toBeNull();
  });

  it('should handle product with single image', async () => {
    const mockProduct = createMockProduct({
      images: ['https://example.com/single-image.jpg'],
    });

    mockProductsService.getProduct.mockResolvedValue(mockProduct);

    const TestWrapper = createTestWrapper('/products/1');
    render(<ProductDetailPage />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const mainImage = screen.getByAltText('Test Product');
    expect(mainImage).toHaveAttribute(
      'src',
      'https://example.com/single-image.jpg'
    );

    // Should have only one thumbnail
    const thumbnails = screen
      .getAllByRole('button')
      .filter(button => button.querySelector('img'));
    expect(thumbnails).toHaveLength(1);
  });
});
