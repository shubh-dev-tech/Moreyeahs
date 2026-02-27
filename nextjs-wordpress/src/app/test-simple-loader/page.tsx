'use client';

import { useState } from 'react';
import SimpleLoader from '@/components/SimpleLoader';

export default function TestSimpleLoaderPage() {
  const [showLoader, setShowLoader] = useState(false);

  const triggerLoader = () => {
    console.log('Triggering simple loader...');
    setShowLoader(true);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <h1 style={{ color: '#333' }}>Simple Loader Test</h1>
      <p style={{ color: '#666' }}>This is a simplified version to test basic functionality:</p>
      
      <button 
        onClick={triggerLoader}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          backgroundColor: '#ff6b6b',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        Test Simple Loader
      </button>

      <div style={{ marginTop: '2rem' }}>
        <p style={{ color: '#666' }}>Loader state: {showLoader ? 'SHOWING' : 'HIDDEN'}</p>
      </div>

      <SimpleLoader 
        isLoading={showLoader} 
        onComplete={() => {
          console.log('Simple loader completed');
          setShowLoader(false);
        }}
      />
    </div>
  );
}