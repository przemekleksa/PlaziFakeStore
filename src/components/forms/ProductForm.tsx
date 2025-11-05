import { FormEvent } from 'react';
import { useCategories } from '@/hooks/useCategories';
import { useProductForm } from '@/hooks/useProductForm';
import { Product } from '@/types';
import ImageGallery from './ImageGallery';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface ProductFormProps {
  initialProduct?: Product;
  onSubmit: (_data: any) => void;
  submitLabel: string;
  isSubmitting?: boolean;
  mode: 'create' | 'edit';
}

const ProductForm = ({
  initialProduct,
  onSubmit,
  submitLabel,
  isSubmitting = false,
  mode,
}: ProductFormProps) => {
  const navigate = useNavigate();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const {
    title,
    setTitle,
    price,
    setPrice,
    description,
    setDescription,
    categoryId,
    setCategoryId,
    images,
    setImages,
    newImageUrl,
    setNewImageUrl,
    getFormData,
    getChangedFields,
    validate,
  } = useProductForm({ initialProduct });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const errors = validate();
    if (errors.length > 0) {
      toast.error(errors.join(', '));
      return;
    }

    const data = getFormData();

    if (mode === 'edit') {
      const changes = getChangedFields();
      if (Object.keys(changes).length === 0) {
        toast.info('No changes detected');
        return;
      }
    }

    onSubmit(data);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-label={`${mode === 'create' ? 'Create new' : 'Edit'} product form`}
    >
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter product title"
          aria-describedby="title-help"
          required
        />
        <div id="title-help" className="sr-only">
          Enter a descriptive title for your product
        </div>
      </div>

      <div>
        <label
          htmlFor="price"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Price *
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          placeholder="Enter product price"
          aria-describedby="price-help"
          required
        />
        <div id="price-help" className="sr-only">
          Enter the price in dollars, minimum value is 0
        </div>
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Description *
        </label>
        <textarea
          id="description"
          rows={6}
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-vertical"
          placeholder="Enter product description"
          required
        />
      </div>

      {mode === 'create' ? (
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Category *
          </label>
          <select
            id="category"
            value={categoryId}
            onChange={e => setCategoryId(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
            disabled={categoriesLoading}
          >
            <option value="">Select a category</option>
            {categories?.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Category
          </label>
          <input
            id="category"
            type="text"
            value={initialProduct?.category.name || ''}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            placeholder="Category (read-only)"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Category cannot be changed in edit mode
          </p>
        </div>
      )}

      <ImageGallery
        images={images}
        newImageUrl={newImageUrl}
        onImagesChange={setImages}
        onNewImageUrlChange={setNewImageUrl}
        required={mode === 'create'}
      />

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting
            ? `${submitLabel.replace(/e$/, 'ing')}...`
            : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
