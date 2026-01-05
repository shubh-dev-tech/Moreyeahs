'use client';

import React from 'react';
import FullOneByTwoSection from '@/components/blocks/full-one-by-two-section/FullOneByTwoSection';

const TestHighlightPointsPage = () => {
  // Test data with highlight points
  const testData = {
    heading: "Highlight Points Test",
    sub_heading: "This section should show highlight points below.",
    highlight_text: "Key Features",
    highlight_points: [
      { point_text: "First highlight point" },
      { point_text: "Second highlight point" },
      { point_text: "Third highlight point" }
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

  // Test data without highlight_text but with points
  const testData2 = {
    heading: "Points Without Title",
    sub_heading: "This section has highlight points but no highlight_text title.",
    highlight_points: [
      { point_text: "Point without title 1" },
      { point_text: "Point without title 2" }
    ],
    main_image: {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      alt: "Test image 2",
      width: 2072,
      height: 1380
    },
    reverse_layout: true,
    background_color: "#1e3a8a",
    text_color: "#ffffff"
  };

  // Test data with string array (alternative format)
  const testData3 = {
    heading: "String Array Test",
    sub_heading: "This tests highlight points as string array.",
    highlight_text: "Benefits",
    highlight_points: [
      { point_text: "String point 1" },
      { point_text: "String point 2" },
      { point_text: "String point 3" }
    ],
    main_image: {
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80",
      alt: "Test image 3",
      width: 2025,
      height: 1350
    },
    reverse_layout: false,
    background_color: "#2d1b69",
    text_color: "#ffffff"
  };

  return (
    <div className="test-highlight-points-page">
      <div style={{ padding: '2rem', backgroundColor: '#f5f5f5' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
          Highlight Points Test
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '3rem', color: '#666' }}>
          Check the browser console for debug information about highlight points processing.
        </p>
      </div>

      {/* Test 1: Standard object array with highlight_text */}
      <FullOneByTwoSection data={testData} />

      {/* Test 2: Object array without highlight_text */}
      <FullOneByTwoSection data={testData2} />

      {/* Test 3: String array */}
      <FullOneByTwoSection data={testData3} />

      <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>Expected Results</h2>
        <p style={{ color: '#666' }}>
          Each section above should show bullet points. Check the browser console for debug information.
        </p>
      </div>
    </div>
  );
};

export default TestHighlightPointsPage;