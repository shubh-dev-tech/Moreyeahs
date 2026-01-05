'use client';

import React from 'react';
import CallToActionSection from '../../components/blocks/call-to-action-section/CallToActionSection';

const TestCallToActionPage = () => {
  // Test data matching the image design
  const testData = {
    background_color: '#1a1a2e',
    heading: "Let's Solve What's Next",
    sub_heading: "Tell us your challenge. We'll design the solution.",
    button_text: "Talk to Our Experts",
    button_link: "#contact",
    button_style: 'primary' as const,
    text_alignment: 'center' as const,
    overlay_opacity: 0.7
  };

  // Test data with background image
  const testDataWithImage = {
    background_color: '#1a1a2e',
    background_image: {
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      alt: 'Technology background'
    },
    heading: "Ready to Transform Your Business?",
    sub_heading: "Join hundreds of companies that trust us with their digital transformation journey.",
    button_text: "Get Started Today",
    button_link: "https://example.com/contact",
    button_style: 'secondary' as const,
    text_alignment: 'center' as const,
    overlay_opacity: 0.6
  };

  // Test data with outline button and left alignment
  const testDataOutline = {
    background_color: '#2d3748',
    heading: "Need Expert Consultation?",
    sub_heading: "Our team of specialists is ready to help you navigate complex challenges and deliver innovative solutions.",
    button_text: "Schedule a Call",
    button_link: "/contact",
    button_style: 'outline' as const,
    text_alignment: 'left' as const,
    overlay_opacity: 0.5
  };

  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px', color: '#333' }}>
          Call to Action Section Test Page
        </h1>
        
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h2 style={{ color: '#333', marginBottom: '10px' }}>Test 1: Basic CTA (Matching Original Design)</h2>
          <p style={{ color: '#666', margin: '0 0 15px 0' }}>
            Dark background with primary button, center aligned
          </p>
        </div>
      </div>

      <CallToActionSection data={testData} />

      <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h2 style={{ color: '#333', marginBottom: '10px' }}>Test 2: CTA with Background Image</h2>
          <p style={{ color: '#666', margin: '0 0 15px 0' }}>
            Background image with overlay, secondary button style
          </p>
        </div>
      </div>

      <CallToActionSection data={testDataWithImage} />

      <div style={{ padding: '20px', backgroundColor: '#f5f5f5' }}>
        <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h2 style={{ color: '#333', marginBottom: '10px' }}>Test 3: Left Aligned with Outline Button</h2>
          <p style={{ color: '#666', margin: '0 0 15px 0' }}>
            Left aligned content with outline button style
          </p>
        </div>
      </div>

      <CallToActionSection data={testDataOutline} />

      <div style={{ padding: '40px 20px', backgroundColor: '#f5f5f5' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
          <h2 style={{ color: '#333', marginBottom: '20px' }}>Block Features</h2>
          <ul style={{ color: '#666', lineHeight: '1.6' }}>
            <li><strong>Customizable Background:</strong> Solid colors or background images with adjustable overlay</li>
            <li><strong>Flexible Content:</strong> Main heading, sub heading, and call-to-action button</li>
            <li><strong>Button Styles:</strong> Primary (blue gradient), Secondary (pink gradient), Outline (transparent)</li>
            <li><strong>Text Alignment:</strong> Left, center, or right alignment options</li>
            <li><strong>Particle Effects:</strong> Animated floating particles for visual appeal</li>
            <li><strong>Responsive Design:</strong> Optimized for all screen sizes</li>
            <li><strong>Accessibility:</strong> Proper semantic HTML and keyboard navigation</li>
            <li><strong>Performance:</strong> CSS animations with hardware acceleration</li>
          </ul>
          
          <h3 style={{ color: '#333', marginTop: '30px', marginBottom: '15px' }}>WordPress Integration</h3>
          <ul style={{ color: '#666', lineHeight: '1.6' }}>
            <li>ACF field group with intuitive controls</li>
            <li>Block preview in WordPress editor</li>
            <li>Full width and wide alignment support</li>
            <li>Custom CSS enqueuing</li>
            <li>Proper sanitization and escaping</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default TestCallToActionPage;