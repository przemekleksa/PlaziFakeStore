# Component Documentation

This document describes the main components used in the Platzi Fake Store application.

## Table of Contents

- [UI Components](#ui-components)
- [Form Components](#form-components)
- [Layout Components](#layout-components)
- [Product Components](#product-components)
- [Page Components](#page-components)

## UI Components

### Button

A reusable button component with multiple variants.

```tsx
import Button from '@/components/ui/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>;
```

**Props:**

- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `disabled`: boolean
- `loading`: boolean
- `children`: ReactNode

### Input

A styled input component with validation support.

```tsx
import Input from '@/components/ui/Input';

<Input
  label="Email"
  type="email"
  value={email}
  onChange={setEmail}
  error={emailError}
  required
/>;
```

**Props:**

- `label`: string
- `type`: string
- `value`: string
- `onChange`: (value: string) => void
- `error`: string
- `required`: boolean
- `placeholder`: string

### Skeleton

Loading skeleton component for better UX.

```tsx
import Skeleton from '@/components/ui/Skeleton';

<Skeleton height="h-8" width="w-48" />;
```

**Props:**

- `height`: string (Tailwind height class)
- `width`: string (Tailwind width class)
- `className`: string

### ErrorBoundary

Error boundary component for handling React errors.

```tsx
import ErrorBoundary from '@/components/ui/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>;
```

**Props:**

- `children`: ReactNode
- `fallback`: ComponentType<{ error: Error; resetError: () => void }>

## Form Components

### ProductForm

Form component for creating and editing products.

```tsx
import ProductForm from '@/components/forms/ProductForm';

<ProductForm
  initialData={product}
  onSubmit={handleSubmit}
  isLoading={isSubmitting}
/>;
```

**Props:**

- `initialData`: Partial<Product>
- `onSubmit`: (data: ProductFormData) => void
- `isLoading`: boolean

### LoginForm

Authentication form component.

```tsx
import LoginForm from '@/components/forms/LoginForm';

<LoginForm onSubmit={handleLogin} isLoading={isLoggingIn} />;
```

**Props:**

- `onSubmit`: (credentials: LoginCredentials) => void
- `isLoading`: boolean

## Layout Components

### Header

Main application header with navigation.

```tsx
import Header from '@/components/layout/Header';

<Header />;
```

**Features:**

- User authentication status
- Navigation links
- Mobile responsive menu
- Dark mode toggle

### AuthGuard

Component that protects routes requiring authentication.

```tsx
import AuthGuard from '@/components/layout/AuthGuard';

<AuthGuard>
  <ProtectedComponent />
</AuthGuard>;
```

**Props:**

- `children`: ReactNode
- `redirectTo`: string (default: '/login')

### Breadcrumbs

Navigation breadcrumbs component.

```tsx
import Breadcrumbs from '@/components/ui/Breadcrumbs';

<Breadcrumbs
  items={[
    { label: 'Home', href: '/' },
    { label: 'Products', href: '/products' },
    { label: 'Product Name' },
  ]}
/>;
```

**Props:**

- `items`: Array<{ label: string; href?: string }>

## Product Components

### ProductCard

Card component for displaying product information.

```tsx
import ProductCard from '@/components/product/ProductCard';

<ProductCard
  product={product}
  isAuthenticated={isAuth}
  onDelete={handleDelete}
/>;
```

**Props:**

- `product`: Product
- `isAuthenticated`: boolean
- `onDelete`: (id: number) => void

**Features:**

- Lazy image loading
- Hover prefetching
- Edit/delete actions for authenticated users
- Responsive design

### ProductGrid

Grid layout for displaying multiple products.

```tsx
import ProductGrid from '@/components/product/ProductGrid';

<ProductGrid
  products={products}
  isAuthenticated={isAuth}
  onDelete={handleDelete}
/>;
```

**Props:**

- `products`: Product[]
- `isAuthenticated`: boolean
- `onDelete`: (id: number) => void

### ProductFilters

Filter component for product search and filtering.

```tsx
import ProductFilters from '@/components/product/ProductFilters';

<ProductFilters
  filters={filters}
  onFiltersChange={setFilters}
  categories={categories}
/>;
```

**Props:**

- `filters`: ProductFilters
- `onFiltersChange`: (filters: ProductFilters) => void
- `categories`: Category[]

## Page Components

### ProductsPage

Main products listing page.

**Features:**

- Product search and filtering
- Pagination
- Sorting options
- Responsive grid layout
- URL state persistence

### ProductDetailPage

Individual product detail page.

**Features:**

- Product information display
- Image gallery
- Edit/delete actions (authenticated users)
- Breadcrumb navigation

### CreateProductPage / EditProductPage

Product creation and editing pages.

**Features:**

- Form validation
- Image upload
- Category selection
- Success/error notifications

### LoginPage

User authentication page.

**Features:**

- Email/password form
- Form validation
- Redirect after login
- Error handling

## Accessibility Features

All components include:

- **Semantic HTML**: Proper use of HTML5 semantic elements
- **ARIA Labels**: Descriptive labels for screen readers
- **Keyboard Navigation**: Full keyboard accessibility
- **Focus Management**: Proper focus indicators and management
- **Color Contrast**: WCAG AA compliant color ratios

## Performance Optimizations

- **Code Splitting**: All page components use React.lazy
- **Memoization**: Components use React.memo where appropriate
- **Image Optimization**: Lazy loading with native loading="lazy"
- **Prefetching**: Hover/focus prefetching for better UX
- **Caching**: TanStack Query for efficient data caching

## Testing

Components are tested using:

- **React Testing Library**: Component testing
- **Vitest**: Test runner
- **User Event**: User interaction testing
- **MSW**: API mocking for integration tests

Example test:

```tsx
import { render, screen } from '@testing-library/react';
import ProductCard from '@/components/product/ProductCard';

test('renders product information', () => {
  const product = {
    id: 1,
    title: 'Test Product',
    price: 99.99,
    // ... other properties
  };

  render(<ProductCard product={product} />);

  expect(screen.getByText('Test Product')).toBeInTheDocument();
  expect(screen.getByText('$99.99')).toBeInTheDocument();
});
```
