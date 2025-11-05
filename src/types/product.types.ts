import { Category } from './category.types.ts';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category: Category;
  creationAt: string;
  updatedAt: string;
}
export interface CreateProductRequest {
  title: string;
  price: number;
  description: string;
  images: string[];
  categoryId: number;
}
export interface UpdateProductRequest extends Partial<CreateProductRequest> {}
export interface ProductFormData {
  title: string;
  price: string;
  description: string;
  images: string[];
  categoryId: string;
}
export interface ProductTableRow {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  creationAt: string;
}
