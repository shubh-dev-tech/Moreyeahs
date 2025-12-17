'use client';

import React from 'react';
import { createRoot } from 'react-dom/client';
import StoriesBlogBlock from './StoriesBlogBlock';

// Client-side renderer for WordPress integration
export function initializeStoriesBlogBlocks() {
  if (typeof window === 'undefined') return;

  const elements = document.querySelectorAll('.stories-blog-block-data');
  
  elements.forEach((element) => {
    // Get data from data attributes
    const data = {
      heading: element.getAttribute('data-heading') || 'Success Stories',
      subheading: element.getAttribute('data-subheading') || 'Your partner through complexities of Agile and DevOps transformation',
      post_type: element.getAttribute('data-post-type') || 'post',
      category: element.getAttribute('data-category') || '',
      button_text: element.getAttribute('data-button-text') || 'Show More',
      button_url: element.getAttribute('data-button-url') || '#',
      background_color: element.getAttribute('data-background-color') || '#4a148c',
      background_image: element.getAttribute('data-background-image') || ''
    };

    // Create React root and render component
    const root = createRoot(element);
    root.render(<StoriesBlogBlock data={data} />);
  });
}

// Auto-initialize when DOM is ready
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeStoriesBlogBlocks);
  } else {
    initializeStoriesBlogBlocks();
  }
}