'use client';

import MoreyeahsContentBlock from '@/components/blocks/moreyeahs-content-block';

export default function TestContentBlockPage() {
  const testData = {
    heading: "Infosys Blockchain Technology Services for Enterprises",
    description: "Infosys is helping clients create reliable, trusted and sustainable ecosystems for their businesses. We are driving enterprise wide adoption of blockchain-powered business networks across industries by building meaningful commercial/incentive models for all stakeholders in the ecosystem.",
    image: {
      url: "https://via.placeholder.com/600x400/0066cc/ffffff?text=Blockchain+Technology",
      alt: "Blockchain technology services illustration",
      width: 600,
      height: 400
    },
    button_text: "READ MORE",
    button_url: "https://example.com/blockchain-services"
  };

  return (
    <div>
      <h1 style={{ padding: '20px', textAlign: 'center', color: '#333' }}>Test More Years Content Block</h1>
      
      <div style={{ border: '2px solid #007cba', margin: '20px', borderRadius: '8px' }}>
        <div style={{ backgroundColor: '#007cba', color: 'white', padding: '10px', fontWeight: 'bold' }}>
          ✅ Component Test (Direct Render)
        </div>
        <MoreyeahsContentBlock data={testData} />
      </div>

      <div style={{ padding: '20px', backgroundColor: '#e8f5e8', margin: '20px', borderRadius: '8px', border: '1px solid #4caf50' }}>
        <h2 style={{ color: '#2e7d32', marginTop: 0 }}>✅ Fixed Issues</h2>
        <ul style={{ color: '#2e7d32', margin: 0 }}>
          <li>✅ Removed play button overlay from image</li>
          <li>✅ READ MORE button should now display correctly</li>
          <li>✅ Image should load from Content Image field</li>
          <li>✅ Added support for WordPress field names (button_text, button_url)</li>
        </ul>
      </div>

      <div style={{ border: '2px solid #ff9800', margin: '20px', borderRadius: '8px' }}>
        <div style={{ backgroundColor: '#ff9800', color: 'white', padding: '10px', fontWeight: 'bold' }}>
          🧪 WordPress Field Names Test
        </div>
        <MoreyeahsContentBlock data={{
          heading: "Test with WordPress Field Names",
          description: "This tests the WordPress field name format (button_text, button_url)",
          image: {
            url: "https://via.placeholder.com/600x400/ff9800/ffffff?text=WordPress+Fields",
            alt: "WordPress fields test",
            width: 600,
            height: 400
          },
          button_text: "WORDPRESS BUTTON",
          button_url: "https://wordpress.org"
        }} />
      </div>

      <div style={{ border: '2px solid #e91e63', margin: '20px', borderRadius: '8px' }}>
        <div style={{ backgroundColor: '#e91e63', color: 'white', padding: '10px', fontWeight: 'bold' }}>
          🔍 WordPress Image Test (Image ID 141)
        </div>
        <MoreyeahsContentBlock data={{
          heading: "WordPress Image Test",
          description: "This tests with actual WordPress image data (ID 141 should be expanded by REST API)",
          image: {
            id: 141,
            url: "http://localhost/moreyeahs-new/wp-content/uploads/2025/12/experience.png",
            width: 768,
            height: 768,
            alt: "Experience image",
            title: "experience"
          },
          button_text: "WORDPRESS IMAGE",
          button_url: "http://localhost/moreyeahs-new/wp-content/uploads/2025/12/experience.png"
        }} />
      </div>

      <div style={{ border: '2px solid #9c27b0', margin: '20px', borderRadius: '8px' }}>
        <div style={{ backgroundColor: '#9c27b0', color: 'white', padding: '10px', fontWeight: 'bold' }}>
          🧪 Image ID Only Test (Simulating WordPress Issue)
        </div>
        <MoreyeahsContentBlock data={{
          heading: "Image ID Only Test",
          description: "This simulates when WordPress returns just the image ID (141)",
          image: 141,  // Just the ID, like WordPress was doing
          button_text: "IMAGE ID TEST",
          button_url: "#"
        }} />
      </div>
      
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5', margin: '20px', borderRadius: '8px' }}>
        <h2 style={{ color: '#333', marginTop: 0 }}>Debug Information:</h2>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '4px', marginBottom: '10px' }}>
          <strong>Image URL:</strong> {testData.image.url}
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '4px', marginBottom: '10px' }}>
          <strong>Button Text:</strong> {testData.button_text}
        </div>
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '4px', marginBottom: '10px' }}>
          <strong>Button URL:</strong> {testData.button_url}
        </div>
        <details>
          <summary style={{ cursor: 'pointer', fontWeight: 'bold' }}>Full Block Data (Click to expand)</summary>
          <pre style={{ fontSize: '12px', overflow: 'auto', backgroundColor: 'white', padding: '15px', borderRadius: '4px', marginTop: '10px' }}>
            {JSON.stringify(testData, null, 2)}
          </pre>
        </details>
      </div>

      <div style={{ padding: '20px', backgroundColor: '#fff3cd', margin: '20px', borderRadius: '8px', border: '1px solid #ffeaa7' }}>
        <h2 style={{ color: '#856404', marginTop: 0 }}>⚠️ Setup Required</h2>
        <p style={{ color: '#856404', margin: 0 }}>
          To see this block on actual pages, you need to:
        </p>
        <ol style={{ color: '#856404' }}>
          <li>Import the ACF field group in WordPress admin</li>
          <li>Add the &quot;More Years Content&quot; block to a WordPress page</li>
          <li>Fill in the block fields and publish the page</li>
          <li>The NextJS frontend will then render the block automatically</li>
        </ol>
      </div>
    </div>
  );
}