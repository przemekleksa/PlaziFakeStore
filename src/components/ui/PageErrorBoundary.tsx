import React from 'react';
import ErrorBoundary from './ErrorBoundary';
import ErrorFallback from './ErrorFallback';

interface PageErrorBoundaryProps {
  children: React.ReactNode;
  pageName?: string;
}

const PageErrorBoundary = ({
  children,
  pageName = 'page',
}: PageErrorBoundaryProps) => {
  const handleError = (error: Error) => {
    console.error(`Error in ${pageName}:`, error);
  };

  const fallback = (
    <div className="container mx-auto px-4 py-8">
      <ErrorFallback
        error={undefined}
        title={`Error loading ${pageName}`}
        message={`We encountered an error while loading this ${pageName}. Please try refreshing the page.`}
        resetError={() => window.location.reload()}
        queryKey={undefined}
      />
    </div>
  );

  return (
    <ErrorBoundary fallback={fallback} onError={handleError}>
      {children}
    </ErrorBoundary>
  );
};

export default PageErrorBoundary;
