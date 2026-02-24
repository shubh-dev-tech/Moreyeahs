'use client';

import { useEffect, useState } from 'react';

interface SimpleLoaderProps {
  isLoading: boolean;
  onComplete?: () => void;
}

export default function SimpleLoader({ isLoading, onComplete }: SimpleLoaderProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isLoading) {
      setPhase(1);
      
      const timer1 = setTimeout(() => setPhase(2), 500);
      const timer2 = setTimeout(() => setPhase(3), 1000);
      const timer3 = setTimeout(() => {
        setPhase(4);
        onComplete?.();
      }, 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [isLoading, onComplete]);

  if (!isLoading && phase === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      zIndex: 99999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: phase >= 2 ? '#ff6b6b' : '#1a1a1a',
      transition: 'background-color 0.8s ease',
      transform: phase === 4 ? 'translateY(-100%)' : 'translateY(0)',
      opacity: phase === 4 ? 0 : 1,
    }}>
      <div style={{
        textAlign: 'center',
        color: 'white',
        opacity: phase >= 2 ? 1 : 0,
        transform: phase >= 2 ? 'translateY(0)' : 'translateY(50px)',
        transition: 'all 0.6s ease',
      }}>
        <h1 style={{
          fontSize: 'clamp(3rem, 8vw, 8rem)',
          fontWeight: 900,
          margin: 0,
          letterSpacing: '0.1em',
          textShadow: phase >= 3 ? '0 0 30px rgba(255,255,255,0.8)' : '0 0 10px rgba(255,255,255,0.3)',
          transition: 'text-shadow 0.5s ease',
        }}>
          MOREYEAHS
        </h1>
        <div style={{
          fontSize: '1.2rem',
          marginTop: '1rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: phase >= 3 ? 1 : 0.7,
          transition: 'opacity 0.5s ease',
        }}>
          Loading...
        </div>
      </div>
    </div>
  );
}