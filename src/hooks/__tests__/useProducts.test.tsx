import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import {
  useProducts,
  useProduct,
  useDeleteProduct,
  useCreateProduct,
  useUpdateProduct,
} from '../useProducts';
import { productsService } from '@/services';

vi.mock('@/services', () => ({
  productsService: {
    getProducts: vi.fn(),
    getProduct: vi.fn(),
    createProduct: vi.fn(),
    updateProduct: vi.fn(),
    deleteProduct: vi.fn(),
  },
}));

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

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Basic functionality', () => {
    it('should fetch products without filters', async () => {
      const mockProducts = [
        {
          id: 1,
          title: 'Product 1',
          slug: 'product-1',
          price: 100,
          description: 'Test product 1',
          images: ['image1.jpg'],
          category: {
            id: 1,
            name: 'Category 1',
            slug: 'category-1',
            image: 'cat1.jpg',
            creationAt: '2023-01-01',
            updatedAt: '2023-01-01',
          },
          creationAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
        {
          id: 2,
          title: 'Product 2',
          slug: 'product-2',
          price: 200,
          description: 'Test product 2',
          images: ['image2.jpg'],
          category: {
            id: 1,
            name: 'Category 1',
            slug: 'category-1',
            image: 'cat1.jpg',
            creationAt: '2023-01-01',
            updatedAt: '2023-01-01',
          },
          creationAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
      ];

      mockProductsService.getProducts.mockResolvedValue(mockProducts);

      const { result } = renderHook(() => useProducts({}), {
        wrapper: createWrapper(),
      });

      expect(result.current.isLoading).toBe(true);

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(mockProductsService.getProducts).toHaveBeenCalledWith({});
    });

    it('should fetch products with title filter', async () => {
      const mockProducts = [
        createMockProduct({ id: 1, title: 'Laptop', price: 1000 }),
      ];

      mockProductsService.getProducts.mockResolvedValue(mockProducts);

      const filters = { title: 'laptop' };
      const { result } = renderHook(() => useProducts(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(mockProductsService.getProducts).toHaveBeenCalledWith(filters);
    });

    it('should fetch products with price range filters', async () => {
      const mockProducts = [
        createMockProduct({ id: 1, title: 'Mid-range Product', price: 150 }),
      ];

      mockProductsService.getProducts.mockResolvedValue(mockProducts);

      const filters = { price_min: 100, price_max: 200 };
      const { result } = renderHook(() => useProducts(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(mockProductsService.getProducts).toHaveBeenCalledWith(filters);
    });

    it('should fetch products with category filter', async () => {
      const mockProducts = [
        createMockProduct({ id: 1, title: 'Electronics Product', price: 500 }),
      ];

      mockProductsService.getProducts.mockResolvedValue(mockProducts);

      const filters = { categoryId: 2 };
      const { result } = renderHook(() => useProducts(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(mockProductsService.getProducts).toHaveBeenCalledWith(filters);
    });

    it('should fetch products with pagination', async () => {
      const mockProducts = [
        createMockProduct({ id: 13, title: 'Product 13', price: 100 }),
        createMockProduct({ id: 14, title: 'Product 14', price: 200 }),
      ];

      mockProductsService.getProducts.mockResolvedValue(mockProducts);

      const filters = { limit: 12, offset: 12 };
      const { result } = renderHook(() => useProducts(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(mockProductsService.getProducts).toHaveBeenCalledWith(filters);
    });

    it('should handle pagination with multiple pages', async () => {
      const mockProducts = Array.from({ length: 12 }, (_, i) =>
        createMockProduct({
          id: i + 13,
          title: `Product ${i + 13}`,
          price: (i + 1) * 50,
        })
      );

      mockProductsService.getProducts.mockResolvedValue(mockProducts);

      const filters = { limit: 12, offset: 12 };
      const { result } = renderHook(() => useProducts(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(12);
      expect(result.current.data?.[0].id).toBe(13);
      expect(result.current.data?.[11].id).toBe(24);
      expect(mockProductsService.getProducts).toHaveBeenCalledWith(filters);
    });

    it('should handle first page with full page size', async () => {
      const mockProducts = Array.from({ length: 12 }, (_, i) =>
        createMockProduct({
          id: i + 1,
          title: `Product ${i + 1}`,
          price: (i + 1) * 100,
        })
      );

      mockProductsService.getProducts.mockResolvedValue(mockProducts);

      const filters = { limit: 12, offset: 0 };
      const { result } = renderHook(() => useProducts(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toHaveLength(12);
      expect(result.current.data?.[0].id).toBe(1);
      expect(result.current.data?.[11].id).toBe(12);
      expect(mockProductsService.getProducts).toHaveBeenCalledWith(filters);
    });

    it('should fetch products with multiple filters combined', async () => {
      const mockProducts = [
        createMockProduct({ id: 1, title: 'Gaming Laptop', price: 1500 }),
      ];

      mockProductsService.getProducts.mockResolvedValue(mockProducts);

      const filters = {
        title: 'laptop',
        price_min: 1000,
        price_max: 2000,
        categoryId: 2,
        limit: 10,
        offset: 0,
      };

      const { result } = renderHook(() => useProducts(filters), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.data).toEqual(mockProducts);
      expect(mockProductsService.getProducts).toHaveBeenCalledWith(filters);
    });
  });

  describe('Caching behavior', () => {
    it('should use different cache keys for different filters', async () => {
      const mockProducts1 = [
        createMockProduct({ id: 1, title: 'Product 1', price: 100 }),
      ];
      const mockProducts2 = [
        createMockProduct({ id: 2, title: 'Product 2', price: 200 }),
      ];

      mockProductsService.getProducts
        .mockResolvedValueOnce(mockProducts1)
        .mockResolvedValueOnce(mockProducts2);

      const wrapper = createWrapper();

      const { result: result1 } = renderHook(
        () => useProducts({ title: 'product1' }),
        { wrapper }
      );
      const { result: result2 } = renderHook(
        () => useProducts({ title: 'product2' }),
        { wrapper }
      );

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(result1.current.data).toEqual(mockProducts1);
      expect(result2.current.data).toEqual(mockProducts2);
      expect(mockProductsService.getProducts).toHaveBeenCalledTimes(2);
    });

    it('should cache results and not refetch immediately', async () => {
      const mockProducts = [
        createMockProduct({ id: 1, title: 'Product 1', price: 100 }),
      ];

      mockProductsService.getProducts.mockResolvedValue(mockProducts);

      const wrapper = createWrapper();
      const filters = { title: 'product' };

      const { result: result1 } = renderHook(() => useProducts(filters), {
        wrapper,
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
      });

      const { result: result2 } = renderHook(() => useProducts(filters), {
        wrapper,
      });

      expect(result2.current.data).toEqual(mockProducts);
      expect(result2.current.isLoading).toBe(false);
      expect(mockProductsService.getProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error handling', () => {
    it('should handle API errors gracefully', async () => {
      const mockError = new Error('API Error');
      mockProductsService.getProducts.mockRejectedValue(mockError);

      const { result } = renderHook(() => useProducts({}), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(mockError);
      expect(result.current.data).toBeUndefined();
    });

    it('should handle network failures', async () => {
      const networkError = new Error('Network Error');
      mockProductsService.getProducts.mockRejectedValue(networkError);

      const { result } = renderHook(() => useProducts({ title: 'test' }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isError).toBe(true);
      });

      expect(result.current.error).toEqual(networkError);
      expect(mockProductsService.getProducts).toHaveBeenCalledWith({
        title: 'test',
      });
    });
  });
});

describe('useProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch single product by ID', async () => {
    const mockProduct = createMockProduct({
      id: 1,
      title: 'Single Product',
      price: 100,
    });

    mockProductsService.getProduct.mockResolvedValue(mockProduct);

    const { result } = renderHook(() => useProduct('1'), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockProduct);
    expect(mockProductsService.getProduct).toHaveBeenCalledWith('1');
  });

  it('should handle product not found', async () => {
    const notFoundError = new Error('Product not found');
    mockProductsService.getProduct.mockRejectedValue(notFoundError);

    const { result } = renderHook(() => useProduct('999'), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(notFoundError);
    expect(mockProductsService.getProduct).toHaveBeenCalledWith('999');
  });

  it('should cache single product', async () => {
    const mockProduct = createMockProduct({
      id: 1,
      title: 'Cached Product',
      price: 100,
    });

    mockProductsService.getProduct.mockResolvedValue(mockProduct);

    const wrapper = createWrapper();

    const { result: result1 } = renderHook(() => useProduct('1'), { wrapper });

    await waitFor(() => {
      expect(result1.current.isSuccess).toBe(true);
    });

    const { result: result2 } = renderHook(() => useProduct('1'), { wrapper });

    expect(result2.current.data).toEqual(mockProduct);
    expect(result2.current.isLoading).toBe(false);
    expect(mockProductsService.getProduct).toHaveBeenCalledTimes(1);
  });
});

describe('useDeleteProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete product successfully', async () => {
    mockProductsService.deleteProduct.mockResolvedValue(true);

    const { result } = renderHook(() => useDeleteProduct(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isIdle).toBe(true);

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBe(true);
    expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(1);
  });

  it('should handle delete errors', async () => {
    const deleteError = new Error('Delete failed');
    mockProductsService.deleteProduct.mockRejectedValue(deleteError);

    const { result } = renderHook(() => useDeleteProduct(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(1);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(deleteError);
    expect(mockProductsService.deleteProduct).toHaveBeenCalledWith(1);
  });
});

describe('useCreateProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create product successfully', async () => {
    const newProduct = {
      title: 'New Product',
      price: 100,
      description: 'Test',
      categoryId: 1,
      images: [],
    };
    const createdProduct = createMockProduct({ id: 1, ...newProduct });

    mockProductsService.createProduct.mockResolvedValue(createdProduct);

    const { result } = renderHook(() => useCreateProduct(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(newProduct);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(createdProduct);
    expect(mockProductsService.createProduct).toHaveBeenCalledWith(newProduct);
  });

  it('should handle validation errors', async () => {
    const validationError = new Error('Validation failed');
    const invalidProduct = {
      title: '',
      price: -1,
      description: '',
      categoryId: 0,
      images: [],
    };

    mockProductsService.createProduct.mockRejectedValue(validationError);

    const { result } = renderHook(() => useCreateProduct(), {
      wrapper: createWrapper(),
    });

    result.current.mutate(invalidProduct);

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(validationError);
    expect(mockProductsService.createProduct).toHaveBeenCalledWith(
      invalidProduct
    );
  });
});

describe('useUpdateProduct', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update product successfully', async () => {
    const updateData = { title: 'Updated Product', price: 150 };
    const updatedProduct = createMockProduct({ id: 1, ...updateData });

    mockProductsService.updateProduct.mockResolvedValue(updatedProduct);

    const { result } = renderHook(() => useUpdateProduct(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: 1, productData: updateData });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(updatedProduct);
    expect(mockProductsService.updateProduct).toHaveBeenCalledWith(
      1,
      updateData
    );
  });

  it('should handle partial updates', async () => {
    const partialUpdate = { price: 200 };
    const updatedProduct = createMockProduct({
      id: 1,
      title: 'Existing Product',
      price: 200,
    });

    mockProductsService.updateProduct.mockResolvedValue(updatedProduct);

    const { result } = renderHook(() => useUpdateProduct(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: 1, productData: partialUpdate });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(updatedProduct);
    expect(mockProductsService.updateProduct).toHaveBeenCalledWith(
      1,
      partialUpdate
    );
  });

  it('should handle invalid price updates', async () => {
    const invalidUpdate = { price: -100 };
    const validationError = new Error('Price must be positive');

    mockProductsService.updateProduct.mockRejectedValue(validationError);

    const { result } = renderHook(() => useUpdateProduct(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ id: 1, productData: invalidUpdate });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toEqual(validationError);
    expect(mockProductsService.updateProduct).toHaveBeenCalledWith(
      1,
      invalidUpdate
    );
  });
});
