/**
 * Debug page for Stories Blog Block
 * Tests the block with different configurations
 */

import StoriesBlogBlock from '@/components/blocks/stories-blog-block/StoriesBlogBlock';
import StoriesBlogBlockSimple from '@/components/blocks/stories-blog-block/StoriesBlogBlockSimple';

export default function TestStoriesBlogDebugPage() {
  // Test data with background options
  const testData = {
    heading: 'Debug Test - Success Stories',
    subheading: 'Testing dynamic post types and categories with custom background',
    post_type: 'post',
    category: '',
    button_text: 'View All Posts',
    button_url: '/posts',
    background_color: '#2d1b69',
    background_image: ''
  };

  const testDataWithImage = {
    heading: 'Test with Background Image',
    subheading: 'Testing background image functionality',
    post_type: 'post',
    category: '',
    button_text: 'View All Posts',
    button_url: '/posts',
    background_color: '#4a148c',
    background_image: 'https://via.placeholder.com/1200x600/4a148c/ffffff?text=Background+Image'
  };

  return (
    <div className="debug-page">
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h1>Stories Blog Block Debug Page</h1>
        <p>Testing the Stories Blog Block with different configurations</p>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ padding: '20px', backgroundColor: '#333', color: 'white', margin: 0 }}>
          Test 1: Custom Background Color
        </h2>
        <StoriesBlogBlock data={testData} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ padding: '20px', backgroundColor: '#333', color: 'white', margin: 0 }}>
          Test 2: Background Image with Overlay
        </h2>
        <StoriesBlogBlock data={testDataWithImage} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ padding: '20px', backgroundColor: '#333', color: 'white', margin: 0 }}>
          Test 3: Simple Debug Version
        </h2>
        <StoriesBlogBlockSimple data={testData} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ padding: '20px', backgroundColor: '#333', color: 'white', margin: 0 }}>
          Test 4: Default Configuration
        </h2>
        <StoriesBlogBlock data={{}} />
      </div>

      <div style={{ padding: '20px', backgroundColor: '#f0f0f0' }}>
        <h3>Debug Information:</h3>
        <pre style={{ background: 'white', padding: '10px', borderRadius: '4px' }}>
          {JSON.stringify({ testData, testDataWithImage }, null, 2)}
        </pre>
      </div>
    </div>
  );
}