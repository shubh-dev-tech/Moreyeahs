import React from 'react';
import { FullWidthLeftTextSection } from '@/components/blocks/FullWidthLeftTextSection';

export default function TestFullWidthManualPage() {
  // Test data for normal layout
  const normalLayoutData = {
    heading: "Digital Operating Model",
    sub_heading: "for the AI first Enterprise",
    button_text: "Explore",
    button_url: "#",
    heading_bottom_1st: "A transformation story of BASF Agricultural Solutions to achieve faster time-to-market using DevOps and DataOps",
    title_bottom_1st: "A transformation story of BASF Agricultural Solutions to achieve faster time-to-market using DevOps and DataOps",
    url_text: "View",
    url_link: "#",
    heading_bottom_2nd: "NN Life Insurance Company Partners with Infosys for its Cloud and Agile Transformation",
    title_bottom_2nd: "Partners with Infosys for its Cloud and Agile Transformation",
    url_title_2nd: "View",
    url_link_2nd: "#",
    right_image: {
      url: "https://via.placeholder.com/600x400/0066cc/ffffff?text=Normal+Layout",
      alt: "Normal layout test image",
      width: 600,
      height: 400
    },
    reverse_layout: false,
    background_color: "#b8860b"
  };

  // Test data for reversed layout
  const reversedLayoutData = {
    heading: "Digital Operating Model",
    sub_heading: "for the AI first Enterprise",
    button_text: "Explore",
    button_url: "#",
    heading_bottom_1st: "A transformation story of BASF Agricultural Solutions to achieve faster time-to-market using DevOps and DataOps",
    title_bottom_1st: "A transformation story of BASF Agricultural Solutions to achieve faster time-to-market using DevOps and DataOps",
    url_text: "View",
    url_link: "#",
    heading_bottom_2nd: "NN Life Insurance Company Partners with Infosys for its Cloud and Agile Transformation",
    title_bottom_2nd: "Partners with Infosys for its Cloud and Agile Transformation",
    url_title_2nd: "View",
    url_link_2nd: "#",
    right_image: {
      url: "https://via.placeholder.com/600x400/cc6600/ffffff?text=Reversed+Layout",
      alt: "Reversed layout test image",
      width: 600,
      height: 400
    },
    reverse_layout: true,
    background_color: "#b8860b"
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center', padding: '20px', fontSize: '2rem', backgroundColor: '#f5f5f5' }}>
        Full Width Left Text Section - Manual Test
      </h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ textAlign: 'center', padding: '20px', fontSize: '1.5rem', color: '#666' }}>
          Normal Layout (Content Left, Image Right) - reverse_layout: false
        </h2>
        <FullWidthLeftTextSection data={normalLayoutData} />
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ textAlign: 'center', padding: '20px', fontSize: '1.5rem', color: '#666' }}>
          Reversed Layout (Image Left, Content Right) - reverse_layout: true
        </h2>
        <FullWidthLeftTextSection data={reversedLayoutData} />
      </div>
    </div>
  );
}