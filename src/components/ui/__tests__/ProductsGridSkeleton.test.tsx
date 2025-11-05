import { render, screen } from '@testing-library/react';
import ProductsGridSkeleton from '../ProductsGridSkeleton';

describe('ProductsGridSkeleton', () => {
  it('renders without crashing with default count', () => {
    render(<ProductsGridSkeleton />);
    expect(screen.getByTestId('products-grid-skeleton')).toBeInTheDocument();
  });

  it('renders default number of skeleton cards (12)', () => {
    const { container } = render(<ProductsGridSkeleton />);

    const skeletonCards = container.querySelectorAll('.animate-pulse');
    expect(skeletonCards.length).toBeGreaterThan(0);
  });

  it('renders custom number of skeleton cards', () => {
    const customCount = 6;
    const { container } = render(<ProductsGridSkeleton count={customCount} />);

    const gridElement = container.querySelector('.grid');
    expect(gridElement).toBeInTheDocument();

    const skeletonElements = container.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });
});
