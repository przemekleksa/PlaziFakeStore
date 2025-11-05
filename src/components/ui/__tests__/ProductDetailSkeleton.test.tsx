import { render, screen } from '@testing-library/react';
import ProductDetailSkeleton from '../ProductDetailSkeleton';

describe('ProductDetailSkeleton', () => {
  it('renders without crashing', () => {
    render(<ProductDetailSkeleton />);
    expect(screen.getByTestId('product-detail-skeleton')).toBeInTheDocument();
  });

  it('has main skeleton sections', () => {
    const { container } = render(<ProductDetailSkeleton />);

    // Should have skeleton elements with animate-pulse class
    const skeletonElements = container.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);

    // Should have grid layout for image and info
    const gridElement = container.querySelector('.grid');
    expect(gridElement).toBeInTheDocument();
  });
});
