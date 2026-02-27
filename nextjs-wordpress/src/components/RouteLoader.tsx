'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import PageLoader from './PageLoader';

export default function RouteLoader() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Show loader on route change (but not on initial load)
    const handleRouteChange = () => {
      setIsLoading(true);
      
      // Hide loader after a shorter duration for route changes
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1500);

      return () => clearTimeout(timer);
    };

    // Only trigger on pathname changes after initial load
    if (pathname) {
      const cleanup = handleRouteChange();
      return cleanup;
    }
  }, [pathname]);

  return (
    <PageLoader 
      isLoading={isLoading} 
      onComplete={() => setIsLoading(false)} 
    />
  );
}