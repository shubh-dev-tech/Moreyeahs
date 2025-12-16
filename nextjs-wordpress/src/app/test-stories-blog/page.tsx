'use client';

import React from 'react';
import { StoriesBlogBlock } from '@/components/blocks/stories-blog-block';

export default function TestStoriesBlogPage() {
  const testData = {
    heading: 'Success Stories',
    subheading: 'Your partner through complexities of Agile and DevOps transformation',
    post_type: 'posts',
    category: '',
    button_text: 'Show More',
    button_url: '/posts'
  };

  return (
    <div className="test-page">
      <div style={{ padding: '20px', background: '#f5f5f5', marginBottom: '20px' }}>
        <h1>Stories & Blog Block Test</h1>
        <p>This page demonstrates the Stories & Blog block component.</p>
        <p><strong>Features:</strong></p>
        <ul>
          <li>✅ Dynamic post type selection (fetched from WordPress API)</li>
          <li>✅ Dynamic category filtering with dropdown</li>
          <li>✅ Latest 4 posts display</li>
          <li>✅ Custom heading and subheading</li>
          <li>✅ Custom CTA button</li>
          <li>✅ Responsive design with hover effects</li>
        </ul>
        <p><strong>Note:</strong> Post types and categories are now fetched dynamically from WordPress REST API!</p>
      </div>
      
      <StoriesBlogBlock data={testData} />
    </div>
  );
}