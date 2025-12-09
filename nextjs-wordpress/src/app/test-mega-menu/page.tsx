import { getMegaMenus } from '@/lib/mega-menu';

export default async function TestMegaMenuPage() {
  let megaMenus = [];
  let error = null;

  try {
    megaMenus = await getMegaMenus();
  } catch (e: any) {
    error = e.message;
  }

  const apiUrl = process.env.NEXT_PUBLIC_WP_API_URL || 'http://localhost/wp-json';

  return (
    <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
      <h1>Mega Menu API Test</h1>
      
      <div style={{ background: '#f5f5f5', padding: '1rem', marginBottom: '1rem' }}>
        <h2>Configuration</h2>
        <p><strong>API URL:</strong> {apiUrl}</p>
        <p><strong>Full Endpoint:</strong> {apiUrl}/wp/v2/mega-menus</p>
      </div>

      {error && (
        <div style={{ background: '#fee', padding: '1rem', marginBottom: '1rem', border: '1px solid red' }}>
          <h2>Error</h2>
          <p>{error}</p>
        </div>
      )}

      <div style={{ background: '#efe', padding: '1rem', marginBottom: '1rem' }}>
        <h2>Results</h2>
        <p><strong>Mega Menus Found:</strong> {megaMenus.length}</p>
      </div>

      {megaMenus.length > 0 && (
        <div style={{ background: '#fff', padding: '1rem', border: '1px solid #ddd' }}>
          <h2>Mega Menu Data</h2>
          <pre style={{ overflow: 'auto', maxHeight: '500px' }}>
            {JSON.stringify(megaMenus, null, 2)}
          </pre>
        </div>
      )}

      {megaMenus.length === 0 && !error && (
        <div style={{ background: '#ffe', padding: '1rem', border: '1px solid orange' }}>
          <h2>No Mega Menus Found</h2>
          <p>Steps to fix:</p>
          <ol>
            <li>Go to WordPress admin: <a href="http://localhost/moreyeahs-new/wp-admin" target="_blank">http://localhost/moreyeahs-new/wp-admin</a></li>
            <li>Look for "Mega Menus" in the sidebar</li>
            <li>Click "Add New Mega Menu"</li>
            <li>Fill in the fields and publish</li>
            <li>Refresh this page</li>
          </ol>
          <p>Or test the API directly: <a href={`${apiUrl}/wp/v2/mega-menus`} target="_blank">{apiUrl}/wp/v2/mega-menus</a></p>
        </div>
      )}
    </div>
  );
}
