# Platzi Fake Store

A modern React application for managing products using the Platzi Fake Store API. Built with React 18, TypeScript, Vite, and Tailwind CSS with comprehensive performance optimizations and accessibility features.

## Features

- 🚀 React 18 with TypeScript and modern patterns
- ⚡ Vite for fast development and optimized builds
- 🎨 Tailwind CSS with dark mode support
- 🔍 Advanced product search, filtering, and sorting
- 📱 Responsive design (mobile-first approach)
- 🔐 JWT-based authentication system
- 📊 Smart data caching with TanStack Query
- ♿ WCAG AA accessibility compliance
- 🧪 Comprehensive testing with Vitest
- 📝 ESLint + Prettier for code quality
- 🚀 Performance optimizations (lazy loading, code splitting)
- 🌐 SEO-friendly with proper meta tags
- 🔄 URL state synchronization
- 📱 PWA-ready architecture

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Configuration

The application is pre-configured to work with the Platzi Fake Store API. No additional environment variables are required for basic functionality.

## Available Scripts

### Development

- `npm run dev` - Start development server with host access
- `npm run preview` - Preview production build locally
- `npm run build:preview` - Build and preview in one command

### Building

- `npm run build` - Build for production
- `npm run build:analyze` - Build with bundle analysis
- `npm run type-check` - Run TypeScript type checking

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

### Testing

- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:ui` - Run tests with UI interface
- `npm run test:coverage` - Run tests with coverage report

### Utilities

- `npm run clean` - Clean build artifacts and cache
- `npm run prepare` - Full check (type-check + lint + test)

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, Modal, etc.)
│   ├── forms/          # Form components with validation
│   ├── layout/         # Layout components (Header, AuthGuard, etc.)
│   ├── product/        # Product-specific components
│   ├── products/       # Products listing components
│   ├── categories/     # Category-related components
│   └── accessibility/  # Accessibility utilities (FocusManager, SkipToContent)
├── pages/              # Route components (lazy-loaded)
├── hooks/              # Custom React hooks
├── services/           # API services and HTTP client
├── contexts/           # React contexts (Auth, Theme)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── __tests__/          # Test files and utilities
```

## Documentation

- 🧩 [Component Documentation](./docs/COMPONENTS.md) - Component usage and props
- 🏗️ [Architecture Documentation](./docs/ARCHITECTURE.md) - System design and patterns
- ⚡ [Performance Guide](./docs/PERFORMANCE.md) - Optimization strategies and metrics

## Performance Optimizations

This application implements several performance optimizations:

### Code Splitting

- **Route-based splitting**: Each page is loaded on-demand
- **Component-based splitting**: Heavy components (modals, filters) are lazy-loaded
- **Vendor splitting**: Third-party libraries in separate chunks

### Image Optimization

- **Lazy loading**: Native `loading="lazy"` for all images
- **Async decoding**: `decoding="async"` for better performance
- **Fallback handling**: Graceful error handling with placeholders

### Caching Strategy

- **TanStack Query**: 10-second stale time for optimal UX
- **DNS prefetching**: Preconnect to external domains
- **Resource preloading**: Critical CSS and fonts

### Bundle Optimization

- **Tree shaking**: Automatic unused code elimination
- **Minification**: Production code compression
- **Modern builds**: ES2020+ for modern browsers

## Lighthouse Scores

- **Desktop**: 98 Performance, 98 Accessibility, 74 Best Practices, 92 SEO
- **Mobile**: 93 Performance, 98 Accessibility, 75 Best Practices, 92 SEO

## API

This application uses the [Platzi Fake Store API](https://fakeapi.platzi.com/) for product data.

- 📚 [API Documentation](https://fakeapi.platzi.com/en/rest/swagger) - Complete API reference
- 🔗 [API Base URL](https://api.escuelajs.co/api/v1) - Live API endpoint

## Technologies Used

### Core Stack

- **React 18** - UI library with concurrent features
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework with dark mode

### State Management & Data

- **TanStack Query** - Server state management and caching
- **React Context** - Client state management (auth, theme)
- **React Hook Form** - Form state and validation

### Routing & Performance

- **React Router v6** - Client-side routing
- **React.lazy** - Code splitting and lazy loading
- **Suspense** - Loading states and error boundaries

### Development & Quality

- **Vitest** - Testing framework
- **React Testing Library** - Component testing
- **ESLint** - Code linting with accessibility rules
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

### API & HTTP

- **Axios** - HTTP client with interceptors
- **Platzi Fake Store API** - Backend service
