'use client';

import { useEffect, useState } from 'react';
import styles from './PageLoader.module.scss';

interface PageLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export default function PageLoader({ isLoading, onComplete }: PageLoaderProps) {
  const [animationPhase, setAnimationPhase] = useState<'initial' | 'filling' | 'glowing' | 'complete' | 'hidden'>('initial');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isLoading) {
      console.log('PageLoader: Starting animation sequence');
      
      // Reset to initial state
      setAnimationPhase('initial');
      
      // Prevent body scroll during loading
      document.body.style.overflow = 'hidden';
      
      // Start filling animation immediately
      const fillTimer = setTimeout(() => {
        console.log('PageLoader: Entering filling phase');
        setAnimationPhase('filling');
      }, 100);

      // Start glowing effect
      const glowTimer = setTimeout(() => {
        console.log('PageLoader: Entering glowing phase');
        setAnimationPhase('glowing');
      }, 1500);

      // Complete animation
      const completeTimer = setTimeout(() => {
        console.log('PageLoader: Entering complete phase');
        setAnimationPhase('complete');
        setTimeout(() => {
          console.log('PageLoader: Animation finished, hiding');
          setAnimationPhase('hidden');
          onComplete?.();
          document.body.style.overflow = '';
        }, 600);
      }, 3000);

      return () => {
        clearTimeout(fillTimer);
        clearTimeout(glowTimer);
        clearTimeout(completeTimer);
        document.body.style.overflow = '';
      };
    }
  }, [isLoading, onComplete, mounted]);

  // Handle external completion
  useEffect(() => {
    if (!isLoading && mounted && animationPhase !== 'initial' && animationPhase !== 'complete' && animationPhase !== 'hidden') {
      console.log('PageLoader: External completion triggered');
      setAnimationPhase('complete');
      setTimeout(() => {
        setAnimationPhase('hidden');
        onComplete?.();
        document.body.style.overflow = '';
      }, 600);
    }
  }, [isLoading, mounted, animationPhase, onComplete]);

  if (!mounted || animationPhase === 'hidden') {
    return null;
  }

  console.log('PageLoader: Rendering with phase:', animationPhase);

  return (
    <div className={`${styles.pageLoader} ${animationPhase !== 'initial' ? styles[animationPhase] : ''}`}>
      <div className={styles.backgroundFill} />
      <div className={styles.content}>
        <h1 className={styles.loadingText}>
          {'MOREYEAHS'.split('').map((letter, index) => (
            <span 
              key={index} 
              className={styles.letter}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {letter}
            </span>
          ))}
        </h1>
        <div className={styles.loadingSubtext}>
         Preparing something awesome…
        </div>
      </div>
    </div>
  );
}