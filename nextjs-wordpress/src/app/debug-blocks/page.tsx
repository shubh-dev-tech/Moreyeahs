'use client';

import { useState, useEffect } from 'react';

interface DebugData {
  restApiData: any;
  slug: string;
  apiUrl: string | undefined;
  errors: string[];
}

export default function DebugBlocksPage() {
  const [debugData, setDebugData] = useState<DebugData>({
    restApiData: null,
    slug: 'home',
    apiUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL,
    errors: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDebugData() {
      const errors: string[] = [];
      let restApiData = null;

      // Test REST API endpoint
      try {
        const apiUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://dev.moreyeahs.com';
        const response = await fetch(`${apiUrl}/wp-json/wp/v2/pages-with-blocks/home`, {
          headers: {
            'Accept': 'application/json',
          }
        });
        
        if (response.ok) {
          restApiData = await response.json();
        } else {
          errors.push(`REST API Error: HTTP ${response.status} - ${response.statusText}`);
        }
      } catch (error) {
        errors.push(`REST API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      setDebugData({
        restApiData,
        slug: 'home',
        apiUrl: process.env.NEXT_PUBLIC_WORDPRESS_URL,
        errors
      });
      setLoading(false);
    }

    fetchDebugData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'monospace' }}>
        <h1>Debug Blocks Page</h1>
        <p>Loading debug data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Debug Blocks Page</h1>
      
      {debugData.errors.length > 0 && (
        <>
          <h2 style={{ color: 'red' }}>Errors</h2>
          <div style={{ backgroundColor: '#ffe6e6', padding: '10px', borderRadius: '4px', marginBottom: '20px' }}>
            {debugData.errors.map((error, index) => (
              <div key={index} style={{ color: 'red', marginBottom: '5px' }}>
                {error}
              </div>
            ))}
          </div>
        </>
      )}
      
      <h2>Environment</h2>
      <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
        {JSON.stringify({
          NEXT_PUBLIC_WORDPRESS_URL: debugData.apiUrl,
          NODE_ENV: process.env.NODE_ENV
        }, null, 2)}
      </pre>

      <h2>REST API Data</h2>
      <pre style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '4px', maxHeight: '300px', overflow: 'auto' }}>
        {JSON.stringify(debugData.restApiData, null, 2)}
      </pre>


      <h2>Test URLs</h2>
      <ul>
        <li><a href={`${debugData.apiUrl}/wp-json/wp/v2/pages-with-blocks/home`} target="_blank" rel="noopener noreferrer">REST API Test</a></li>
        <li><a href={`${debugData.apiUrl}/wp-json/wp/v2/pages`} target="_blank" rel="noopener noreferrer">WordPress Pages API</a></li>
      </ul>

      <h2>WordPress Status</h2>
      <div style={{ 
        padding: '10px', 
        borderRadius: '4px', 
        backgroundColor: debugData.errors.length === 0 ? '#e6ffe6' : '#ffe6e6',
        color: debugData.errors.length === 0 ? 'green' : 'red'
      }}>
        {debugData.errors.length === 0 ? '✅ WordPress connection successful' : '❌ WordPress connection failed'}
      </div>
    </div>
  );
}