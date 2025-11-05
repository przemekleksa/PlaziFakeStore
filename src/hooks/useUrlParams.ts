import { useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

interface UseUrlParamsOptions {
  defaultValues?: Record<string, string | number>;
  replace?: boolean;
  sessionStorageKey?: string;
}

export function useUrlParams<T extends Record<string, any>>(
  options: UseUrlParamsOptions = {}
) {
  const { defaultValues = {}, replace = true, sessionStorageKey } = options;
  const [urlParams, setUrlParams] = useSearchParams();
  const [isInitialized, setIsInitialized] = useState(false);
  const [lastUrlState, setLastUrlState] = useState<string>('');

  // Check if params have non-default values
  const hasNonDefaultValues = useCallback(
    (params: T): boolean => {
      return Object.entries(params).some(([key, value]) => {
        const defaultValue = defaultValues[key];
        return (
          value !== defaultValue &&
          value !== '' &&
          value !== null &&
          value !== undefined
        );
      });
    },
    [defaultValues]
  );

  // Parse URL params to typed object
  const parseUrlParams = useCallback((): T => {
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

  // Load params from sessionStorage
  const loadFromSessionStorage = useCallback((): T | null => {
    if (!sessionStorageKey) return null;

    try {
      const saved = sessionStorage.getItem(sessionStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Validate that all required keys exist and have correct types
        const validatedParams = {} as T;
        for (const [key, defaultValue] of Object.entries(defaultValues)) {
          if (key in parsed) {
            validatedParams[key as keyof T] = parsed[key];
          } else {
            validatedParams[key as keyof T] = defaultValue as T[keyof T];
          }
        }
        return validatedParams;
      }
    } catch {
      // Clear corrupted data
      sessionStorage.removeItem(sessionStorageKey);
    }

    return null;
  }, [sessionStorageKey, defaultValues]);

  // Save params to sessionStorage
  const saveToSessionStorage = useCallback(
    (params: T) => {
      if (!sessionStorageKey) return;

      try {
        sessionStorage.setItem(sessionStorageKey, JSON.stringify(params));
      } catch {
        // Silently fail if sessionStorage is not available
      }
    },
    [sessionStorageKey]
  );

  // Clear sessionStorage (useful for reset functionality)
  const clearSessionStorage = useCallback(() => {
    if (sessionStorageKey) {
      sessionStorage.removeItem(sessionStorageKey);
    }
  }, [sessionStorageKey]);

  // Update URL from params object
  const updateUrlFromParams = useCallback(
    (params: T) => {
      const searchParams = new URLSearchParams();

      for (const [key, value] of Object.entries(params)) {
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
    [defaultValues, setUrlParams, replace]
  );

  // Initialize params with hybrid logic: URL > sessionStorage > defaults
  const initializeParams = useCallback((): T => {
    // 1. Try URL first
    const urlParsedParams = parseUrlParams();
    if (hasNonDefaultValues(urlParsedParams)) {
      // URL has filters - use them and save to sessionStorage
      saveToSessionStorage(urlParsedParams);
      return urlParsedParams;
    }

    // 2. Try sessionStorage if URL is empty
    const sessionParams = loadFromSessionStorage();
    if (sessionParams && hasNonDefaultValues(sessionParams)) {
      // SessionStorage has filters - use them and sync to URL
      updateUrlFromParams(sessionParams);
      return sessionParams;
    }

    // 3. Use defaults
    return Object.fromEntries(
      Object.entries(defaultValues).map(([key, value]) => [key, value])
    ) as T;
  }, [
    parseUrlParams,
    hasNonDefaultValues,
    saveToSessionStorage,
    loadFromSessionStorage,
    updateUrlFromParams,
    defaultValues,
  ]);

  const [params, setParams] = useState<T>(() => {
    // Initialize with defaults first, will be updated in useEffect
    return Object.fromEntries(
      Object.entries(defaultValues).map(([key, value]) => [key, value])
    ) as T;
  });

  // Initialize params on mount with hybrid logic
  useEffect(() => {
    const initialParams = initializeParams();
    setParams(initialParams);
    setLastUrlState(urlParams.toString());
    setIsInitialized(true);
  }, []); // Only run on mount

  // Detect URL changes and sync with sessionStorage
  useEffect(() => {
    if (!isInitialized) return;

    const currentUrlState = urlParams.toString();

    // If URL changed externally (user edited URL, back button, etc.)
    if (currentUrlState !== lastUrlState) {
      const urlParsedParams = parseUrlParams();

      // If URL is now empty/default, clear sessionStorage
      if (!hasNonDefaultValues(urlParsedParams)) {
        clearSessionStorage();
      } else {
        // URL has filters, save to sessionStorage
        saveToSessionStorage(urlParsedParams);
      }

      setParams(urlParsedParams);
      setLastUrlState(currentUrlState);
    }
  }, [
    urlParams,
    isInitialized,
    lastUrlState,
    parseUrlParams,
    hasNonDefaultValues,
    clearSessionStorage,
    saveToSessionStorage,
  ]);

  // Listen for sessionStorage changes (from other components/contexts)
  useEffect(() => {
    if (!isInitialized || !sessionStorageKey) return;

    const handleStorageChange = () => {
      const sessionParams = loadFromSessionStorage();

      // If sessionStorage was cleared, reset to defaults
      if (!sessionParams || !hasNonDefaultValues(sessionParams)) {
        const defaultParams = Object.fromEntries(
          Object.entries(defaultValues).map(([key, value]) => [key, value])
        ) as T;

        setParams(defaultParams);
        updateUrlFromParams(defaultParams);
        setLastUrlState('');
      }
    };

    // Listen for storage events (works across tabs/windows)
    window.addEventListener('storage', handleStorageChange);

    // Custom event for same-tab sessionStorage changes
    window.addEventListener('sessionStorageChange', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sessionStorageChange', handleStorageChange);
    };
  }, [
    isInitialized,
    sessionStorageKey,
    loadFromSessionStorage,
    hasNonDefaultValues,
    defaultValues,
    updateUrlFromParams,
  ]);

  // Update both URL and sessionStorage when params change
  const updateParams = useCallback(
    (newParams: Partial<T>) => {
      if (!isInitialized) return;

      const updatedParams = { ...params, ...newParams };
      setParams(updatedParams);

      // Update URL
      updateUrlFromParams(updatedParams);

      // Update last URL state to prevent sync loop
      const searchParams = new URLSearchParams();
      for (const [key, value] of Object.entries(updatedParams)) {
        const defaultValue = defaultValues[key];
        if (
          value !== defaultValue &&
          value !== '' &&
          value !== null &&
          value !== undefined
        ) {
          searchParams.set(key, String(value));
        }
      }
      setLastUrlState(searchParams.toString());

      // Update sessionStorage
      saveToSessionStorage(updatedParams);
    },
    [
      params,
      isInitialized,
      updateUrlFromParams,
      saveToSessionStorage,
      defaultValues,
    ]
  );

  return {
    params,
    updateParams,
    isInitialized,
    clearSessionStorage,
  };
}
