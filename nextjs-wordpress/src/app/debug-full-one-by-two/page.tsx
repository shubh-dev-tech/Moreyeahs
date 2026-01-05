'use client';

import React from 'react';
import DebugFullOneByTwoSection from '@/components/blocks/full-one-by-two-section/DebugFullOneByTwoSection';

const DebugFullOneByTwoPage = () => {
  // Test data for debugging
  const testData1 = {
    heading: "Normal Layout Test",
    sub_heading: "This should have content on the left and image on the right.",
    highlight_text: "Key Features",
    highlight_points: [
      { point_text: "Feature one" },
      { point_text: "Feature two" },
      { point_text: "Feature three" }
    ],
    button_text: "Learn More",
    button_link: "#",
    main_image: {
      url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Test image",
      width: 2070,
      height: 1380
    },
    reverse_layout: false,
    background_color: "#1a5f4f",
    text_color: "#ffffff"
  };

  const testData2 = {
    heading: "Reverse Layout Test",
    sub_heading: "This should have image on the left and content on the right.",
    highlight_text: "Benefits",
    highlight_points: [
      { point_text: "Benefit one" },
      { point_text: "Benefit two" }
    ],
    button_text: "Get Started",
    button_link: "#",
    main_image: {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      alt: "Reverse test image",
      width: 2072,
      height: 1380
    },
    reverse_layout: true,
    background_color: "#1e3a8a",
    text_color: "#ffffff"
  };

  // Test with different data types for reverse_layout
  const testData3 = {
    heading: "String True Test",
    sub_heading: "Testing with string 'true' value for reverse_layout.",
    highlight_text: "Points",
    highlight_points: [
      { point_text: "Point A" },
      { point_text: "Point B" }
    ],
    main_image: {
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80",
      alt: "String test image",
      width: 2025,
      height: 1350
    },
    reverse_layout: true, // Boolean true (converted from string)
    background_color: "#2d1b69",
    text_color: "#ffffff"
  };

  const testData4 = {
    heading: "Number 1 Test",
    sub_heading: "Testing with number 1 value for reverse_layout.",
    highlight_text: "Features",
    highlight_points: [
      { point_text: "Feature X" },
      { point_text: "Feature Y" }
    ],
    main_image: {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
      alt: "Number test image",
      width: 2015,
      height: 1344
    },
    reverse_layout: true, // Boolean true (converted from number)
    background_color: "#f8f9fa",
    text_color: "#333333"
  };

  return (
    <div className="debug-full-one-by-two-page">
      <div style={{ padding: '2rem', backgroundColor: '#f5f5f5' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
          Debug Full One by Two Section
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#666' }}>
          Check the browser console for debug information
        </p>
      </div>

      {/* Test 1: Normal Layout (Boolean false) */}
      <DebugFullOneByTwoSection data={testData1} />

      {/* Test 2: Reverse Layout (Boolean true) */}
      <DebugFullOneByTwoSection data={testData2} />

      {/* Test 3: Reverse Layout (String "true") */}
      <DebugFullOneByTwoSection data={testData3} />

      {/* Test 4: Reverse Layout (Number 1) */}
      <DebugFullOneByTwoSection data={testData4} />

      <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>Debug Complete</h2>
        <p style={{ color: '#666' }}>
          Check the browser console and visual debug overlays for information about:
        </p>
        <ul style={{ color: '#666', textAlign: 'left', maxWidth: '600px', margin: '1rem auto' }}>
          <li>Reverse layout values and types</li>
          <li>Highlight points data structure</li>
          <li>CSS class application</li>
          <li>Data processing results</li>
        </ul>
      </div>
    </div>
  );
};

export default DebugFullOneByTwoPage;