import { api } from './api';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductFilters,
} from '@/types';

export const productsService = {
  getProducts: async (filters: ProductFilters = {}): Promise<Product[]> => {
    const params = new URLSearchParams();
    if (filters.title) params.append('title', filters.title);
    if (filters.price) params.append('price', filters.price.toString());
    if (filters.price_min !== undefined)
      params.append('price_min', filters.price_min.toString());
    if (filters.price_max !== undefined)
      params.append('price_max', filters.price_max.toString());
    if (filters.categoryId)
      params.append('categoryId', filters.categoryId.toString());
    if (filters.categorySlug)
      params.append('categorySlug', filters.categorySlug);
    if (filters.limit) params.append('limit', filters.limit.toString());
    if (filters.offset !== undefined)
      params.append('offset', filters.offset.toString());

    const queryString = params.toString();
    const url = queryString ? `/products?${queryString}` : '/products';

    return api.get<Product[]>(url);
  },

  getProduct: async (id: string): Promise<Product> => {
    return api.get<Product>(`/products/${id}`);
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    const products = await productsService.getProducts({ limit: 1000 });
    return products.find(product => product.slug === slug) || null;
  },

  createProduct: async (
    productData: CreateProductRequest
  ): Promise<Product> => {
    return api.post<Product>('/products', productData);
  },

  updateProduct: async (
    id: number,
    productData: UpdateProductRequest
  ): Promise<Product> => {
    return api.put<Product>(`/products/${id}`, productData);
  },

  deleteProduct: async (id: number): Promise<boolean> => {
    await api.delete(`/products/${id}`);
    return true;
  },

  searchProducts: async (query: string, limit = 20): Promise<Product[]> => {
    return productsService.getProducts({
      title: query,
      limit,
    });
  },

  getProductsByCategory: async (
    categoryId: number,
    limit?: number
  ): Promise<Product[]> => {
    return productsService.getProducts({
      categoryId,
      limit,
    });
  },
};

export default productsService;
