'use client';

import { useEffect, useState } from 'react';
import PageLoader from './PageLoader';

interface PageLoaderWrapperProps {
  children: React.ReactNode;
}

export default function PageLoaderWrapper({ children }: PageLoaderWrapperProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Show loader for initial page load with proper timing
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // 3 seconds to match the full animation

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <>
      <PageLoader 
        isLoading={isLoading} 
        onComplete={() => setIsLoading(false)} 
      />
      <div style={{ 
        opacity: isLoading ? 0 : 1, 
        transition: 'opacity 0.5s ease-in-out',
        minHeight: '100vh'
      }}>
        {children}
      </div>
    </>
  );
}