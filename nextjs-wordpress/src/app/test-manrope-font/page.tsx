import React from 'react';

export default function TestManropeFont() {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontWeight: 800, fontSize: '48px', marginBottom: '20px' }}>
        Manrope ExtraBold (800)
      </h1>
      
      <h2 style={{ fontWeight: 700, fontSize: '36px', marginBottom: '20px' }}>
        Manrope Bold (700)
      </h2>
      
      <h3 style={{ fontWeight: 600, fontSize: '28px', marginBottom: '20px' }}>
        Manrope SemiBold (600)
      </h3>
      
      <h4 style={{ fontWeight: 500, fontSize: '24px', marginBottom: '20px' }}>
        Manrope Medium (500)
      </h4>
      
      <p style={{ fontWeight: 400, fontSize: '18px', marginBottom: '20px', lineHeight: '1.6' }}>
        This is Manrope Regular (400). Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
        Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, 
        quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
      
      <p style={{ fontWeight: 300, fontSize: '16px', marginBottom: '20px', lineHeight: '1.6' }}>
        This is Manrope Light (300). Duis aute irure dolor in reprehenderit in voluptate velit 
        esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
        sunt in culpa qui officia deserunt mollit anim id est laborum.
      </p>
      
      <p style={{ fontWeight: 200, fontSize: '14px', marginBottom: '20px', lineHeight: '1.6' }}>
        This is Manrope ExtraLight (200). Sed ut perspiciatis unde omnis iste natus error sit 
        voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo 
        inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
      </p>

      <div style={{ marginTop: '40px', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px' }}>
        <h3 style={{ fontWeight: 600, marginBottom: '15px' }}>Font Implementation Summary</h3>
        <ul style={{ lineHeight: '1.8' }}>
          <li>✅ Manrope Variable Font loaded (supports weights 200-800)</li>
          <li>✅ Static font fallbacks for all weights (200, 300, 400, 500, 600, 700, 800)</li>
          <li>✅ Applied globally via body font-family</li>
          <li>✅ Proper fallback fonts: -apple-system, BlinkMacSystemFont, Segoe UI, etc.</li>
          <li>✅ Font-display: swap for optimal loading performance</li>
          <li>✅ Updated component styles to use Manrope consistently</li>
        </ul>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e8f4fd', borderRadius: '8px' }}>
        <h4 style={{ fontWeight: 500, marginBottom: '10px' }}>Test Different Elements:</h4>
        <button style={{ 
          padding: '12px 24px', 
          fontSize: '16px', 
          fontWeight: 500, 
          backgroundColor: '#007acc', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px',
          marginRight: '10px',
          cursor: 'pointer'
        }}>
          Button Text
        </button>
        <input 
          type="text" 
          placeholder="Input field text" 
          style={{ 
            padding: '12px', 
            fontSize: '16px', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            marginRight: '10px'
          }} 
        />
        <span style={{ fontSize: '14px', fontStyle: 'italic' }}>
          All elements inherit Manrope font
        </span>
      </div>
    </div>
  );
}