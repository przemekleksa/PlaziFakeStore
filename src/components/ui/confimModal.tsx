import { useEffect } from 'react';
import FocusManager from '@/components/accessibility/FocusManager';

interface ConfirmModalProps {
  action: string;
  accept: () => void;
  acceptLabel?: string;
  deny: () => void;
  denyLabel?: string;
}

const ConfirmModal = ({
  action,
  accept,
  acceptLabel = 'Yes',
  deny,
  denyLabel = 'No',
}: ConfirmModalProps) => {
  // Handle Escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        deny();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [deny]);

  // Handle click outside to close modal
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Only close if clicking on the backdrop itself, not on the modal content
    if (event.target === event.currentTarget) {
      deny();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <FocusManager trapFocus={true} autoFocus={true} restoreFocus={true}>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6 max-w-sm sm:max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="mb-4 text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
            {action}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={deny}
              className="w-full sm:w-auto focus:outline-none text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800 order-2 sm:order-1"
              type="button"
            >
              {denyLabel}
            </button>
            <button
              onClick={accept}
              className="w-full sm:w-auto focus:outline-none text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900 order-1 sm:order-2"
              type="button"
            >
              {acceptLabel}
            </button>
          </div>
        </div>
      </FocusManager>
    </div>
  );
};

export default ConfirmModal;
