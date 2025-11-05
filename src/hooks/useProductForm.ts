import { useState, useEffect } from 'react';
import { Product } from '@/types';

interface UseProductFormProps {
  initialProduct?: Product;
}

export const useProductForm = ({
  initialProduct,
}: UseProductFormProps = {}) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState(0);
  const [images, setImages] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');

  useEffect(() => {
    if (initialProduct) {
      setTitle(initialProduct.title);
      setPrice(initialProduct.price);
      setDescription(initialProduct.description);
      setCategoryId(initialProduct.category.id);
      setImages(initialProduct.images);
    }
  }, [initialProduct]);

  const resetForm = () => {
    setTitle('');
    setPrice(0);
    setDescription('');
    setCategoryId(0);
    setImages([]);
    setNewImageUrl('');
  };

  const getFormData = () => ({
    title,
    price,
    description,
    categoryId,
    images,
  });

  const getChangedFields = () => {
    if (!initialProduct) return getFormData();

    const changes: any = {};

    if (title !== initialProduct.title) changes.title = title;
    if (price !== initialProduct.price) changes.price = price;
    if (description !== initialProduct.description)
      changes.description = description;
    if (JSON.stringify(images) !== JSON.stringify(initialProduct.images)) {
      changes.images = images;
    }

    return changes;
  };
  const validate = () => {
    const errors: string[] = [];

    if (!title.trim()) errors.push('Title is required');
    if (price <= 0) errors.push('Price must be greater than 0');
    if (!description.trim()) errors.push('Description is required');
    if (!categoryId) errors.push('Category is required');
    if (images.length === 0) errors.push('At least one image is required');

    return errors;
  };

  return {
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

    resetForm,
    getFormData,
    getChangedFields,
    validate,
  };
};
