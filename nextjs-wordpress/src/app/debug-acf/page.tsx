export default async function DebugACF() {
  let debugData = null;
  let error = null;

  try {
    const apiUrl = `${process.env.WORDPRESS_REST_API_URL}/wp/v2/debug-acf/home`;
    console.log('Debug ACF URL:', apiUrl);
    
    const response = await fetch(apiUrl, { 
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (response.ok) {
      debugData = await response.json();
    } else {
      error = {
        status: response.status,
        statusText: response.statusText,
        text: await response.text()
      };
    }
  } catch (e) {
    error = {
      message: e instanceof Error ? e.message : 'Unknown error',
      stack: e instanceof Error ? e.stack : undefined
    };
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '12px' }}>
      <h1>ACF Debug Information</h1>
      
      {error && (
        <>
          <h2 style={{ color: 'red' }}>Error</h2>
          <pre style={{ color: 'red' }}>{JSON.stringify(error, null, 2)}</pre>
        </>
      )}

      {debugData && (
        <>
          <h2 style={{ color: 'green' }}>Debug Data</h2>
          
          <h3>Page Info</h3>
          <p><strong>ID:</strong> {debugData.page_id}</p>
          <p><strong>Title:</strong> {debugData.page_title}</p>
          <p><strong>Slug:</strong> {debugData.page_slug}</p>
          <p><strong>ACF Version:</strong> {debugData.acf_version}</p>
          
          <h3>All Page Fields</h3>
          <pre>{JSON.stringify(debugData.all_page_fields, null, 2)}</pre>
          
          <h3>Field Groups</h3>
          <pre>{JSON.stringify(debugData.field_groups, null, 2)}</pre>
          
          <h3>More Years Service Field Groups</h3>
          <pre>{JSON.stringify(debugData.moreyeahs_service_field_groups, null, 2)}</pre>
          
          <h3>Raw Blocks</h3>
          <pre>{JSON.stringify(debugData.blocks_raw, null, 2)}</pre>
          
          <details>
            <summary>Page Meta (Click to expand)</summary>
            <pre>{JSON.stringify(debugData.page_meta, null, 2)}</pre>
          </details>
        </>
      )}

      <h2>Test Links</h2>
      <ul>
        <li><a href={`${process.env.WORDPRESS_REST_API_URL}/wp/v2/debug-acf/home`} target="_blank">Debug ACF API</a></li>
        <li><a href={`${process.env.WORDPRESS_REST_API_URL}/wp/v2/pages-with-blocks/home`} target="_blank">Pages with Blocks API</a></li>
        <li><a href={`${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-admin`} target="_blank">WordPress Admin</a></li>
      </ul>
    </div>
  );
}