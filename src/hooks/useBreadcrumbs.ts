import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { BreadcrumbItem } from '@/components/ui/Breadcrumbs';
import { Product } from '@/types';

interface UseBreadcrumbsOptions {
  product?: Product;
  customItems?: BreadcrumbItem[];
}

export const useBreadcrumbs = ({
  product,
  customItems,
}: UseBreadcrumbsOptions = {}) => {
  const location = useLocation();

  const breadcrumbs = useMemo((): BreadcrumbItem[] => {
    // If custom items are provided, use them
    if (customItems) {
      return customItems;
    }

    const items: BreadcrumbItem[] = [
      {
        label: 'Platzi Fake Store',
        href: '/',
      },
    ];

    const path = location.pathname;

    // Products list page
    if (path === '/') {
      items[0].current = true;
      return items;
    }

    // Product detail or edit page
    if (path.startsWith('/products/') && product) {
      // Add category if available
      if (product.category) {
        items.push({
          label: product.category.name,
          href: `/?category=${product.category.id}`,
        });
      }

      // Add product title
      const isEditPage = path.endsWith('/edit');
      items.push({
        label: product.title,
        href: isEditPage ? `/products/${product.id}` : undefined,
        current: !isEditPage,
      });

      // Add "Edit" if on edit page
      if (isEditPage) {
        items.push({
          label: 'Edit',
          current: true,
        });
      }

      return items;
    }

    // Create product page
    if (path === '/products/new') {
      items.push({
        label: 'Create Product',
        current: true,
      });
      return items;
    }

    // Categories page
    if (path === '/categories') {
      items.push({
        label: 'Categories',
        current: true,
      });
      return items;
    }

    // Category products page
    if (path.startsWith('/categories/')) {
      items.push({
        label: 'Categories',
        href: '/categories',
      });

      // Extract category name from URL or use generic label
      const categoryId = path.split('/')[2];
      items.push({
        label: 'Category Products', // Could be enhanced with actual category name
        current: true,
      });
      return items;
    }

    // Dashboard
    if (path === '/dashboard') {
      items.push({
        label: 'Dashboard',
        current: true,
      });
      return items;
    }

    // Default: just show current page as active
    items[0].current = true;
    return items;
  }, [location.pathname, product, customItems]);

  return breadcrumbs;
};
