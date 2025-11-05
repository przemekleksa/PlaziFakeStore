import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/__tests__/test-utils';
import ProductCard from '../ProductCard';
import { Product } from '@/types';

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  price: 100,
  description: 'Test description',
  images: ['https://example.com/image.jpg'],
  category: {
    id: 1,
    name: 'Test Category',
    image: 'https://example.com/category.jpg',
    creationAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  creationAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
    expect(screen.getByAltText('Test Product')).toBeInTheDocument();
  });

  it('shows edit and delete buttons when authenticated', () => {
    const mockOnDelete = vi.fn();

    renderWithProviders(
      <ProductCard
        product={mockProduct}
        isAuthenticated={true}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('✏️ Edit')).toBeInTheDocument();
    expect(screen.getByText('🗑️ Delete')).toBeInTheDocument();
  });

  it('hides edit and delete buttons when not authenticated', () => {
    renderWithProviders(
      <ProductCard product={mockProduct} isAuthenticated={false} />
    );

    expect(screen.queryByText('✏️ Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('🗑️ Delete')).not.toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    const mockOnDelete = vi.fn();

    renderWithProviders(
      <ProductCard
        product={mockProduct}
        isAuthenticated={true}
        onDelete={mockOnDelete}
      />
    );

    const deleteButton = screen.getByText('🗑️ Delete');
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
  });

  it('has correct edit link', () => {
    renderWithProviders(
      <ProductCard product={mockProduct} isAuthenticated={true} />
    );

    const editLink = screen.getByText('✏️ Edit');
    expect(editLink.closest('a')).toHaveAttribute('href', '/products/1/edit');
  });

  it('has correct product detail links', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);

    const titleLink = screen.getByText('Test Product').closest('a');
    expect(titleLink).toHaveAttribute('href', '/products/1');

    const imageLink = screen.getByAltText('Test Product').closest('a');
    expect(imageLink).toHaveAttribute('href', '/products/1');
  });
});
