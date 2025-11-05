import React, { useEffect, useRef } from 'react';

const SkipToContent = () => {
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && !event.shiftKey) {
        const activeElement = document.activeElement;
        if (
          activeElement === document.body ||
          activeElement === skipLinkRef.current
        ) {
          skipLinkRef.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSkipToContent = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <a
      ref={skipLinkRef}
      href="#main-content"
      onClick={handleSkipToContent}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
      aria-label="Skip to main content"
    >
      Skip to content
    </a>
  );
};

export default SkipToContent;
