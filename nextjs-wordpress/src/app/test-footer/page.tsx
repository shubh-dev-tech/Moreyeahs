import { getFooterWidgets } from '@/lib/wordpress';

export default async function TestFooterPage() {
  const footerData = await getFooterWidgets();

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Footer Data Test</h1>
      <pre style={{ background: '#f5f5f5', padding: '1rem', overflow: 'auto' }}>
        {JSON.stringify(footerData, null, 2)}
      </pre>
    </div>
  );
}
