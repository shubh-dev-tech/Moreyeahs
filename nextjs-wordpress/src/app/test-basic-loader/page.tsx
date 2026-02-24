'use client';

import { useState } from 'react';
import BasicLoader from '@/components/BasicLoader';

export default function TestBasicLoaderPage() {
  const [showLoader, setShowLoader] = useState(false);

  const triggerLoader = () => {
    console.log('Triggering basic loader...');
    setShowLoader(true);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <h1 style={{ color: '#333' }}>Basic Loader Test</h1>
      <p style={{ color: '#666' }}>This is a CSS-based version that should definitely work:</p>
      
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
        Test Basic Loader
      </button>

      <div style={{ marginTop: '2rem' }}>
        <p style={{ color: '#666' }}>Loader state: {showLoader ? 'SHOWING' : 'HIDDEN'}</p>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>
          Visit: <a href="http://localhost:3001/test-basic-loader" target="_blank" rel="noopener noreferrer">
            http://localhost:3001/test-basic-loader
          </a>
        </p>
      </div>

      <BasicLoader 
        isLoading={showLoader} 
        onComplete={() => {
          console.log('Basic loader completed');
          setShowLoader(false);
        }}
      />
    </div>
  );
}