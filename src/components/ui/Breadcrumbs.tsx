import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const ChevronRightIcon = () => (
  <svg
    className="h-4 w-4 text-gray-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const truncateText = (
  text: string,
  maxLength: number = 20,
  isMobile: boolean = false
): string => {
  const limit = isMobile ? 16 : maxLength;
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '...';
};

const getMobileLabel = (label: string): string => {
  if (label === 'Platzi Fake Store') return 'Products';
  return label;
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 sm:space-x-2 flex-wrap">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <div className="mx-1 sm:mx-2">
                <ChevronRightIcon />
              </div>
            )}
            {item.current || !item.href ? (
              <>
                {/* Mobile version - shorter labels */}
                <span
                  className="sm:hidden text-gray-500 dark:text-gray-400 text-xs font-medium"
                  title={item.label}
                >
                  {truncateText(getMobileLabel(item.label), 14, true)}
                </span>
                {/* Desktop version - full labels */}
                <span
                  className="hidden sm:inline text-gray-500 dark:text-gray-400 text-sm font-medium"
                  title={item.label}
                >
                  {truncateText(item.label, 20, false)}
                </span>
              </>
            ) : (
              <>
                {/* Mobile version - shorter labels */}
                <Link
                  to={item.href}
                  className="sm:hidden text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-xs font-medium transition-colors"
                  title={item.label}
                >
                  {truncateText(getMobileLabel(item.label), 14, true)}
                </Link>
                {/* Desktop version - full labels */}
                <Link
                  to={item.href}
                  className="hidden sm:inline text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors"
                  title={item.label}
                >
                  {truncateText(item.label, 20, false)}
                </Link>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
