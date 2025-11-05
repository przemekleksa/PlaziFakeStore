export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error: string;
}
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
export interface ProductFilters extends PaginationParams {
  title?: string;
  price?: number;
  price_min?: number;
  price_max?: number;
  categoryId?: number;
  categorySlug?: string;
}
export type SortOrder = 'asc' | 'desc';
export type ProductSortField = 'title' | 'price' | 'creationAt' | 'updatedAt';

export interface SortOptions {
  field: ProductSortField;
  order: SortOrder;
}
