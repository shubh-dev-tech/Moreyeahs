'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function usePageLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    // Only show loader on initial page load, not on route changes
    if (isInitialLoad) {
      setIsLoading(true);
      
      // Simulate minimum loading time for better UX
      const minLoadTime = 1800; // 1.8 seconds minimum
      const startTime = Date.now();

      const handleLoad = () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minLoadTime - elapsedTime);

        setTimeout(() => {
          setIsLoading(false);
          setIsInitialLoad(false);
        }, remainingTime);
      };

      // Check if page is already loaded
      if (document.readyState === 'complete') {
        handleLoad();
      } else {
        window.addEventListener('load', handleLoad);
        
        // Fallback timeout in case load event doesn't fire
        const fallbackTimer = setTimeout(handleLoad, 3000);
        
        return () => {
          window.removeEventListener('load', handleLoad);
          clearTimeout(fallbackTimer);
        };
      }
    }
  }, [isInitialLoad]);

  // For route changes, you can optionally show a shorter loader
  const showRouteLoader = () => {
    if (!isInitialLoad) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 800);
    }
  };

  return { 
    isLoading, 
    setIsLoading, 
    showRouteLoader,
    isInitialLoad 
  };
}