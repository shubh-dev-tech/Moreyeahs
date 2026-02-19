import Link from 'next/link';

export default function CareerNotFound() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        textAlign: 'center',
        maxWidth: '600px'
      }}>
        <h1 style={{
          fontSize: '48px',
          fontWeight: '700',
          marginBottom: '20px',
          color: '#1a1a1a'
        }}>
          Job Not Found
        </h1>
        <p style={{
          fontSize: '18px',
          color: '#666',
          marginBottom: '30px',
          lineHeight: '1.6'
        }}>
          Sorry, we couldn't find the job you're looking for. It may have been filled or removed.
        </p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link 
            href="/careers" 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#667eea',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              transition: 'background 0.2s'
            }}
          >
            View All Open Positions
          </Link>
          <Link 
            href="/" 
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              background: '#f0f0f0',
              color: '#333',
              textDecoration: 'none',
              borderRadius: '6px',
              fontWeight: '500',
              transition: 'background 0.2s'
            }}
          >
            Go Home
          </Link>
        </div>
        <div style={{ marginTop: '40px' }}>
          <p style={{ fontSize: '14px', color: '#999', marginBottom: '10px' }}>
            Looking for something specific?
          </p>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            display: 'flex',
            gap: '20px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <li>
              <Link href="/careers" style={{ color: '#667eea', textDecoration: 'underline' }}>
                Browse all careers
              </Link>
            </li>
            <li>
              <Link href="/contact" style={{ color: '#667eea', textDecoration: 'underline' }}>
                Contact us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
