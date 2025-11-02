import { categoriesService } from '@/services';
import { useQuery } from '@tanstack/react-query';

const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getCategories(),
    staleTime: 20 * 60 * 1000, // 20 minutes
  });
};

const useCategory = (id: number) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoriesService.getCategory(id),
  });
};

// CRUD for categories?? TODO

export { useCategories, useCategory };
