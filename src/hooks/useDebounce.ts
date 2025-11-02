import { useEffect, useState } from 'react';

const useDebounce = (
  searchTerm: string,
  delay: number = 300,
  minLength: number = 0
) => {
  const [debouncedValue, setDebouncedValue] = useState(searchTerm);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.length >= minLength || searchTerm.length === 0) {
        setDebouncedValue(searchTerm);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [searchTerm, delay]);

  return debouncedValue;
};

export default useDebounce;
