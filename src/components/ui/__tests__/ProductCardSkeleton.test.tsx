import { render } from '@testing-library/react';
import ProductCardSkeleton from '../ProductCardSkeleton';

describe('ProductCardSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<ProductCardSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has basic skeleton structure', () => {
    const { container } = render(<ProductCardSkeleton />);

    const skeletonElements = container.querySelectorAll('.animate-pulse');
    expect(skeletonElements.length).toBeGreaterThan(0);
  });
});
