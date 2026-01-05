'use client';

import React from 'react';
import FullOneByTwoSection from '@/components/blocks/full-one-by-two-section/FullOneByTwoSection';

const SimpleHighlightTestPage = () => {
  // Very simple test data
  const testData = {
    heading: "Simple Test",
    highlight_points: [
      { point_text: "Test point 1" },
      { point_text: "Test point 2" }
    ],
    main_image: {
      url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Test image"
    }
  };

  return (
    <div>
      <h1>Simple Highlight Test</h1>
      <FullOneByTwoSection data={testData} />
    </div>
  );
};

export default SimpleHighlightTestPage;