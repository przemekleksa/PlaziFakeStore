import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@/__tests__/test-utils';
import CompactSearchFilters from '../CompactSearchFilters';
import { Category } from '@/types';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { vi } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { expect } from 'vitest';
import { it } from 'vitest';
import { vi } from 'vitest';
import { beforeEach } from 'vitest';
import { describe } from 'vitest';
import { vi } from 'vitest';
import { vi } from 'vitest';
import { vi } from 'vitest';
import { vi } from 'vitest';

const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Electronics',
    slug: 'electronics',
    image: 'https://example.com/electronics.jpg',
    creationAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
];

const defaultProps = {
  searchValue: '',
  onSearchChange: vi.fn(),
  onClearSearch: vi.fn(),
  filters: {
    priceMin: '',
    priceMax: '',
    category: '',
    sortBy: '',
  },
  categories: mockCategories,
  onFiltersChange: vi.fn(),
  isAuthenticated: false,
  onLogout: vi.fn(),
  user: null,
};

describe('CompactSearchFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderWithProviders(<CompactSearchFilters {...defaultProps} />);

    expect(screen.getByAltText('Platzi Store')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    expect(screen.getByText('Filters')).toBeInTheDocument();
  });

  it('renders search input with correct value', () => {
    renderWithProviders(
      <CompactSearchFilters {...defaultProps} searchValue="laptop" />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    expect(searchInput).toHaveValue('laptop');
  });

  it('calls onSearchChange when typing', () => {
    const onSearchChange = vi.fn();
    renderWithProviders(
      <CompactSearchFilters {...defaultProps} onSearchChange={onSearchChange} />
    );

    const searchInput = screen.getByPlaceholderText('Search...');
    fireEvent.change(searchInput, { target: { value: 'phone' } });

    expect(onSearchChange).toHaveBeenCalledWith('phone');
  });

  it('shows clear button when search has value', () => {
    const { container } = renderWithProviders(
      <CompactSearchFilters {...defaultProps} searchValue="laptop" />
    );

    // Look for X icon in clear button
    const clearButton = container.querySelector(
      'svg path[d*="M6 18L18 6M6 6l12 12"]'
    );
    expect(clearButton).toBeInTheDocument();
  });
});
