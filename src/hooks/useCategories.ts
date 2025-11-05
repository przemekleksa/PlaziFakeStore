import { categoriesService } from '@/services';
import { useQuery } from '@tanstack/react-query';

const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getCategories(),
    staleTime: 60 * 1000,
  });
};

const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesService.getCategory(id),
  });
};

export { useCategories, useCategory };
