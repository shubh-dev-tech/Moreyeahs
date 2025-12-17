import { getSiteSettings } from '@/lib/wpFetch';

export default async function TestLogoAPI() {
  const siteSettings = await getSiteSettings();
  
  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>Logo API Test</h1>
      
      <h2>Site Settings Data:</h2>
      <pre style={{ background: '#f5f5f5', padding: '10px', overflow: 'auto' }}>
        {JSON.stringify(siteSettings, null, 2)}
      </pre>
      
      {siteSettings?.logo ? (
        <div>
          <h2>Logo Found:</h2>
          <p><strong>URL:</strong> {siteSettings.logo.url}</p>
          <p><strong>Alt:</strong> {siteSettings.logo.alt}</p>
          <p><strong>Dimensions:</strong> {siteSettings.logo.width} x {siteSettings.logo.height}</p>
          
          <h3>Logo Preview:</h3>
          <img 
            src={siteSettings.logo.url} 
            alt={siteSettings.logo.alt}
            style={{ maxWidth: '300px', height: 'auto', border: '1px solid #ddd', padding: '10px' }}
          />
        </div>
      ) : (
        <div>
          <h2 style={{ color: 'red' }}>No Logo Found</h2>
          <p>The API did not return logo data.</p>
        </div>
      )}
      
      <hr />
      <p><a href="/">← Back to Home</a></p>
    </div>
  );
}