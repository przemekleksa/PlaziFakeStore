import { useState, useCallback, useMemo, useEffect } from 'react';
import { useDeleteProduct, useProducts } from '@/hooks/useProducts';
import useDebounce from '@/hooks/useDebounce';
import { useUrlParams } from '@/hooks/useUrlParams';
import { toast } from 'react-toastify';

export interface ProductsPageParams {
  sortBy: string;
  category: string;
  priceMin: string;
  priceMax: string;
  title: string;
  limit: number;
  offset: number;
}

export const useProductsLogic = () => {
  const {
    params: urlParams,
    updateParams,
    isInitialized,
    clearSessionStorage,
  } = useUrlParams<ProductsPageParams>({
    defaultValues: {
      sortBy: '',
      category: '',
      priceMin: '',
      priceMax: '',
      title: '',
      limit: 12,
      offset: 0,
    },
    sessionStorageKey: 'productFilters',
  });

  const debouncedSearch = useDebounce(urlParams.title, 300, 3);
  const debouncedPriceMin = useDebounce(urlParams.priceMin, 500, 0);
  const debouncedPriceMax = useDebounce(urlParams.priceMax, 500, 0);

  const useSorting = urlParams.sortBy !== '';

  const filters = useMemo(
    () => ({
      title: debouncedSearch,
      price_min:
        debouncedPriceMin || debouncedPriceMax
          ? debouncedPriceMin
            ? Number(debouncedPriceMin)
            : 1
          : undefined,
      price_max:
        debouncedPriceMin || debouncedPriceMax
          ? debouncedPriceMax
            ? Number(debouncedPriceMax)
            : 999999
          : undefined,
      categoryId: urlParams.category ? Number(urlParams.category) : undefined,

      ...(useSorting
        ? {}
        : {
            limit: urlParams.limit,
            offset: urlParams.offset,
          }),
    }),
    [
      debouncedSearch,
      debouncedPriceMax,
      debouncedPriceMin,
      urlParams.category,
      urlParams.limit,
      urlParams.offset,
      useSorting,
    ]
  );

  const { data: products, isLoading, error } = useProducts(filters);
  const { data: allProducts } = useProducts({
    ...filters,
    limit: 0,
  });

  const totalProducts = useSorting
    ? products?.length || 0
    : allProducts?.length || 0;

  const totalPages =
    totalProducts > 0 ? Math.ceil(totalProducts / urlParams.limit) : 0;

  const currentPage =
    totalProducts > 0 ? Math.floor(urlParams.offset / urlParams.limit) + 1 : 0;

  const [previousSortBy, setPreviousSortBy] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized) {
      if (previousSortBy === null) {
        // First initialization - just store the current sortBy without resetting offset
        setPreviousSortBy(urlParams.sortBy);
      } else if (urlParams.sortBy !== previousSortBy) {
        // Actual sort change - reset offset
        updateParams({ offset: 0 });
        setPreviousSortBy(urlParams.sortBy);
      }
    }
  }, [urlParams.sortBy, isInitialized, previousSortBy, updateParams]);

  const sortedProducts = useMemo(() => {
    if (!products) return undefined;

    const productsCopy = [...products];

    if (!useSorting) {
      return productsCopy;
    }
    let sorted;
    switch (urlParams.sortBy) {
      case 'price-high':
        sorted = productsCopy.sort((a, b) => b.price - a.price);
        break;
      case 'price-low':
        sorted = productsCopy.sort((a, b) => a.price - b.price);
        break;
      case 'name-az':
        sorted = productsCopy.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-za':
        sorted = productsCopy.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'newest':
        sorted = productsCopy.sort((a, b) => {
          const dateA = new Date(a.creationAt);
          const dateB = new Date(b.creationAt);
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case 'oldest':
        sorted = productsCopy.sort((a, b) => {
          const dateA = new Date(a.creationAt);
          const dateB = new Date(b.creationAt);
          return dateA.getTime() - dateB.getTime();
        });
        break;
      default:
        sorted = productsCopy;
    }

    const start = urlParams.offset;
    const end = start + urlParams.limit;
    return sorted.slice(start, end);
  }, [
    products,
    urlParams.sortBy,
    useSorting,
    urlParams.offset,
    urlParams.limit,
  ]);

  const remove = useDeleteProduct();
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    productId: number | null;
    productTitle: string;
  }>({
    isOpen: false,
    productId: null,
    productTitle: '',
  });

  const showDeleteModal = useCallback((id: number, title: string) => {
    setDeleteModalState({
      isOpen: true,
      productId: id,
      productTitle: title,
    });
  }, []);

  const hideDeleteModal = useCallback(() => {
    setDeleteModalState({
      isOpen: false,
      productId: null,
      productTitle: '',
    });
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteModalState.productId) {
      remove.mutate(deleteModalState.productId, {
        onSuccess: () => {
          toast.success(
            `${deleteModalState.productTitle} deleted successfully!`
          );
          hideDeleteModal();
        },
        onError: () => {
          toast.error('Failed to delete product. Please try again.');
          hideDeleteModal();
        },
      });
    }
  }, [
    remove,
    deleteModalState.productId,
    deleteModalState.productTitle,
    hideDeleteModal,
  ]);

  const handleSearchChange = useCallback(
    (value: string) => {
      updateParams({
        title: value,
        offset: 0, // Reset pagination when searching
      });
    },
    [updateParams]
  );

  const clearSearch = useCallback(() => {
    updateParams({
      title: '',
      offset: 0,
    });
  }, [updateParams]);

  const clearAllFilters = useCallback(() => {
    clearSessionStorage();
    updateParams({
      sortBy: '',
      category: '',
      priceMin: '',
      priceMax: '',
      title: '',
      offset: 0,
    });
  }, [updateParams, clearSessionStorage]);

  const handlePageChange = useCallback(
    (page: number) => {
      updateParams({
        offset: (page - 1) * urlParams.limit,
      });
    },
    [updateParams, urlParams.limit]
  );

  const handleFiltersChange = useCallback(
    (newFilters: Partial<ProductsPageParams>) => {
      updateParams({
        ...newFilters,
        offset: 0, // Reset pagination when filtering
      });
    },
    [updateParams]
  );

  return {
    urlParams,
    sortedProducts,
    totalProducts,
    totalPages,
    currentPage,
    isLoading,
    error,
    debouncedSearch,
    deleteModalState,
    showDeleteModal,
    hideDeleteModal,
    handleConfirmDelete,
    handleSearchChange,
    clearSearch,
    clearAllFilters,

    handlePageChange,
    handleFiltersChange,
  };
};
