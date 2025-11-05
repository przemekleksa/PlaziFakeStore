import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { productsService } from '@/services';

export const usePrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchProduct = useCallback(
    (id: string) => {
      queryClient.prefetchQuery({
        queryKey: ['product', id],
        queryFn: () => productsService.getProduct(id),
        staleTime: 10 * 1000, // 10 seconds
      });
    },
    [queryClient]
  );

  const prefetchProducts = useCallback(
    (filters: any) => {
      queryClient.prefetchQuery({
        queryKey: ['products', filters],
        queryFn: () => productsService.getProducts(filters),
        staleTime: 10 * 1000, // 10 seconds
      });
    },
    [queryClient]
  );

  return {
    prefetchProduct,
    prefetchProducts,
  };
};

export default usePrefetch;
