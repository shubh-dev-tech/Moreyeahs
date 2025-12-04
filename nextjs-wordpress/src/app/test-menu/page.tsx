import { getMenuByLocation } from '@/lib/wordpress';

export default async function TestMenuPage() {
  const menu = await getMenuByLocation('primary');

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Menu Test Page</h1>
      
      <h2>Environment Variables:</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
        WORDPRESS_REST_API_URL: {process.env.WORDPRESS_REST_API_URL}
      </pre>

      <h2>Menu Data:</h2>
      <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px', overflow: 'auto' }}>
        {JSON.stringify(menu, null, 2)}
      </pre>

      {menu && menu.items && menu.items.length > 0 ? (
        <>
          <h2>Menu Items:</h2>
          <ul>
            {menu.items.map((item) => (
              <li key={item.id}>
                {item.title} - {item.url}
                {item.children.length > 0 && (
                  <ul>
                    {item.children.map((child) => (
                      <li key={child.id}>
                        {child.title} - {child.url}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p style={{ color: 'red' }}>No menu items found!</p>
      )}
    </div>
  );
}
