'use client';

import { useState } from 'react';
import ManualPageLoader from '@/components/ManualPageLoader';

export default function TestLoaderPage() {
  const [showLoader, setShowLoader] = useState(false);

  const triggerLoader = () => {
    console.log('Triggering loader...');
    setShowLoader(true);
  };

  return (
    <div style={{ 
      padding: '2rem', 
      textAlign: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0'
    }}>
      <h1 style={{ color: '#333' }}>Page Loader Test</h1>
      <p style={{ color: '#666' }}>Click the button below to test the MOREYEAHS loading animation:</p>
      
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
        Trigger Loading Animation
      </button>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ color: '#333' }}>Debug Info:</h2>
        <p style={{ color: '#666' }}>Loader state: {showLoader ? 'SHOWING' : 'HIDDEN'}</p>
      </div>

      <ManualPageLoader 
        show={showLoader} 
        onComplete={() => {
          console.log('Loader completed');
          setShowLoader(false);
        }}
        duration={3000}
      />
    </div>
  );
}