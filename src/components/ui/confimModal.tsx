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
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          {action}
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={deny}
            className="focus:outline-none text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
            type="button"
          >
            {denyLabel}
          </button>
          <button
            onClick={accept}
            className="focus:outline-none text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            type="button"
          >
            {acceptLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
