'use client';

import { useEffect, useState } from 'react';
import styles from './BasicLoader.module.css';

interface BasicLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export default function BasicLoader({ isLoading, onComplete }: BasicLoaderProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setPhase(0);
      
      const timer1 = setTimeout(() => setPhase(1), 300);
      const timer2 = setTimeout(() => setPhase(2), 1000);
      const timer3 = setTimeout(() => {
        setPhase(3);
        setTimeout(() => onComplete?.(), 600);
      }, 2200);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isLoading, onComplete]);

  if (!isLoading && phase === 0) return null;

  return (
    <div className={`${styles.loader} ${styles[`phase${phase}`]}`}>
      <div className={styles.content}>
        <h1 className={styles.title}>MOREYEAHS</h1>
        <div className={styles.subtitle}>Loading...</div>
      </div>
    </div>
  );
}