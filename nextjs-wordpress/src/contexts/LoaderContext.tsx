'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LoaderContextType {
  showLoader: (duration?: number) => void;
  hideLoader: () => void;
  isLoading: boolean;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showLoader = (duration = 2000) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, duration);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader, isLoading }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error('useLoader must be used within a LoaderProvider');
  }
  return context;
}