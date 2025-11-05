import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CategoryCard from '../CategoryCard';
import { Category } from '@/types';

const mockCategory: Category = {
  id: 1,
  name: 'Electronics',
  image: 'https://example.com/electronics.jpg',
  creationAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('CategoryCard', () => {
  it('renders category information correctly', () => {
    renderWithRouter(<CategoryCard category={mockCategory} />);

    expect(screen.getByText('Electronics')).toBeInTheDocument();

    expect(screen.getByAltText('Electronics')).toBeInTheDocument();
  });

  it('has correct links to filtered products', () => {
    renderWithRouter(<CategoryCard category={mockCategory} />);

    const titleLink = screen.getByText('Electronics').closest('a');
    expect(titleLink).toHaveAttribute('href', '/?category=1');

    const imageLink = screen.getByAltText('Electronics').closest('a');
    expect(imageLink).toHaveAttribute('href', '/?category=1');
  });

  it('displays category image with correct attributes', () => {
    renderWithRouter(<CategoryCard category={mockCategory} />);

    const image = screen.getByAltText('Electronics');
    expect(image).toHaveAttribute('src', 'https://example.com/electronics.jpg');
  });
});
