import { render, screen } from '@testing-library/react';
import ProductDetailSkeleton from '../ProductDetailSkeleton';

describe('ProductDetailSkeleton', () => {
  it('renders without crashing', () => {
    render(<ProductDetailSkeleton />);
    expect(screen.getByTestId('product-detail-skeleton')).toBeInTheDocument();
  });

  it('has main skeleton sections', () => {
    const { container } = render(<ProductDetailSkeleton />);

    const skeletonElements = container.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);

    const gridElement = container.querySelector('.grid');
    expect(gridElement).toBeInTheDocument();
  });
});
