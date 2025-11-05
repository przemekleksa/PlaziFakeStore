# Architecture Documentation

This document describes the architecture and design decisions for the Platzi Fake Store application.

## Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Design Patterns](#design-patterns)
- [State Management](#state-management)
- [Data Flow](#data-flow)
- [Performance Considerations](#performance-considerations)
- [Security](#security)
- [Testing Strategy](#testing-strategy)

## Overview

The Platzi Fake Store is a modern React application built with TypeScript that provides a complete product management system. The application follows modern React patterns and best practices for maintainability, performance, and accessibility.

### Key Features

- **Product Management**: Browse, search, filter, and sort products
- **Authentication**: JWT-based user authentication and authorization
- **CRUD Operations**: Full product management for authenticated users
- **Responsive Design**: Mobile-first approach with dark mode support
- **Accessibility**: WCAG AA compliance with comprehensive a11y features
- **Performance**: Code splitting, lazy loading, and caching optimizations
- **URL State**: Deep linking and browser history support
- **Testing**: Comprehensive unit and integration test coverage
- **Error Handling**: Graceful error boundaries and user feedback

## Technology Stack

### Core Technologies

- **React 18**: UI library with concurrent features
- **TypeScript**: Type safety and developer experience
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework

### State Management & Data Fetching

- **TanStack Query**: Server state management and caching
- **React Context**: Client state management (auth, theme)
- **React Hook Form**: Form state management

### Routing & Navigation

- **React Router v6**: Client-side routing with code splitting
- **React.lazy**: Dynamic imports for route-based code splitting

### Development & Quality

- **ESLint**: Code linting with accessibility rules
- **Prettier**: Code formatting
- **Vitest**: Testing framework
- **React Testing Library**: Component testing utilities

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── forms/          # Form components
│   ├── layout/         # Layout components (Header, AuthGuard)
│   ├── product/        # Individual product components
│   ├── products/       # Products listing components
│   ├── categories/     # Category-related components
│   └── accessibility/  # Accessibility components
├── pages/              # Route components (lazy-loaded)
├── hooks/              # Custom React hooks
├── services/           # API services and HTTP client
├── contexts/           # React contexts (Auth, Theme)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── __tests__/          # Test files and utilities
```

### Component Organization

Components are organized by feature and complexity:

- **UI Components**: Reusable, generic components
- **Feature Components**: Domain-specific components
- **Page Components**: Route-level components
- **Layout Components**: PageHeader, AuthGuard, PageErrorBoundary

## Design Patterns

### Component Patterns

1. **Compound Components**: Complex components with multiple parts
2. **Render Props**: Flexible component composition
3. **Custom Hooks**: Logic reuse and separation of concerns
4. **Higher-Order Components**: Cross-cutting concerns (AuthGuard)

### Data Patterns

1. **Repository Pattern**: API service abstraction
2. **Observer Pattern**: React Query for cache invalidation
3. **Factory Pattern**: HTTP client configuration

### Example: Custom Hook Pattern

```typescript
// Custom hook for product management
export const useProducts = (filters: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 10 * 1000, // 10 seconds
  });
};
```

## State Management

### Server State (TanStack Query)

- **Products**: Cached with 10-second stale time
- **Categories**: Long-term cache (rarely changes)
- **User Profile**: Cached during session

### Client State (React Context)

- **Authentication**: User session and tokens
- **Theme**: Dark/light mode preference
- **UI State**: Modals, notifications, loading states

### Form State (React Hook Form)

- **Product Forms**: Create/edit product data
- **Login Form**: Authentication credentials
- **Search/Filter Forms**: Query parameters

## Data Flow

### Authentication Flow

1. User submits login credentials
2. API returns JWT tokens
3. Tokens stored in localStorage
4. AuthContext provides authentication state
5. AuthGuard protects routes
6. HTTP client attaches tokens to requests

### Product Management Flow

1. User navigates to products page
2. useProducts hook triggers API call
3. TanStack Query caches response
4. Components render with cached data
5. User interactions trigger mutations
6. Cache invalidation updates UI

### URL State Synchronization

1. Filters/search stored in URL parameters
2. Custom hook syncs URL with component state
3. Browser navigation preserves application state
4. Deep linking works for all filtered views

## Performance Considerations

### Code Splitting

- **Route-based**: Each page component uses React.lazy for dynamic imports
- **Component-based**: Heavy components (ProductsFilters, ConfirmModal) are lazy-loaded
- **Vendor splitting**: Automatic vendor chunk separation by Vite
- **Suspense boundaries**: Loading states for all lazy-loaded components

### Caching Strategy

- **TanStack Query**: 10-second stale time for products
- **Browser caching**: Static assets with cache headers
- **Prefetching**: Hover/focus prefetching for navigation

### Image Optimization

- **Lazy loading**: Native `loading="lazy"` attribute
- **Responsive images**: Multiple sizes for different viewports
- **WebP format**: Modern image format when supported

### Bundle Optimization

- **Tree shaking**: Unused code elimination
- **Minification**: Code compression for production
- **Gzip compression**: Server-level compression

## Security

### Authentication

- **JWT tokens**: Secure token-based authentication
- **Token storage**: localStorage (JWT tokens have built-in expiration)
- **Route protection**: AuthGuard for protected routes

### API Security

- **HTTPS only**: All API calls over secure connection
- **CORS handling**: Proper cross-origin configuration
- **Input validation**: Client and server-side validation

### API Limitations

- **No partial updates**: The Platzi Fake Store API doesn't support PATCH operations for partial product updates
- **Full object replacement**: PUT operations require sending the complete product object
- **Rate limiting**: API has usage limits that may affect high-frequency operations
- **Mock data**: Some operations may not persist as expected due to the demo nature of the API

### XSS Prevention

- **React's built-in protection**: JSX escaping
- **Content Security Policy**: Restrictive CSP headers
- **Sanitization**: User input sanitization

## Testing Strategy

### Unit Testing

- **Components**: React Testing Library
- **Hooks**: Custom hook testing utilities
- **Services**: API service mocking with MSW
- **Utilities**: Pure function testing

### Integration Testing

- **User flows**: Complete user journey testing
- **API integration**: Real API interaction testing
- **Route testing**: Navigation and route protection

### Accessibility Testing

- **Screen reader**: Automated accessibility testing
- **Keyboard navigation**: Tab order and focus management
- **Color contrast**: WCAG compliance verification

### Performance Testing

- **Bundle analysis**: Webpack Bundle Analyzer
- **Lighthouse**: Performance, accessibility, SEO scores
- **Core Web Vitals**: Loading, interactivity, visual stability

## Error Handling

### Error Boundaries

- **Page-level**: Catch errors in route components
- **Component-level**: Isolate component failures
- **Fallback UI**: User-friendly error messages

### API Error Handling

- **HTTP errors**: Status code-based error handling
- **Network errors**: Offline/connectivity issues
- **Retry logic**: Automatic retry for transient failures

### User Feedback

- **Toast notifications**: Success/error messages
- **Loading states**: Progress indicators
- **Error states**: Clear error messages with actions

## Deployment Architecture

### Build Process

1. **Type checking**: TypeScript compilation
2. **Linting**: ESLint validation
3. **Testing**: Unit and integration tests
4. **Building**: Vite production build
5. **Asset optimization**: Minification and compression

### Environment Configuration

- **Development**: Hot reload, debugging tools
- **Staging**: Production-like environment for testing
- **Production**: Optimized build with monitoring

### Monitoring

- **Error tracking**: Runtime error monitoring
- **Performance monitoring**: Core Web Vitals tracking
- **User analytics**: Usage patterns and behavior

## Future Considerations

### Development Tools

- **Biome**: Replace ESLint + Prettier with faster, unified tooling
- **Query Key Management**: Centralized query key factory for better cache management
- **State Management**: Consider Zustand or Valtio for complex client state

### Scalability

- **Micro-frontends**: Module federation for large teams
- **Component library**: Shared design system with Storybook

### Performance

- **Service workers**: Offline functionality and background sync
- **Virtual scrolling**: Optimize large product lists (1000+ items)
- **Image CDN**: Cloudinary or similar for automatic optimization
- **Bundle analysis**: Automated bundle size monitoring in CI

### Features

- **Internationalization**: React-i18next for multi-language support
- **Real-time updates**: WebSocket integration for live data
- **Progressive Web App**: Service workers, app manifest, offline support
- **Advanced search**: Elasticsearch or Algolia integration

### Code Quality

- **Query Key Factory**: Centralized management of TanStack Query keys
- **Error Tracking**: Sentry integration for production error monitoring
- **Performance Monitoring**: Web Vitals tracking and alerting
