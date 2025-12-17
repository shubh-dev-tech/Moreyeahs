import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the client component with no SSR
const StoriesBlogBlockClient = dynamic(
  () => import('./StoriesBlogBlock'),
  { 
    ssr: false,
    loading: () => (
      <div className="stories-blog-block-loading">
        <div style={{ 
          padding: '80px 20px', 
          textAlign: 'center', 
          background: 'linear-gradient(135deg, #4a148c 0%, #6a1b9a 100%)',
          color: 'white',
          borderRadius: '12px'
        }}>
          <h2>Loading Stories & Blog...</h2>
          <p>Fetching dynamic content...</p>
        </div>
      </div>
    )
  }
);

interface StoriesBlogBlockWrapperProps {
  data?: {
    heading?: string;
    subheading?: string;
    post_type?: string;
    category?: string;
    button_text?: string;
    button_url?: string;
    background_color?: string;
    background_image?: string;
  };
}

export default function StoriesBlogBlockWrapper({ data }: StoriesBlogBlockWrapperProps) {
  return <StoriesBlogBlockClient data={data || {}} />;
}