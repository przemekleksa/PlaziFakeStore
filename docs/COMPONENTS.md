# Component Documentation

This document describes the main components used in the Platzi Fake Store application.

## Table of Contents

- [UI Components](#ui-components)
- [Form Components](#form-components)
- [Layout Components](#layout-components)
- [Product Components](#product-components)
- [Products Components](#products-components)
- [Category Components](#category-components)
- [Accessibility Components](#accessibility-components)
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

### ThemeToggle

Dark/light mode toggle component.

```tsx
import ThemeToggle from '@/components/ui/ThemeToggle';

<ThemeToggle />;
```

**Features:**

- Toggles between light and dark themes
- Persists theme preference
- Smooth transition animations
- Accessible button with proper ARIA labels

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

### ConfirmModal

**Lazy-loaded** confirmation modal component for destructive actions.

```tsx
import { lazy, Suspense } from 'react';
const ConfirmModal = lazy(() => import('@/components/ui/ConfirmModal'));

{
  showModal && (
    <Suspense fallback={<ModalSkeleton />}>
      <ConfirmModal
        action="Are you sure you want to delete this item?"
        accept={handleConfirm}
        deny={handleCancel}
        acceptLabel="Delete"
        denyLabel="Cancel"
      />
    </Suspense>
  );
}
```

**Props:**

- `action`: string - Confirmation message
- `accept`: () => void - Confirm action callback
- `deny`: () => void - Cancel action callback
- `acceptLabel`: string - Confirm button text (default: "Yes")
- `denyLabel`: string - Cancel button text (default: "No")

**Features:**

- Lazy-loaded to reduce initial bundle size
- Keyboard navigation (Escape to close)
- Click outside to close
- Focus management and accessibility
- Customizable button labels

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

### PageHeader

Main application header with navigation and user information.

```tsx
import PageHeader from '@/components/layout/PageHeader';

<PageHeader isAuthenticated={isAuthenticated} user={user} onLogout={logout} />;
```

**Props:**

- `isAuthenticated`: boolean
- `user`: User | null
- `onLogout`: () => void

**Features:**

- User authentication status display
- Navigation between Products/Categories
- Mobile responsive menu
- User avatar and welcome message
- Logout functionality

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

Card component for displaying individual product information.

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

- Optimized image loading with lazy loading
- Edit/delete actions for authenticated users
- Responsive card layout
- Hover effects and interactions

## Products Components

### ProductsGrid

Grid layout component for displaying multiple products.

```tsx
import ProductsGrid from '@/components/products/ProductsGrid';

<ProductsGrid
  products={products}
  isAuthenticated={isAuth}
  onDelete={handleDelete}
/>;
```

**Props:**

- `products`: Product[]
- `isAuthenticated`: boolean
- `onDelete`: (id: number) => void

### ProductsFilters

**Lazy-loaded** filter component for product search and filtering.

```tsx
import { lazy, Suspense } from 'react';
const ProductsFilters = lazy(
  () => import('@/components/products/ProductsFilters')
);

<Suspense fallback={<FiltersSkeleton />}>
  <ProductsFilters
    filters={filters}
    onFiltersChange={setFilters}
    categories={categories}
  />
</Suspense>;
```

**Props:**

- `filters`: ProductFilters
- `onFiltersChange`: (filters: ProductFilters) => void
- `categories`: Category[]

### ProductsSearch

Search input component with debounced search functionality.

```tsx
import ProductsSearch from '@/components/products/ProductsSearch';

<ProductsSearch
  value={searchTerm}
  onChange={handleSearchChange}
  onClear={clearSearch}
/>;
```

### CompactSearchFilters

Compact version of search filters for mobile/scrolled states.

```tsx
import CompactSearchFilters from '@/components/products/CompactSearchFilters';

<CompactSearchFilters
  searchValue={search}
  onSearchChange={setSearch}
  categories={categories}
  selectedCategory={category}
  onCategoryChange={setCategory}
/>;
```

## Category Components

### CategoryCard

Card component for displaying category information.

```tsx
import CategoryCard from '@/components/categories/CategoryCard';

<CategoryCard category={category} />;
```

**Props:**

- `category`: Category

**Features:**

- Category image with lazy loading
- Link to filtered products view
- Responsive design

## Accessibility Components

### FocusManager

Component for managing focus within modals and overlays.

```tsx
import FocusManager from '@/components/accessibility/FocusManager';

<FocusManager trapFocus={true} autoFocus={true} restoreFocus={true}>
  <Modal>Content</Modal>
</FocusManager>;
```

**Props:**

- `trapFocus`: boolean - Trap focus within component
- `autoFocus`: boolean - Auto-focus first element
- `restoreFocus`: boolean - Restore focus on unmount

### SkipToContent

Skip navigation link for keyboard users.

```tsx
import SkipToContent from '@/components/accessibility/SkipToContent';

<SkipToContent />;
```

**Features:**

- Hidden until focused
- Jumps to main content
- WCAG compliance

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

### Code Splitting & Lazy Loading

- **Page Components**: All route components use React.lazy for dynamic imports
- **Heavy Components**: ProductsFilters and ConfirmModal are lazy-loaded with Suspense boundaries
- **Suspense Boundaries**: Proper loading states for all lazy components
- **Bundle Splitting**: Automatic vendor and component chunk separation

### Image Optimization

- **Native Lazy Loading**: `loading="lazy"` attribute on all images
- **Async Decoding**: `decoding="async"` for better performance
- **Fallback Handling**: Graceful error states with placeholder images
- **Responsive Images**: Optimized for different screen sizes

### Component Optimizations

- **Memoization**: Strategic use of React.memo for expensive components
- **Debounced Search**: Search input with 300ms debounce
- **Virtual Scrolling**: Efficient rendering for large product lists
- **Prefetching**: Hover/focus prefetching for navigation links

### Caching Strategy

- **TanStack Query**: Smart server state caching with 10s stale time
- **Component State**: Optimized local state management
- **URL State Sync**: Efficient URL parameter synchronization

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
