// Category entity from API
export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  creationAt: string;
  updatedAt: string;
}

// Category option for select inputs
export interface CategoryOption {
  value: number;
  label: string;
  slug?: string;
}

// Category option using slug as value (for URL-friendly filtering)
export interface CategorySlugOption {
  value: string; // slug
  label: string;
  id: number;
}