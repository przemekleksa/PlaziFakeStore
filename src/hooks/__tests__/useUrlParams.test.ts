import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { act } from 'react';
import { useUrlParams } from '../useUrlParams';

const mockSetSearchParams = vi.fn();
let mockSearchParams: URLSearchParams;

vi.mock('react-router-dom', () => ({
  useSearchParams: () => [mockSearchParams, mockSetSearchParams],
}));

interface TestParams {
  sortBy: string;
  category: string;
  limit: number;
  offset: number;
}

describe('useUrlParams', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchParams = new URLSearchParams();
  });

  describe('Initialization', () => {
    it('should initialize with default values when URL is empty', () => {
      const { result } = renderHook(() =>
        useUrlParams<TestParams>({
          defaultValues: {
            sortBy: '',
            category: '',
            limit: 12,
            offset: 0,
          },
        })
      );

      expect(result.current.params.sortBy).toBe('');
      expect(result.current.params.category).toBe('');
      expect(result.current.params.limit).toBe(12);
      expect(result.current.params.offset).toBe(0);
      expect(result.current.isInitialized).toBe(true);
    });

    it('should parse URL params on mount', () => {
      mockSearchParams.set('sortBy', 'price-high');
      mockSearchParams.set('category', '1');
      mockSearchParams.set('limit', '24');
      mockSearchParams.set('offset', '12');

      const { result } = renderHook(() =>
        useUrlParams<TestParams>({
          defaultValues: {
            sortBy: '',
            category: '',
            limit: 12,
            offset: 0,
          },
        })
      );

      expect(result.current.params.sortBy).toBe('price-high');
      expect(result.current.params.category).toBe('1');
      expect(result.current.params.limit).toBe(24);
      expect(result.current.params.offset).toBe(12);
    });

    it('should handle invalid numbers gracefully', () => {
      mockSearchParams.set('limit', 'invalid');
      mockSearchParams.set('offset', 'abc');

      const { result } = renderHook(() =>
        useUrlParams<TestParams>({
          defaultValues: {
            sortBy: '',
            category: '',
            limit: 12,
            offset: 0,
          },
        })
      );

      expect(result.current.params.limit).toBe(12);
      expect(result.current.params.offset).toBe(0);
    });
  });

  describe('updateParams', () => {
    it('should update URL when updateParams is called', () => {
      const { result } = renderHook(() =>
        useUrlParams<TestParams>({
          defaultValues: {
            sortBy: '',
            category: '',
            limit: 12,
            offset: 0,
          },
        })
      );

      act(() => {
        result.current.updateParams({
          sortBy: 'price-high',
          category: '1',
        });
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams),
        { replace: true }
      );

      const calledParams = mockSetSearchParams.mock.calls[0][0];
      expect(calledParams.get('sortBy')).toBe('price-high');
      expect(calledParams.get('category')).toBe('1');
    });

    it('should only include non-default values in URL', () => {
      const { result } = renderHook(() =>
        useUrlParams<TestParams>({
          defaultValues: {
            sortBy: '',
            category: '',
            limit: 12,
            offset: 0,
          },
        })
      );

      act(() => {
        result.current.updateParams({
          sortBy: 'price-high',
          category: '',
          limit: 12,
          offset: 24,
        });
      });

      const calledParams = mockSetSearchParams.mock.calls[0][0];
      expect(calledParams.get('sortBy')).toBe('price-high');
      expect(calledParams.get('offset')).toBe('24');
      expect(calledParams.has('category')).toBe(false);
      expect(calledParams.has('limit')).toBe(false);
    });

    it('should handle partial updates', () => {
      mockSearchParams.set('sortBy', 'price-high');
      mockSearchParams.set('category', '1');

      const { result } = renderHook(() =>
        useUrlParams<TestParams>({
          defaultValues: {
            sortBy: '',
            category: '',
            limit: 12,
            offset: 0,
          },
        })
      );

      act(() => {
        result.current.updateParams({
          offset: 24,
        });
      });

      const calledParams = mockSetSearchParams.mock.calls[0][0];
      expect(calledParams.get('sortBy')).toBe('price-high'); // preserved
      expect(calledParams.get('category')).toBe('1'); // preserved
      expect(calledParams.get('offset')).toBe('24'); // updated
    });
  });

  describe('Edge cases', () => {
    it('should handle empty URL params', () => {
      const { result } = renderHook(() =>
        useUrlParams<TestParams>({
          defaultValues: {
            sortBy: 'price-high',
            category: '',
            limit: 12,
            offset: 0,
          },
        })
      );

      expect(result.current.params.sortBy).toBe('price-high');
      expect(result.current.params.category).toBe('');
    });

    it('should handle null/undefined values', () => {
      const { result } = renderHook(() =>
        useUrlParams<TestParams>({
          defaultValues: {
            sortBy: '',
            category: '',
            limit: 12,
            offset: 0,
          },
        })
      );

      act(() => {
        result.current.updateParams({
          sortBy: undefined as any,
          category: null as any,
        });
      });

      const calledParams = mockSetSearchParams.mock.calls[0][0];
      expect(calledParams.has('sortBy')).toBe(false);
      expect(calledParams.has('category')).toBe(false);
    });

    it('should use replace: true by default', () => {
      const { result } = renderHook(() =>
        useUrlParams<TestParams>({
          defaultValues: {
            sortBy: '',
            category: '',
            limit: 12,
            offset: 0,
          },
        })
      );

      act(() => {
        result.current.updateParams({
          sortBy: 'price-high',
        });
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams),
        { replace: true }
      );
    });

    it('should respect custom replace option', () => {
      const { result } = renderHook(() =>
        useUrlParams<TestParams>({
          defaultValues: {
            sortBy: '',
            category: '',
            limit: 12,
            offset: 0,
          },
          replace: false,
        })
      );

      act(() => {
        result.current.updateParams({
          sortBy: 'price-high',
        });
      });

      expect(mockSetSearchParams).toHaveBeenCalledWith(
        expect.any(URLSearchParams),
        { replace: false }
      );
    });
  });
});
