import { api } from './api';
import { Category, CategoryOption, CategorySlugOption } from '@/types';

export const categoriesService = {
    // Get all categories
    getCategories: async (): Promise<Category[]> => {
        return api.get<Category[]>('/categories');
    },

    // Get single category by ID
    getCategory: async (id: number): Promise<Category> => {
        return api.get<Category>(`/categories/${id}`);
    },

    // Get categories as options for select inputs (using ID)
    getCategoryOptions: async (): Promise<CategoryOption[]> => {
        const categories = await categoriesService.getCategories();
        return categories.map((category) => ({
            value: category.id,
            label: category.name,
            slug: category.slug,
        }));
    },

    // Get categories as slug options (for URL-friendly filtering)
    getCategorySlugOptions: async (): Promise<CategorySlugOption[]> => {
        const categories = await categoriesService.getCategories();
        return categories.map((category) => ({
            value: category.slug,
            label: category.name,
            id: category.id,
        }));
    },

    // Get category by slug
    getCategoryBySlug: async (slug: string): Promise<Category | null> => {
        const categories = await categoriesService.getCategories();
        return categories.find((category) => category.slug === slug) || null;
    },

    // Create new category (if supported)
    createCategory: async (categoryData: Omit<Category, 'id' | 'creationAt' | 'updatedAt'>): Promise<Category> => {
        return api.post<Category>('/categories', categoryData);
    },

    // Update category (if supported)
    updateCategory: async (id: number, categoryData: Partial<Category>): Promise<Category> => {
        return api.put<Category>(`/categories/${id}`, categoryData);
    },

    // Delete category (if supported)
    deleteCategory: async (id: number): Promise<boolean> => {
        await api.delete(`/categories/${id}`);
        return true;
    },
};

export default categoriesService;