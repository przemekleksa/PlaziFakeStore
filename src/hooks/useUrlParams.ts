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

  const parseUrlParams = useCallback((): T => {
    const params = {} as T;

    for (const [key, defaultValue] of Object.entries(defaultValues)) {
      const urlValue = urlParams.get(key);

      if (urlValue !== null) {
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

  const loadFromSessionStorage = useCallback((): T | null => {
    if (!sessionStorageKey) return null;

    try {
      const saved = sessionStorage.getItem(sessionStorageKey);
      if (saved) {
        const parsed = JSON.parse(saved);

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
      sessionStorage.removeItem(sessionStorageKey);
    }

    return null;
  }, [sessionStorageKey, defaultValues]);

  const saveToSessionStorage = useCallback(
    (params: T) => {
      if (!sessionStorageKey) return;

      try {
        sessionStorage.setItem(sessionStorageKey, JSON.stringify(params));
      } catch {
        // Ignore if sessionStorage unavailable
      }
    },
    [sessionStorageKey]
  );

  const clearSessionStorage = useCallback(() => {
    if (sessionStorageKey) {
      sessionStorage.removeItem(sessionStorageKey);
    }
  }, [sessionStorageKey]);

  const updateUrlFromParams = useCallback(
    (params: T) => {
      const searchParams = new URLSearchParams();

      for (const [key, value] of Object.entries(params)) {
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

      setUrlParams(searchParams, { replace });
    },
    [defaultValues, setUrlParams, replace]
  );

  const initializeParams = useCallback((): T => {
    const urlParsedParams = parseUrlParams();
    if (hasNonDefaultValues(urlParsedParams)) {
      saveToSessionStorage(urlParsedParams);
      return urlParsedParams;
    }

    const sessionParams = loadFromSessionStorage();
    if (sessionParams && hasNonDefaultValues(sessionParams)) {
      updateUrlFromParams(sessionParams);
      return sessionParams;
    }
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
    return Object.fromEntries(
      Object.entries(defaultValues).map(([key, value]) => [key, value])
    ) as T;
  });
  useEffect(() => {
    const initialParams = initializeParams();
    setParams(initialParams);
    setLastUrlState(urlParams.toString());
    setIsInitialized(true);
  }, []);
  useEffect(() => {
    if (!isInitialized) return;

    const currentUrlState = urlParams.toString();

    if (currentUrlState !== lastUrlState) {
      const urlParsedParams = parseUrlParams();

      if (!hasNonDefaultValues(urlParsedParams)) {
        clearSessionStorage();
      } else {
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

  useEffect(() => {
    if (!isInitialized || !sessionStorageKey) return;

    const handleStorageChange = () => {
      const sessionParams = loadFromSessionStorage();

      if (!sessionParams || !hasNonDefaultValues(sessionParams)) {
        const defaultParams = Object.fromEntries(
          Object.entries(defaultValues).map(([key, value]) => [key, value])
        ) as T;

        setParams(defaultParams);
        updateUrlFromParams(defaultParams);
        setLastUrlState('');
      }
    };

    window.addEventListener('storage', handleStorageChange);
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

  const updateParams = useCallback(
    (newParams: Partial<T>) => {
      if (!isInitialized) return;

      const updatedParams = { ...params, ...newParams };
      setParams(updatedParams);

      updateUrlFromParams(updatedParams);
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
