import { api } from './api';
import { Category, CategoryOption, CategorySlugOption } from '@/types';

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
      slug: category.slug,
    }));
  },

  getCategorySlugOptions: async (): Promise<CategorySlugOption[]> => {
    const categories = await categoriesService.getCategories();
    return categories.map(category => ({
      value: category.slug,
      label: category.name,
      id: category.id,
    }));
  },

  getCategoryBySlug: async (slug: string): Promise<Category | null> => {
    const categories = await categoriesService.getCategories();
    return categories.find(category => category.slug === slug) || null;
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
