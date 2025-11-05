interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (_page: number) => void;
  maxVisiblePages?: number;
}

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 3,
}: PaginationProps) => {
  const getVisiblePages = () => {
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const visiblePages = getVisiblePages();
  const showPrevious = currentPage > 1;
  const showNext = currentPage < totalPages;

  return (
    <div className="flex justify-center items-center mt-8">
      <div className="flex gap-1">
        {/* Previous Button */}
        {showPrevious && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            aria-label={`Go to page ${currentPage - 1}`}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Previous
          </button>
        )}

        {/* Page Numbers */}
        {visiblePages.map(page => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-label={`Go to page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`px-3 py-1 border border-gray-300 dark:border-gray-600 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
              page === currentPage
                ? 'bg-primary-500 text-white border-blue-500 hover:bg-primary-600'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {page}
          </button>
        ))}

        {/* Total Pages Info - only show if not on last page */}
        {currentPage <= totalPages && (
          <span className="px-3 py-1 text-gray-500 dark:text-gray-400">
            of {totalPages}
          </span>
        )}

        {/* Next Button */}
        {showNext && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            aria-label={`Go to page ${currentPage + 1}`}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default Pagination;
