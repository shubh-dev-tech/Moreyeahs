import { getEnvironmentConfig } from '@/lib/environment';

export default function DebugEnvironmentPage() {
  const config = getEnvironmentConfig();
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Environment Debug Information</h1>
      
      <div style={{ background: '#f5f5f5', padding: '20px', marginTop: '20px' }}>
        <h2>Current Environment Configuration</h2>
        <pre>{JSON.stringify(config, null, 2)}</pre>
      </div>
      
      <div style={{ background: '#f0f8ff', padding: '20px', marginTop: '20px' }}>
        <h2>Environment Variables (Client-side)</h2>
        <ul>
          <li><strong>NEXT_PUBLIC_ENVIRONMENT:</strong> {process.env.NEXT_PUBLIC_ENVIRONMENT || 'undefined'}</li>
          <li><strong>NEXT_PUBLIC_WORDPRESS_URL:</strong> {process.env.NEXT_PUBLIC_WORDPRESS_URL || 'undefined'}</li>
          <li><strong>NEXT_PUBLIC_SITE_URL:</strong> {process.env.NEXT_PUBLIC_SITE_URL || 'undefined'}</li>
          <li><strong>NODE_ENV:</strong> {process.env.NODE_ENV || 'undefined'}</li>
        </ul>
      </div>
      
      <div style={{ background: '#fff5f5', padding: '20px', marginTop: '20px' }}>
        <h2>Browser Information</h2>
        <ul>
          <li><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server-side render'}</li>
          <li><strong>Hostname:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'Server-side render'}</li>
          <li><strong>Protocol:</strong> {typeof window !== 'undefined' ? window.location.protocol : 'Server-side render'}</li>
        </ul>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>API Test Links</h2>
        <ul>
          <li><a href="/api/debug-case-studies" target="_blank">Test Case Studies API</a></li>
          <li><a href={`${config.wordpressApiUrl}/wp/v2/case_study`} target="_blank">Direct WordPress API Test</a></li>
        </ul>
      </div>
    </div>
  );
}