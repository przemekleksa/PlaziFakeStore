export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}
export interface CategoryOption {
  value: number;
  label: string;
  slug?: string;
}
export interface CategorySlugOption {
  value: string;
  label: string;
  id: number;
}
