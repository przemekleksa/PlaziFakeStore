import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Breadcrumbs, { BreadcrumbItem } from '../Breadcrumbs';
import { describe, expect, it } from 'vitest';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Breadcrumbs', () => {
  it('renders breadcrumb items correctly', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/' },
      { label: 'Current Page', current: true },
    ];

    renderWithRouter(<Breadcrumbs items={items} />);

    expect(screen.getAllByText('Home')).toHaveLength(2); // mobile + desktop
    expect(screen.getAllByText('Products')).toHaveLength(2); // mobile + desktop
    expect(screen.getAllByText('Current Page')).toHaveLength(2); // mobile + desktop
  });

  it('renders links for non-current items', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'Current Page', current: true },
    ];

    renderWithRouter(<Breadcrumbs items={items} />);

    const homeLinks = screen.getAllByRole('link', { name: 'Home' });
    expect(homeLinks).toHaveLength(2); // mobile + desktop
    expect(homeLinks[0]).toHaveAttribute('href', '/');

    // Current item should not be a link - check that spans exist instead
    const currentPageElements = screen.getAllByText('Current Page');
    expect(currentPageElements).toHaveLength(2); // mobile + desktop
    currentPageElements.forEach(element => {
      expect(element.tagName).toBe('SPAN');
    });
  });

  it('renders chevron separators between items', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'Products', href: '/' },
      { label: 'Current', current: true },
    ];

    const { container } = renderWithRouter(<Breadcrumbs items={items} />);

    // Should have 2 chevron SVG elements (between 3 items)
    const chevrons = container.querySelectorAll('svg');
    expect(chevrons).toHaveLength(2);
  });

  it('truncates long text to 20 characters', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      {
        label: 'This is a very long product title that should be truncated',
        current: true,
      },
    ];

    renderWithRouter(<Breadcrumbs items={items} />);

    // Should display truncated text
    expect(screen.getByText('This is a very long ...')).toBeInTheDocument();

    // Should have full text in title attribute for tooltip
    const truncatedElement = screen.getByText('This is a very long ...');
    expect(truncatedElement).toHaveAttribute(
      'title',
      'This is a very long product title that should be truncated'
    );
  });

  it('does not truncate short text', () => {
    const items: BreadcrumbItem[] = [
      { label: 'Home', href: '/' },
      { label: 'Short title', current: true },
    ];

    renderWithRouter(<Breadcrumbs items={items} />);

    // Should display full text without truncation
    const elements = screen.getAllByText('Short title');
    expect(elements).toHaveLength(2); // mobile + desktop

    // Should still have title attribute
    elements.forEach(element => {
      expect(element).toHaveAttribute('title', 'Short title');
    });
  });
});
