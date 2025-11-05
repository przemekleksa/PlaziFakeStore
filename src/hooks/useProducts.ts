import { productsService } from '@/services';
import { ProductFilters } from '@/types';
import {
  CreateProductRequest,
  UpdateProductRequest,
} from '@/types/product.types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const useProducts = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productsService.getProducts(filters),
    staleTime: 10 * 1000, // 10 seconds
    enabled: true,
  });
};

const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getProduct(id),
    staleTime: 10 * 1000, // 10 seconds
  });
};

const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: CreateProductRequest) =>
      productsService.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: error => {
      console.error('Failed to create product:', error);
    },
  });
};

const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      productData,
    }: {
      id: number;
      productData: UpdateProductRequest;
    }) => productsService.updateProduct(id, productData),
    onSuccess: updatedProduct => {
      queryClient.invalidateQueries({
        queryKey: ['product', updatedProduct.id.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: error => {
      console.error('Failed to update product:', error);
    },
  });
};

const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => productsService.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: ['product', deletedId.toString()],
      });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: error => {
      console.error('Failed to delete product:', error);
    },
  });
};

export {
  useProducts,
  useProduct,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
};
