'use client';

import React from 'react';
import FullOneByTwoSection from '@/components/blocks/full-one-by-two-section/FullOneByTwoSection';

const TestFullOneByTwoFixedPage = () => {
  // Test data with different reverse_layout value types (as they might come from WordPress)
  const testData1 = {
    heading: "Normal Layout (Boolean false)",
    sub_heading: "Content should be on the left, image on the right. This tests the default layout behavior.",
    highlight_text: "Key Features",
    highlight_points: [
      { point_text: "Feature one with boolean false" },
      { point_text: "Feature two with boolean false" },
      { point_text: "Feature three with boolean false" }
    ],
    button_text: "Learn More",
    button_link: "#",
    main_image: {
      url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "Normal layout test",
      width: 2070,
      height: 1380
    },
    reverse_layout: false,
    background_color: "#1a5f4f",
    text_color: "#ffffff"
  };

  const testData2 = {
    heading: "Reverse Layout (Boolean true)",
    sub_heading: "Image should be on the left, content on the right. This tests the reverse layout with boolean true.",
    highlight_text: "Benefits",
    highlight_points: [
      { point_text: "Benefit one with boolean true" },
      { point_text: "Benefit two with boolean true" },
      { point_text: "Benefit three with boolean true" }
    ],
    button_text: "Get Started",
    button_link: "#",
    main_image: {
      url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80",
      alt: "Reverse layout test",
      width: 2072,
      height: 1380
    },
    reverse_layout: true,
    background_color: "#1e3a8a",
    text_color: "#ffffff"
  };

  // Test with WordPress ACF-style data (string "1" for true)
  const testData3 = {
    heading: "Reverse Layout (String '1')",
    sub_heading: "Image should be on the left, content on the right. This tests WordPress ACF true_false field returning '1'.",
    highlight_text: "Advantages",
    highlight_points: [
      { point_text: "Advantage one with string '1'" },
      { point_text: "Advantage two with string '1'" }
    ],
    button_text: "Explore",
    button_link: "#",
    main_image: {
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80",
      alt: "String 1 test",
      width: 2025,
      height: 1350
    },
    reverse_layout: true, // WordPress ACF converted to boolean
    background_color: "#2d1b69",
    text_color: "#ffffff"
  };

  // Test with WordPress ACF-style data (number 1 for true)
  const testData4 = {
    heading: "Reverse Layout (Number 1)",
    sub_heading: "Image should be on the left, content on the right. This tests WordPress ACF true_false field returning number 1.",
    highlight_text: "Highlights",
    highlight_points: [
      { point_text: "Highlight one with number 1" },
      { point_text: "Highlight two with number 1" }
    ],
    button_text: "Discover",
    button_link: "#",
    main_image: {
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80",
      alt: "Number 1 test",
      width: 2015,
      height: 1344
    },
    reverse_layout: true, // WordPress ACF converted to boolean
    background_color: "#f8f9fa",
    text_color: "#333333"
  };

  // Test with string "true"
  const testData5 = {
    heading: "Reverse Layout (String 'true')",
    sub_heading: "Image should be on the left, content on the right. This tests string 'true' value.",
    highlight_text: "Features",
    highlight_points: [
      { point_text: "Feature with string 'true'" },
      { point_text: "Another feature with string 'true'" }
    ],
    button_text: "View More",
    button_link: "#",
    main_image: {
      url: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      alt: "String true test",
      width: 2074,
      height: 1382
    },
    reverse_layout: true, // Some APIs converted to boolean
    background_color: "#059669",
    text_color: "#ffffff"
  };

  // Test without highlight points to ensure it doesn't break
  const testData6 = {
    heading: "No Highlight Points Test",
    sub_heading: "This section has no highlight points to test that the component handles missing data gracefully.",
    button_text: "Continue",
    button_link: "#",
    main_image: {
      url: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      alt: "No highlights test",
      width: 2070,
      height: 1380
    },
    reverse_layout: false,
    background_color: "#7c3aed",
    text_color: "#ffffff"
  };

  return (
    <div className="test-full-one-by-two-fixed-page">
      <div style={{ padding: '2rem', backgroundColor: '#f5f5f5' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem', color: '#333' }}>
          Full One by Two Section - Fixed Version Test
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '1rem', color: '#666' }}>
          Testing fixes for reverse layout and highlight points issues
        </p>
        <div style={{ textAlign: 'center', marginBottom: '3rem', color: '#666', fontSize: '14px' }}>
          <strong>Expected behavior:</strong><br/>
          • Sections 2, 3, 4, and 5 should have image on LEFT, content on RIGHT<br/>
          • All sections should show their highlight points as bullet lists<br/>
          • Section 6 has no highlight points (should not break)
        </div>
      </div>

      {/* Test 1: Normal Layout (Boolean false) */}
      <FullOneByTwoSection data={testData1} />

      {/* Test 2: Reverse Layout (Boolean true) */}
      <FullOneByTwoSection data={testData2} />

      {/* Test 3: Reverse Layout (String "1") */}
      <FullOneByTwoSection data={testData3} />

      {/* Test 4: Reverse Layout (Number 1) */}
      <FullOneByTwoSection data={testData4} />

      {/* Test 5: Reverse Layout (String "true") */}
      <FullOneByTwoSection data={testData5} />

      {/* Test 6: No Highlight Points */}
      <FullOneByTwoSection data={testData6} />

      <div style={{ padding: '2rem', backgroundColor: '#f5f5f5', textAlign: 'center' }}>
        <h2 style={{ color: '#333', marginBottom: '1rem' }}>Test Results</h2>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          If the fixes are working correctly, you should see:
        </p>
        <ul style={{ color: '#666', textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li><strong>Section 1:</strong> Content left, image right (normal layout)</li>
          <li><strong>Sections 2-5:</strong> Image left, content right (reverse layout)</li>
          <li><strong>All sections 1-5:</strong> Bullet points visible under &quot;Key Features&quot;, &quot;Benefits&quot;, etc.</li>
          <li><strong>Section 6:</strong> No bullet points section (should not break layout)</li>
        </ul>
      </div>
    </div>
  );
};

export default TestFullOneByTwoFixedPage;