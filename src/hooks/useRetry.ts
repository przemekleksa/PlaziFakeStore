import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export const useRetry = () => {
  const queryClient = useQueryClient();

  const retryQuery = useCallback(
    (queryKey: string[]) => {
      queryClient.invalidateQueries({ queryKey });
    },
    [queryClient]
  );

  const retryAllQueries = useCallback(() => {
    queryClient.invalidateQueries();
  }, [queryClient]);

  const clearErrorQueries = useCallback(() => {
    queryClient.resetQueries({
      predicate: query => query.state.status === 'error',
    });
  }, [queryClient]);

  return {
    retryQuery,
    retryAllQueries,
    clearErrorQueries,
  };
};

export default useRetry;
