import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="sr-only">Error 404 - Page Not Found</h1>
        <div
          className="text-9xl font-bold text-gray-300 dark:text-gray-600"
          aria-hidden="true"
        >
          404
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
