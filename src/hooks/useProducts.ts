import { productsService } from '@/services';
import { ProductFilters } from '@/types';
import {
  CreateProductRequest,
  UpdateProductRequest,
} from '@/types/product.types';
import { useMutation, useQuery } from '@tanstack/react-query';

const useProducts = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.getProducts(filters),
    staleTime: 10 * 1000, // 10 seconds
    enabled: true,
  });
};

const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getProduct(id),
    staleTime: 10 * 1000, // 10 seconds
  });
};

const useCreateProduct = () => {
  return useMutation({
    mutationFn: (productData: CreateProductRequest) =>
      productsService.createProduct(productData),
  });
};

const useUpdateProduct = () => {
  return useMutation({
    mutationFn: ({
      id,
      productData,
    }: {
      id: number;
      productData: UpdateProductRequest;
    }) => productsService.updateProduct(id, productData),
  });
};

const useDeleteProduct = () => {
  return useMutation({
    mutationFn: (id: number) => productsService.deleteProduct(id),
  });
};

export {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
};
