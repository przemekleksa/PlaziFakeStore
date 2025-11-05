# Performance Guide

This document outlines the performance optimizations implemented in the Platzi Fake Store application and provides guidelines for maintaining optimal performance.

## Current Performance Metrics

### Lighthouse Scores

**Desktop:**

- Performance: 98/100
- Accessibility: 98/100
- Best Practices: 74/100
- SEO: 92/100

**Mobile:**

- Performance: 93/100
- Accessibility: 98/100
- Best Practices: 75/100
- SEO: 92/100

### Core Web Vitals

- **First Contentful Paint (FCP)**:
  - Desktop: 0.8s
  - Mobile: 2.5s
- **Largest Contentful Paint (LCP)**:
  - Desktop: 1.1s
  - Mobile: 3.8s
- **Total Blocking Time (TBT)**: 0ms
- **Cumulative Layout Shift (CLS)**: 0

## Optimization Strategies

### 1. Code Splitting & Lazy Loading

#### Route-Based Splitting

All page components are dynamically imported using React.lazy:

```tsx
const ProductsPage = React.lazy(() => import('@/pages/ProductsPage'));
const ProductDetailPage = React.lazy(() => import('@/pages/ProductDetailPage'));
```

#### Component-Based Splitting

Heavy components are lazy-loaded to reduce initial bundle size:

```tsx
// Heavy filter component - only loads when needed
const ProductsFilters = lazy(
  () => import('@/components/products/ProductsFilters')
);

// Modal component - only loads when modal is opened
const ConfirmModal = lazy(() => import('@/components/ui/ConfirmModal'));
```

#### Suspense Boundaries

Proper loading states for all lazy-loaded content:

```tsx
<Suspense fallback={<FiltersSkeleton />}>
  <ProductsFilters {...props} />
</Suspense>
```

### 2. Image Optimization

#### Native Lazy Loading

All images use native browser lazy loading:

```tsx
<img src={imageSrc} alt={altText} loading="lazy" decoding="async" />
```

#### Fallback Handling

Graceful error handling with SVG placeholders:

```tsx
const Image = ({ src, alt, fallback, showPlaceholder = true }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError && showPlaceholder) {
    return <PlaceholderSVG />;
  }

  return <img src={src} alt={alt} onError={() => setHasError(true)} />;
};
```

### 3. Bundle Optimization

#### Removed Unused Code

- **Slug functionality**: Removed unused slug-based routing (~100 lines)
- **Unused imports**: Cleaned up all unused dependencies
- **Dead code elimination**: Vite's tree shaking removes unused exports

#### Vendor Splitting

Automatic vendor chunk separation by Vite:

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
      },
    },
  },
});
```

### 4. Network Optimizations

#### DNS Prefetching

Preconnect to external domains:

```html
<link rel="preconnect" href="https://api.escuelajs.co" />
<link rel="preconnect" href="https://i.imgur.com" />
<link rel="preconnect" href="https://placeimg.com" />
```

#### Resource Preloading

Critical resources are preloaded:

```html
<link rel="preload" href="/src/index.css" as="style" />
<link rel="dns-prefetch" href="https://api.escuelajs.co" />
```

### 5. Caching Strategy

#### TanStack Query Configuration

Optimized cache settings for different data types:

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 1000, // 10 seconds for products
      retry: (failureCount, error) => {
        if (error?.response?.status === 404) return false;
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
    },
  },
});
```

#### Cache Invalidation

Smart cache invalidation on mutations:

```tsx
const createProduct = useMutation({
  mutationFn: productService.createProduct,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  },
});
```

### 6. Component Optimizations

#### Debounced Search

Search input with optimized debouncing:

```tsx
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

#### Memoized Components

Strategic memoization for expensive components:

```tsx
const ProductCard = React.memo(({ product, onDelete }) => {
  // Component implementation
});
```

## Performance Monitoring

### Bundle Analysis

Regular bundle size monitoring:

```bash
npm run build -- --analyze
```

### Lighthouse CI

Automated performance testing in CI/CD:

```yaml
- name: Run Lighthouse CI
  run: |
    npm install -g @lhci/cli
    lhci autorun
```

### Core Web Vitals Tracking

Monitor real user metrics:

```tsx
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

## Best Practices

### 1. Component Design

- Keep components small and focused
- Use lazy loading for heavy components
- Implement proper loading states
- Avoid unnecessary re-renders

### 2. Image Handling

- Always use `loading="lazy"` for non-critical images
- Implement fallback mechanisms
- Use appropriate image formats (WebP when possible)
- Optimize image sizes for different viewports

### 3. Bundle Management

- Regularly audit bundle size
- Remove unused dependencies
- Use dynamic imports for large libraries
- Implement proper code splitting

### 4. Caching Strategy

- Set appropriate stale times for different data types
- Implement smart cache invalidation
- Use background refetching for better UX
- Avoid over-caching dynamic data

## Future Optimizations

### Service Workers

Implement service workers for:

- Offline functionality
- Background sync
- Push notifications
- Advanced caching strategies

### Image CDN

Consider implementing:

- Automatic image optimization
- Multiple format serving (WebP, AVIF)
- Responsive image generation
- Global CDN distribution

### Virtual Scrolling

For large product lists:

- Implement virtual scrolling
- Reduce DOM nodes
- Improve scroll performance
- Better memory usage

### Micro-frontends

For scaling:

- Module federation
- Independent deployments
- Team autonomy
- Shared component libraries

## Troubleshooting

### Common Performance Issues

1. **Large Bundle Size**
   - Check for duplicate dependencies
   - Audit unused imports
   - Implement more aggressive code splitting

2. **Slow Image Loading**
   - Verify lazy loading implementation
   - Check image sizes and formats
   - Implement progressive loading

3. **Poor Mobile Performance**
   - Test on real devices
   - Optimize for slower networks
   - Reduce JavaScript execution time

4. **Memory Leaks**
   - Check for unsubscribed event listeners
   - Verify cleanup in useEffect
   - Monitor component unmounting

### Performance Testing

```bash
# Build and analyze bundle
npm run build
npm run preview

# Run Lighthouse
lighthouse http://localhost:4173 --view

# Test on slow networks
# Chrome DevTools > Network > Slow 3G
```

## Conclusion

The Platzi Fake Store application implements comprehensive performance optimizations resulting in excellent Lighthouse scores and Core Web Vitals. The combination of code splitting, lazy loading, image optimization, and smart caching provides a fast, responsive user experience across all devices.

Regular monitoring and adherence to these performance guidelines will ensure the application continues to deliver optimal performance as it grows and evolves.
