import React from 'react';

export default function TestLogoSwitching() {
  return (
    <div style={{ minHeight: '300vh' }}>
      {/* Light background section */}
      <section style={{ 
        height: '100vh', 
        backgroundColor: '#ffffff', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '2rem',
        color: '#000',
        flexDirection: 'column',
        textAlign: 'center'
      }}>
        <div>
          <h1>Light Background Section</h1>
          <p>Logo should show the dark version</p>
          <p>Menu text should be dark</p>
          <p>Hamburger lines should be dark</p>
        </div>
      </section>

      {/* Dark background section */}
      <section style={{ 
        height: '100vh', 
        backgroundColor: '#1a1a1a', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '2rem',
        color: '#fff',
        flexDirection: 'column',
        textAlign: 'center'
      }}>
        <div>
          <h1>Dark Background Section</h1>
          <p>Logo should show the light version</p>
          <p>Menu text should be white</p>
          <p>Hamburger lines should be white</p>
        </div>
      </section>

      {/* Another light section to test scrolling */}
      <section style={{ 
        height: '100vh', 
        backgroundColor: '#f0f0f0', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        fontSize: '2rem',
        color: '#333',
        flexDirection: 'column',
        textAlign: 'center'
      }}>
        <div>
          <h1>Another Light Background</h1>
          <p>Testing dynamic switching on scroll</p>
          <p>All elements should adapt to light background</p>
        </div>
      </section>
    </div>
  );
}