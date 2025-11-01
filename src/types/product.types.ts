import { Category } from './category.types.ts';

// Product entity from API
export interface Product {
    id: number;
    title: string;
    slug: string;
    price: number;
    description: string;
    images: string[];
    category: Category;
    creationAt: string;
    updatedAt: string;
}

// Product creation request
export interface CreateProductRequest {
    title: string;
    slug?: string; // Optional - can be auto-generated from title
    price: number;
    description: string;
    images: string[];
    categoryId: number;
}

// Product update request (partial)
export interface UpdateProductRequest extends Partial<CreateProductRequest> { }

// Product form data (for UI)
export interface ProductFormData {
    title: string;
    slug: string; // Can be auto-generated or manually edited
    price: string; // String for form input
    description: string;
    images: string[];
    categoryId: string; // String for form select
}

// Product table row (for display)
export interface ProductTableRow {
    id: number;
    title: string;
    price: number;
    category: string;
    image: string;
    creationAt: string;
}