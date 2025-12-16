import React from 'react';

export default function TestStoriesBlogWPPage() {
  return (
    <div className="test-page">
      <div style={{ padding: '20px', background: '#f5f5f5', marginBottom: '20px' }}>
        <h1>Stories & Blog Block - WordPress Integration Test</h1>
        <p>This page simulates how the block would be rendered from WordPress with PHP data attributes.</p>
        <p>The React component will automatically initialize and render in the div below.</p>
      </div>
      
      {/* Simulate WordPress PHP output */}
      <section id="stories-blog-block-test" className="stories-blog-block-placeholder">
        <div 
          className="stories-blog-block-data" 
          data-heading="Success Stories"
          data-subheading="Your partner through complexities of Agile and DevOps transformation"
          data-post-type="posts"
          data-category=""
          data-button-text="Show More"
          data-button-url="/posts"
        >
          {/* React component will render here via client-side initialization */}
          <div style={{ 
            padding: '40px', 
            textAlign: 'center', 
            background: '#e3f2fd', 
            border: '2px dashed #2196f3',
            borderRadius: '8px'
          }}>
            <p>Loading Stories & Blog Block...</p>
            <p><small>If you see this message, the React component hasn&apos;t initialized yet.</small></p>
          </div>
        </div>
      </section>
    </div>
  );
}