# Platzi Fake Store

A modern React application for managing products using the Platzi Fake Store API. Built with React 18, TypeScript, Vite, and Tailwind CSS.

## Features

- 🚀 React 18 with TypeScript
- ⚡ Vite for fast development and building
- 🎨 Tailwind CSS with dark mode support
- 🔍 Product search, filtering, and sorting
- 📱 Responsive design (mobile-first)
- 🔐 Authentication system
- 📊 Data caching with TanStack Query
- ♿ Accessibility features
- 🧪 Testing setup with Vitest
- 📝 ESLint + Prettier for code quality

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

## Environment Variables

The application uses the following environment variables:

```bash
# API Configuration
VITE_API_BASE_URL=https://api.escuelajs.co/api/v1

# Development
VITE_DEV_TOOLS=true
```

Create a `.env.local` file in the root directory for local development.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   ├── forms/          # Form components
│   ├── layout/         # Layout components
│   └── product/        # Product-specific components
├── pages/              # Route components
├── hooks/              # Custom React hooks
├── services/           # API services
├── contexts/           # React contexts
├── types/              # TypeScript definitions
├── utils/              # Utility functions
└── __tests__/          # Test files
```

## Documentation

- 🧩 [Component Documentation](./docs/COMPONENTS.md) - Component usage and props
- 🏗️ [Architecture Documentation](./docs/ARCHITECTURE.md) - System design and patterns

## API

This application uses the [Platzi Fake Store API](https://fakeapi.platzi.com/) for product data.

- 📚 [API Documentation](https://fakeapi.platzi.com/en/rest/swagger) - Complete API reference
- 🔗 [API Base URL](https://api.escuelajs.co/api/v1) - Live API endpoint

## Technologies Used

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **TanStack Query** - Data fetching
- **Axios** - HTTP client
- **Vitest** - Testing framework
- **ESLint + Prettier** - Code quality

## License

MIT License
