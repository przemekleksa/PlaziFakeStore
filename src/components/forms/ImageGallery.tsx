interface ImageGalleryProps {
  images: string[];
  newImageUrl: string;
  onImagesChange: (images: string[]) => void;
  onNewImageUrlChange: (url: string) => void;
  required?: boolean;
}

const ImageGallery = ({
  images,
  newImageUrl,
  onImagesChange,
  onNewImageUrlChange,
  required = false,
}: ImageGalleryProps) => {
  const addImage = () => {
    if (newImageUrl.trim() && !images.includes(newImageUrl.trim())) {
      onImagesChange([...images, newImageUrl.trim()]);
      onNewImageUrlChange('');
    }
  };

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index));
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    onImagesChange(newImages);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Product Images {required && '*'}
      </label>

      {/* Current Images */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Product image ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index - 1)}
                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    title="Move left"
                  >
                    ←
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  title="Remove image"
                >
                  ✕
                </button>
                {index < images.length - 1 && (
                  <button
                    type="button"
                    onClick={() => moveImage(index, index + 1)}
                    className="p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    title="Move right"
                  >
                    →
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Image */}
      <div className="flex gap-2">
        <input
          type="url"
          value={newImageUrl}
          onChange={e => onNewImageUrlChange(e.target.value)}
          placeholder="Enter image URL"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <button
          type="button"
          onClick={addImage}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Add Image
        </button>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        {required
          ? 'Add at least one image URL. You can reorder and remove images as needed.'
          : 'Add image URLs. You can reorder by using arrow buttons and remove unwanted images.'}
      </p>
    </div>
  );
};

export default ImageGallery;
