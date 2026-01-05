'use client';

import React from 'react';
import FullOneByTwoSection from '@/components/blocks/full-one-by-two-section/FullOneByTwoSection';

const TestFullOneByTwoPage = () => {
  // Test data for the component
  const testData1 = {
    heading: "From Processes to Power Moves",
    sub_heading: "We replace fragmented workflows and manual dependencies with intelligent, scalable digital systems. What this means for you:",
    highlight_text: "Highlights",
    highlight_points: [
      { point_text: "Faster time to market" },
      { point_text: "Lower operational risk" },
      { point_text: "Predictable scalability" },
      { point_text: "Data-focused decisions" }
    ],
    button_text: "See How",
    button_link: "#",
    main_image: {
      url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Digital transformation visualization",
      width: 2070,
      height: 1380
    },
    reverse_layout: false,
    background_color: "#1a5f4f",
    text_color: "#ffffff"
  };

  const testData2 = {
    heading: "The Engine Room of Your Digital Success",
    sub_heading: "At Momentum, we design and engineer digital systems that don't just function - they perform, scale, and evolve. Our full-stack expertise, deep data expertise, and cloud-native engineering help enterprises move faster, smarter, and with confidence.",
    highlight_text: "Highlights",
    highlight_points: [
      { point_text: "AI-driven architecture" },
      { point_text: "Data-first decision systems" },
      { point_text: "Automation-led delivery" }
    ],
    button_text: "See How",
    button_link: "#",
    main_image: {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      alt: "Digital success visualization",
      width: 2072,
      height: 1380
    },
    reverse_layout: true,
    background_color: "#1e3a8a",
    text_color: "#ffffff"
  };

  return (
    <div className="test-full-one-by-two-page">
      <div style={{ padding: '2rem', backgroundColor: '#f5f5f5' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
          Full One by Two Section Block Test
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#666' }}>
          Testing the Full One by Two Section block with different configurations
        </p>
      </div>

      {/* Test 1: Normal Layout (Content Left, Image Right) */}
      <FullOneByTwoSection data={testData1} />

      {/* Test 2: Reverse Layout (Image Left, Content Right) */}
      <FullOneByTwoSection data={testData2} />

      {/* Test 3: Minimal Content */}
      <FullOneByTwoSection
        data={{
          heading: "Simple Layout Test",
          sub_heading: "This is a minimal test with just heading and subheading.",
          main_image: {
            url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80",
            alt: "Minimal test image",
            width: 2025,
            height: 1350
          },
          background_color: "#2d1b69",
          text_color: "#ffffff",
          reverse_layout: false
        }}
      />

      {/* Test 4: Light Theme */}
      <FullOneByTwoSection
        data={{
          heading: "Light Theme Example",
          sub_heading: "Testing the block with a light background and dark text for better contrast and readability.",
          highlight_text: "Key Benefits",
          highlight_points: [
            { point_text: "Enhanced user experience" },
            { point_text: "Better accessibility" },
            { point_text: "Modern design approach" }
          ],
          button_text: "Learn More",
          button_link: "#",
          main_image: {
            url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
            alt: "Light theme test",
            width: 2015,
            height: 1344
          },
          background_color: "#f8f9fa",
          text_color: "#333333",
          reverse_layout: true
        }}
      />

      <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>Test Complete</h2>
        <p style={{ color: '#666' }}>
          The Full One by Two Section block has been tested with various configurations including:
        </p>
        <ul style={{ color: '#666', textAlign: 'left', maxWidth: '600px', margin: '1rem auto' }}>
          <li>Normal layout (content left, image right)</li>
          <li>Reverse layout (image left, content right)</li>
          <li>Different background and text colors</li>
          <li>With and without highlight points</li>
          <li>With and without CTA buttons</li>
          <li>Responsive behavior</li>
        </ul>
      </div>
    </div>
  );
};

export default TestFullOneByTwoPage;