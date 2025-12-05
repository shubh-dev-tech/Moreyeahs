import { getSiteSettings, getMenuByLocation } from '@/lib/wordpress';

export default async function TestAPIPage() {
  let siteSettings = null;
  let primaryMenu = null;
  let error = null;

  try {
    siteSettings = await getSiteSettings();
    primaryMenu = await getMenuByLocation('primary');
  } catch (e: any) {
    error = e.message;
  }

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace' }}>
      <h1>WordPress API Test</h1>
      
      {error && (
        <div style={{ background: '#fee', padding: '20px', marginBottom: '20px', borderRadius: '5px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <h2>Environment Variables:</h2>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
        {JSON.stringify({
          WORDPRESS_REST_API_URL: process.env.WORDPRESS_REST_API_URL,
          NEXT_PUBLIC_WORDPRESS_URL: process.env.NEXT_PUBLIC_WORDPRESS_URL,
        }, null, 2)}
      </pre>

      <h2>Site Settings:</h2>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
        {JSON.stringify(siteSettings, null, 2)}
      </pre>

      <h2>Primary Menu:</h2>
      <pre style={{ background: '#f5f5f5', padding: '15px', borderRadius: '5px' }}>
        {JSON.stringify(primaryMenu, null, 2)}
      </pre>
    </div>
  );
}
