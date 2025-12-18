export default function TestSimplePage() {
  return (
    <div>
      <h1 style={{ color: 'red', fontSize: '2rem', padding: '20px' }}>
        Simple Test Page
      </h1>
      <p style={{ padding: '20px', fontSize: '1.2rem' }}>
        This is a simple test to see if content is visible.
      </p>
      <div style={{
        backgroundColor: '#0a0a23',
        color: 'white',
        padding: '40px',
        margin: '20px'
      }}>
        <h2>Test Block</h2>
        <p>This should be visible with a dark blue background.</p>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Simple Test',
  description: 'Simple test page',
};