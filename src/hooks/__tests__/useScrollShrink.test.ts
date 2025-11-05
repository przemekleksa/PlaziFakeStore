import { renderHook, act } from '@testing-library/react';
import { useScrollShrink } from '../useScrollShrink';

// Mock window.scrollY
Object.defineProperty(window, 'scrollY', {
  writable: true,
  configurable: true,
  value: 0,
});

// Mock addEventListener and removeEventListener
const mockAddEventListener = vi.fn();
const mockRemoveEventListener = vi.fn();

Object.defineProperty(window, 'addEventListener', {
  writable: true,
  configurable: true,
  value: mockAddEventListener,
});

Object.defineProperty(window, 'removeEventListener', {
  writable: true,
  configurable: true,
  value: mockRemoveEventListener,
});

describe('useScrollShrink', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    window.scrollY = 0;
  });

  afterEach(() => {
    // Clean up any remaining event listeners
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
  });

  describe('Initial State', () => {
    it('returns false initially when scroll is at top', () => {
      const { result } = renderHook(() => useScrollShrink());

      expect(result.current).toBe(false);
    });

    it('adds scroll event listener on mount', () => {
      renderHook(() => useScrollShrink());

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'scroll',
        expect.any(Function),
        { passive: true }
      );
    });
  });

  describe('Scroll Behavior', () => {
    it('returns true when scrolled past default threshold (100px)', () => {
      const { result } = renderHook(() => useScrollShrink());

      // Get the scroll handler that was registered
      const scrollHandler = mockAddEventListener.mock.calls[0][1];

      // Simulate scrolling past threshold
      act(() => {
        window.scrollY = 150;
        scrollHandler();
      });

      expect(result.current).toBe(true);
    });

    it('returns false when scrolled back above threshold', () => {
      const { result } = renderHook(() => useScrollShrink());

      const scrollHandler = mockAddEventListener.mock.calls[0][1];

      // Scroll past threshold
      act(() => {
        window.scrollY = 150;
        scrollHandler();
      });

      expect(result.current).toBe(true);

      // Scroll back above threshold
      act(() => {
        window.scrollY = 50;
        scrollHandler();
      });

      expect(result.current).toBe(false);
    });

    it('returns false when exactly at threshold', () => {
      const { result } = renderHook(() => useScrollShrink(100));

      const scrollHandler = mockAddEventListener.mock.calls[0][1];

      act(() => {
        window.scrollY = 100;
        scrollHandler();
      });

      expect(result.current).toBe(false);
    });

    it('returns true when one pixel past threshold', () => {
      const { result } = renderHook(() => useScrollShrink(100));

      const scrollHandler = mockAddEventListener.mock.calls[0][1];

      act(() => {
        window.scrollY = 101;
        scrollHandler();
      });

      expect(result.current).toBe(true);
    });
  });

  describe('Custom Threshold', () => {
    it('uses custom threshold value', () => {
      const customThreshold = 200;
      const { result } = renderHook(() => useScrollShrink(customThreshold));

      const scrollHandler = mockAddEventListener.mock.calls[0][1];

      // Scroll past default threshold but below custom threshold
      act(() => {
        window.scrollY = 150;
        scrollHandler();
      });

      expect(result.current).toBe(false);

      // Scroll past custom threshold
      act(() => {
        window.scrollY = 250;
        scrollHandler();
      });

      expect(result.current).toBe(true);
    });

    it('works with zero threshold', () => {
      const { result } = renderHook(() => useScrollShrink(0));

      const scrollHandler = mockAddEventListener.mock.calls[0][1];

      act(() => {
        window.scrollY = 1;
        scrollHandler();
      });

      expect(result.current).toBe(true);
    });
  });

  describe('Event Cleanup', () => {
    it('removes event listener on unmount', () => {
      const { unmount } = renderHook(() => useScrollShrink());

      const scrollHandler = mockAddEventListener.mock.calls[0][1];

      unmount();

      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'scroll',
        scrollHandler
      );
    });

    it('updates event listener when threshold changes', () => {
      const { rerender } = renderHook(
        ({ threshold }) => useScrollShrink(threshold),
        { initialProps: { threshold: 100 } }
      );

      const firstHandler = mockAddEventListener.mock.calls[0][1];

      // Change threshold
      rerender({ threshold: 200 });

      // Should remove old listener and add new one
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'scroll',
        firstHandler
      );
      expect(mockAddEventListener).toHaveBeenCalledTimes(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles negative scroll values', () => {
      const { result } = renderHook(() => useScrollShrink(100));

      const scrollHandler = mockAddEventListener.mock.calls[0][1];

      act(() => {
        window.scrollY = -50;
        scrollHandler();
      });

      expect(result.current).toBe(false);
    });

    it('handles very large scroll values', () => {
      const { result } = renderHook(() => useScrollShrink(100));

      const scrollHandler = mockAddEventListener.mock.calls[0][1];

      act(() => {
        window.scrollY = 999999;
        scrollHandler();
      });

      expect(result.current).toBe(true);
    });

    it('handles negative threshold values', () => {
      const { result } = renderHook(() => useScrollShrink(-50));

      const scrollHandler = mockAddEventListener.mock.calls[0][1];

      // Any positive scroll should trigger
      act(() => {
        window.scrollY = 1;
        scrollHandler();
      });

      expect(result.current).toBe(true);
    });
  });
});
