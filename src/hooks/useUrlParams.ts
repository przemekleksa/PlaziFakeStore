import { useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

interface UseUrlParamsOptions {
  defaultValues?: Record<string, string | number>;
  replace?: boolean;
}

export function useUrlParams<T extends Record<string, any>>(
  options: UseUrlParamsOptions = {}
) {
  const { defaultValues = {}, replace = true } = options;
  const [urlParams, setUrlParams] = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);

  // Parse URL params to typed object
  const parseParams = useCallback((): T => {
    const params = {} as T;

    for (const [key, defaultValue] of Object.entries(defaultValues)) {
      const urlValue = urlParams.get(key);

      if (urlValue !== null) {
        // Try to parse as number if default is number
        if (typeof defaultValue === 'number') {
          const parsed = parseInt(urlValue, 10);
          params[key as keyof T] = (
            isNaN(parsed) ? defaultValue : parsed
          ) as T[keyof T];
        } else {
          params[key as keyof T] = urlValue as T[keyof T];
        }
      } else {
        params[key as keyof T] = defaultValue as T[keyof T];
      }
    }

    return params;
  }, [urlParams, defaultValues]);

  const [params, setParams] = useState<T>(parseParams);

  // Initialize params from URL on mount
  useEffect(() => {
    setParams(parseParams());
    setIsInitialized(true);
  }, []); // Only run on mount

  // Update URL when params change (but only after initialization)
  const updateParams = useCallback(
    (newParams: Partial<T>) => {
      if (!isInitialized) return;

      const updatedParams = { ...params, ...newParams };
      setParams(updatedParams);

      const searchParams = new URLSearchParams();

      for (const [key, value] of Object.entries(updatedParams)) {
        const defaultValue = defaultValues[key];

        // Only add to URL if different from default
        if (
          value !== defaultValue &&
          value !== '' &&
          value !== null &&
          value !== undefined
        ) {
          searchParams.set(key, String(value));
        }
      }

      setUrlParams(searchParams, { replace });
    },
    [params, defaultValues, isInitialized, replace, setUrlParams]
  );

  return {
    params,
    updateParams,
    isInitialized,
  };
}
