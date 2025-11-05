import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import PageHeader from '../PageHeader';
import { User } from '@/types';

const mockUser: User = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  role: 'user',
  avatar: 'https://example.com/avatar.jpg',
  creationAt: '2023-01-01T00:00:00Z',
  updatedAt: '2023-01-01T00:00:00Z',
};

const renderWithRouter = (
  component: React.ReactElement,
  initialEntries = ['/']
) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('PageHeader', () => {
  it('shows Products page content when on home route', () => {
    renderWithRouter(
      <PageHeader isAuthenticated={false} user={null} onLogout={vi.fn()} />
    );

    expect(screen.getByText('Platzi Fake Store')).toBeInTheDocument();
    expect(screen.getByText('Discover amazing products')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
  });

  it('shows user avatar when authenticated and user has avatar', () => {
    renderWithRouter(
      <PageHeader isAuthenticated={true} user={mockUser} onLogout={vi.fn()} />
    );

    const avatar = screen.getByAltText('Test User');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
    expect(avatar).toHaveClass('rounded-full');
  });

  it('shows authenticated navigation when user is logged in', () => {
    renderWithRouter(
      <PageHeader isAuthenticated={true} user={mockUser} onLogout={vi.fn()} />
    );

    expect(screen.getByText('Add Product')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('Welcome back, Test User!')).toBeInTheDocument();
  });

  it('shows login button when not authenticated', () => {
    renderWithRouter(
      <PageHeader isAuthenticated={false} user={null} onLogout={vi.fn()} />
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.queryByText('Add Product')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('has correct navigation links', () => {
    renderWithRouter(
      <PageHeader isAuthenticated={true} user={mockUser} onLogout={vi.fn()} />
    );

    const addProductLink = screen.getByText('Add Product').closest('a');
    expect(addProductLink).toHaveAttribute('href', '/products/new');

    const categoriesLink = screen.getByText('Categories').closest('a');
    expect(categoriesLink).toHaveAttribute('href', '/categories');
  });
});
