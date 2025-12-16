import React from 'react';
import MoreyeahsContentBlock from '@/components/blocks/moreyeahs-content-block';

export default function TestReverseLayoutPage() {
  // Test data for normal layout
  const normalLayoutData = {
    heading: "Normal Layout Test",
    description: "This is a test of the normal layout where content is on the left and image is on the right. The reverse layout should be false or undefined.",
    image: {
      url: "https://via.placeholder.com/600x400/0066cc/ffffff?text=Normal+Layout",
      alt: "Normal layout test image",
      width: 600,
      height: 400
    },
    button_text: "Learn More",
    button_url: "#",
    reverse_layout: false
  };

  // Test data for reversed layout
  const reversedLayoutData = {
    heading: "Reversed Layout Test",
    description: "This is a test of the reversed layout where image is on the left and content is on the right. The reverse layout should be true.",
    image: {
      url: "https://via.placeholder.com/600x400/cc6600/ffffff?text=Reversed+Layout",
      alt: "Reversed layout test image",
      width: 600,
      height: 400
    },
    button_text: "Get Started",
    button_url: "#",
    reverse_layout: true
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', padding: '20px', fontSize: '2rem' }}>
        Reverse Layout Test Page
      </h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ textAlign: 'center', padding: '20px', fontSize: '1.5rem', color: '#666' }}>
          Normal Layout (Content Left, Image Right)
        </h2>
        <MoreyeahsContentBlock data={normalLayoutData} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ textAlign: 'center', padding: '20px', fontSize: '1.5rem', color: '#666' }}>
          Reversed Layout (Image Left, Content Right)
        </h2>
        <MoreyeahsContentBlock data={reversedLayoutData} />
      </div>
    </div>
  );
}