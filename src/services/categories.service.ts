import { api } from './api';
import { Category, CategoryOption } from '@/types';

export const categoriesService = {
  getCategories: async (): Promise<Category[]> => {
    return api.get<Category[]>('/categories');
  },

  getCategory: async (id: number): Promise<Category> => {
    return api.get<Category>(`/categories/${id}`);
  },

  getCategoryOptions: async (): Promise<CategoryOption[]> => {
    const categories = await categoriesService.getCategories();
    return categories.map(category => ({
      value: category.id,
      label: category.name,
    }));
  },

  createCategory: async (
    categoryData: Omit<Category, 'id' | 'creationAt' | 'updatedAt'>
  ): Promise<Category> => {
    return api.post<Category>('/categories', categoryData);
  },

  updateCategory: async (
    id: number,
    categoryData: Partial<Category>
  ): Promise<Category> => {
    return api.put<Category>(`/categories/${id}`, categoryData);
  },

  deleteCategory: async (id: number): Promise<boolean> => {
    await api.delete(`/categories/${id}`);
    return true;
  },
};

export default categoriesService;
