import { useState, ImgHTMLAttributes } from 'react';

interface ImageProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError' | 'onLoad'> {
  src: string;
  alt: string;
  fallback?: string;
  showPlaceholder?: boolean;
}

const Image = ({
  src,
  alt,
  fallback,
  showPlaceholder = true,
  className = '',
  ...props
}: ImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const defaultPlaceholder =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%23f3f4f6'/%3E%3Cg fill='%239ca3af'%3E%3Cpath d='M50 50h100v100H50z' fill='none' stroke='%239ca3af' stroke-width='2'/%3E%3Ccircle cx='70' cy='70' r='8'/%3E%3Cpath d='m50 120 20-20 15 15 25-25 40 40v15H50z'/%3E%3C/g%3E%3Ctext x='100' y='170' text-anchor='middle' fill='%239ca3af' font-size='12' font-family='Arial, sans-serif'%3EImage not available%3C/text%3E%3C/svg%3E";

  if (hasError) {
    if (fallback) {
      return (
        <img
          src={fallback}
          alt={alt}
          className={className}
          onError={() => setHasError(true)}
          loading="lazy"
          decoding="async"
          {...props}
        />
      );
    }

    if (showPlaceholder) {
      return (
        <div
          className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 ${className}`}
          {...props}
        >
          <div className="w-20 h-20 opacity-50">
            <img
              src={defaultPlaceholder}
              alt="Image not available"
              className="w-full h-full"
            />
          </div>
        </div>
      );
    }

    return null;
  }

  return (
    <>
      {isLoading && showPlaceholder && (
        <div
          className={`absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-700 animate-pulse ${className}`}
        >
          <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
        decoding="async"
        {...props}
      />
    </>
  );
};

export default Image;
