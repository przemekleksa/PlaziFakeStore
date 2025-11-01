// API Configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.escuelajs.co/api/v1',
  TIMEOUT: 10000,
  CACHE_TIME: 10 * 1000, // 10 seconds for TanStack Query
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PREFERENCES: 'user_preferences',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference',
} as const;

// Pagination Defaults
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  DEFAULT_OFFSET: 0,
  MAX_LIMIT: 100,
} as const;

// Product Filters
export const PRODUCT_FILTERS = {
  PRICE_MIN: 0,
  PRICE_MAX: 10000,
  TITLE_MIN_LENGTH: 2,
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  PRODUCTS: '/',
  PRODUCT_DETAIL: '/products/:id',
  PRODUCT_CREATE: '/products/new',
  PRODUCT_EDIT: '/products/:id/edit',
  NOT_FOUND: '*',
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

// Form Validation
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  PRODUCT_TITLE_MIN_LENGTH: 3,
  PRODUCT_TITLE_MAX_LENGTH: 100,
  PRODUCT_DESCRIPTION_MAX_LENGTH: 500,
  PRODUCT_PRICE_MIN: 0.01,
  PRODUCT_PRICE_MAX: 999999.99,
} as const;