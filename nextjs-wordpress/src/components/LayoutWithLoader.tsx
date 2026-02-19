'use client';

import { useEffect, useState } from 'react';
import BasicLoader from './BasicLoader';

interface LayoutWithLoaderProps {
  children: React.ReactNode;
}

export default function LayoutWithLoader({ children }: LayoutWithLoaderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Show loader for initial page load
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return <div>{children}</div>;
  }

  return (
    <>
      <BasicLoader 
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