import { useEffect, useRef, ReactNode } from 'react';

interface FocusManagerProps {
  children: ReactNode;
  autoFocus?: boolean;
  restoreFocus?: boolean;
  trapFocus?: boolean;
}

const FocusManager = ({
  children,
  autoFocus = true,
  restoreFocus = true,
  trapFocus = false,
}: FocusManagerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (restoreFocus) {
      previousActiveElement.current = document.activeElement as HTMLElement;
    }

    if (autoFocus && containerRef.current) {
      const firstFocusable = containerRef.current.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;

      if (firstFocusable) {
        firstFocusable.focus();
      } else {
        containerRef.current.focus();
      }
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!trapFocus || event.key !== 'Tab' || !containerRef.current) return;

      const focusableElements = Array.from(
        containerRef.current.querySelectorAll(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      ) as HTMLElement[];

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    if (trapFocus) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (trapFocus) {
        document.removeEventListener('keydown', handleKeyDown);
      }

      if (restoreFocus && previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    };
  }, [autoFocus, restoreFocus, trapFocus]);

  return (
    <div ref={containerRef} tabIndex={-1}>
      {children}
    </div>
  );
};

export default FocusManager;
