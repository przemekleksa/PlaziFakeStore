# Implementation Plan

- [x] 1. Set up project structure and core dependencies
  - Initialize React 18 project with TypeScript using Vite
  - Configure Tailwind CSS with dark mode support (darkMode: 'class')
  - Set up ESLint and Prettier configuration files
  - Install and configure React Router with lazy loading
  - Install and configure Axios for HTTP requests
  - Install and configure TanStack Query for data fetching
  - Create basic folder structure (components, pages, hooks, services, types, utils)
  - _Requirements: 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7_

- [ ] 2. Create TypeScript type definitions and API client
  - Define Product, Category, User, and Authentication interfaces in types/
  - Create ProductFilters interface with all filter parameters (title, price_min, price_max, categoryId, limit, offset)
  - Set up Axios client with base URL (https://api.escuelajs.co/api/v1)
  - Configure request interceptor for Bearer token authentication
  - Create API service functions for auth, products, and categories
  - _Requirements: 1.3, 2.1, 2.2, 2.3, 2.4, 2.6, 4.6_

- [ ] 3. Implement authentication system
  - Create AuthContext with login, logout, and authentication state
  - Implement login service function (POST /auth/login)
  - Create secure token storage in localStorage
  - Build LoginPage component with email/password form and validation
  - Create AuthGuard component for protected routes
  - Implement automatic token attachment to API requests
  - Add redirect logic after successful login
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [ ] 4. Set up routing and navigation structure
  - Configure React Router with code splitting for all routes
  - Implement routes: /login, / (products), /products/new, /products/:id/edit, /products/:id, /* (404)
  - Create route components with React.lazy for code splitting
  - Implement AuthGuard protection for product routes
  - Create NotFoundPage component for 404 handling
  - _Requirements: 0.5, 0.6, 4.1, 4.7_

- [ ] 5. Build core product listing functionality
  - Create ProductsPage component with responsive table/card layout
  - Implement useProducts hook with TanStack Query (10-second cache)
  - Build search input with 300ms debounce for title filtering
  - Create filter components for category and price range (price_min/price_max)
  - Implement client-side sorting by title and price
  - Add pagination controls with limit/offset parameters
  - Ensure mobile-first responsive design
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 5.1_

- [ ] 6. Implement state persistence with URL parameters
  - Create custom hook for URL query parameter management
  - Persist filter state (title, category, price range) in URL params
  - Persist sorting and pagination state in URL params
  - Ensure state restoration on page refresh and navigation
  - Store user preferences (page size, column visibility) in localStorage
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 7. Build product CRUD operations
  - Create ProductForm component for create/edit operations
  - Implement CreateProductPage with form validation
  - Implement EditProductPage with partial update support
  - Add delete functionality with confirmation dialog
  - Fetch categories from /categories endpoint for form dropdowns
  - Implement toast/snackbar notifications for success/error feedback
  - Add optimistic UI updates with error rollback
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 6.5_

- [ ] 8. Add loading states and error handling
  - Create skeleton loading components instead of spinners
  - Implement error boundaries for unhandled errors
  - Add proper error handling for API failures
  - Create loading states for all data operations
  - Implement prefetching on navigation link hover/focus
  - _Requirements: 6.3, 6.4, 7.5_

- [ ] 9. Write core functionality tests
  - Set up testing environment with React Testing Library and Jest
  - Write unit tests for authentication hooks and services
  - Write unit tests for product management components
  - Create integration tests for login flow and product listing
  - Test form validation and error handling
  - _Requirements: 7.1, 7.2_

- [ ] 10. Implement accessibility features
  - Add proper ARIA labels and semantic HTML structure
  - Implement keyboard navigation for all interactive elements
  - Create focus management for modals and forms
  - Add "Skip to content" functionality
  - Ensure proper color contrast ratios
  - Test with screen readers and keyboard-only navigation
  - _Requirements: 5.2, 5.3, 5.4, 5.5_

- [ ] 11. Add performance optimizations
  - Implement code splitting for all routes using React.lazy
  - Configure TanStack Query caching (10-second cache for products)
  - Add image lazy loading and optimization
  - Implement bundle optimization and tree shaking
  - Add font preloading and critical CSS
  - _Requirements: 6.1, 6.2, 7.3_

- [ ] 12. Create project documentation and configuration
  - Write comprehensive README.md with setup instructions
  - Document API endpoints and data models
  - Create .eslintrc and .prettierrc configuration files
  - Add development and build scripts
  - Document component usage and architecture decisions
  - _Requirements: 7.5, 7.6, 7.7_

## Extra Features (Optional)

- [ ] 13. Implement theme system (dark/light/system modes)
  - Create ThemeContext with theme state management
  - Implement theme toggle component with accessibility
  - Add theme persistence in localStorage
  - Respect system prefers-color-scheme on first visit
  - Synchronize with system theme changes in system mode
  - Ensure proper contrast ratios in both themes
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [ ]* 14. Add internationalization support (EN/PL)
  - Set up i18n system with context provider for UI text only
  - Create translation files for English and Polish (buttons, labels, form messages)
  - Implement language switcher component
  - Add locale-based number and price formatting using Intl.NumberFormat
  - Persist language preference in URL or localStorage
  - Translate UI text and form validation messages (API data remains in original language)
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [ ]* 15. Implement keyboard shortcuts for power users
  - Create global keyboard shortcut handler
  - Implement "/" to focus search input
  - Implement "n" to open create product form
  - Implement "g l" to navigate to products list
  - Add visible focus indicators for all interactive elements
  - Ensure shortcuts work with screen readers
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ]* 16. Advanced performance and UX enhancements
  - Implement virtual scrolling for large product lists
  - Add advanced caching strategies with cache invalidation
  - Create advanced loading states with skeleton screens
  - Implement optimistic UI for all CRUD operations
  - Add advanced error recovery mechanisms
  - _Requirements: 6.3, 6.4, 6.5_

- [ ]* 17. Comprehensive testing and quality assurance
  - Achieve 90+ Lighthouse scores for Performance, Best Practices, and Accessibility
  - Write E2E tests for critical user journeys
  - Add visual regression testing
  - Implement advanced error boundary testing
  - Create performance benchmarking tests
  - _Requirements: 7.3_