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

    if (path === '/') {
      items[0].current = true;
      return items;
    }

    if (path.startsWith('/products/') && product) {
      if (product.category) {
        items.push({
          label: product.category.name,
          href: `/?category=${product.category.id}`,
        });
      }

      const isEditPage = path.endsWith('/edit');
      items.push({
        label: product.title,
        href: isEditPage ? `/products/${product.id}` : undefined,
        current: !isEditPage,
      });

      if (isEditPage) {
        items.push({
          label: 'Edit',
          current: true,
        });
      }

      return items;
    }

    if (path === '/products/new') {
      items.push({
        label: 'Create Product',
        current: true,
      });
      return items;
    }

    if (path === '/categories') {
      items.push({
        label: 'Categories',
        current: true,
      });
      return items;
    }

    if (path.startsWith('/categories/')) {
      items.push({
        label: 'Categories',
        href: '/categories',
      });

      items.push({
        label: 'Category Products', // Could be enhanced with actual category name
        current: true,
      });
      return items;
    }

    if (path === '/dashboard') {
      items.push({
        label: 'Dashboard',
        current: true,
      });
      return items;
    }

    items[0].current = true;
    return items;
  }, [location.pathname, product, customItems]);

  return breadcrumbs;
};
