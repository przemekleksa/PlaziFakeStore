import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Image from '@/components/ui/Image';

describe('Image Component', () => {
  it('should render image when src is valid', () => {
    render(<Image src="https://via.placeholder.com/150" alt="Test image" />);

    const img = screen.getByAltText('Test image');
    expect(img).toBeInTheDocument();
  });

  it('should show placeholder when image fails to load', async () => {
    render(<Image src="invalid-url" alt="Test image" />);

    const img = screen.getByAltText('Test image');

    // Simulate image load error
    fireEvent.error(img);

    await waitFor(() => {
      expect(screen.getByAltText('Image not available')).toBeInTheDocument();
    });
  });

  it('should use fallback image when provided and main image fails', async () => {
    render(
      <Image
        src="invalid-url"
        alt="Test image"
        fallback="https://via.placeholder.com/150/fallback"
      />
    );

    const img = screen.getByAltText('Test image');

    // Simulate image load error
    fireEvent.error(img);

    await waitFor(() => {
      const fallbackImg = screen.getByAltText('Test image');
      expect(fallbackImg).toHaveAttribute(
        'src',
        'https://via.placeholder.com/150/fallback'
      );
    });
  });

  it('should not show placeholder when showPlaceholder is false', async () => {
    render(
      <Image src="invalid-url" alt="Test image" showPlaceholder={false} />
    );

    const img = screen.getByAltText('Test image');

    // Simulate image load error
    fireEvent.error(img);

    await waitFor(() => {
      expect(
        screen.queryByAltText('Image not available')
      ).not.toBeInTheDocument();
    });
  });

  it('should apply custom className', () => {
    render(
      <Image
        src="https://via.placeholder.com/150"
        alt="Test image"
        className="custom-class"
      />
    );

    const img = screen.getByAltText('Test image');
    expect(img).toHaveClass('custom-class');
  });
});
