import { useRetry } from '@/hooks/useRetry';

interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
  title?: string;
  message?: string;
  showRetry?: boolean;
  queryKey?: string[];
}

const ErrorFallback = ({
  error,
  resetError,
  title = 'Something went wrong',
  message = 'We encountered an unexpected error. Please try again.',
  showRetry = true,
  queryKey,
}: ErrorFallbackProps) => {
  const { retryQuery, retryAllQueries } = useRetry();

  const handleRetry = () => {
    if (resetError) {
      resetError();
    } else if (queryKey) {
      retryQuery(queryKey);
    } else {
      retryAllQueries();
    }
  };
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
        {title}
      </h3>
      <p className="text-red-700 dark:text-red-300 mb-4">{message}</p>

      {error && (
        <details className="text-left bg-red-100 dark:bg-red-900/40 p-3 rounded text-sm text-red-800 dark:text-red-200 mb-4">
          <summary className="cursor-pointer font-medium">
            Error Details
          </summary>
          <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
          {error.stack && (
            <pre className="mt-2 text-xs opacity-75 whitespace-pre-wrap">
              {error.stack}
            </pre>
          )}
        </details>
      )}

      {showRetry && (
        <button onClick={handleRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorFallback;
