'use client';

import { useEffect, useState } from 'react';
import PageLoader from './PageLoader';

interface ManualPageLoaderProps {
  show: boolean;
  onComplete?: () => void;
  duration?: number;
}

export default function ManualPageLoader({ 
  show, 
  onComplete, 
  duration = 2000 
}: ManualPageLoaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  if (!show && !isVisible) return null;

  return <PageLoader isLoading={isVisible} onComplete={() => setIsVisible(false)} />;
}