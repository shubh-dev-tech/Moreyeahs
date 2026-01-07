'use client';

import React from 'react';
import FooterSection from './FooterSection';

// Sample data that matches the design from your image
const sampleFooterData = {
  logo: {
    url: '/images/moreyeahs-logo.png', // Replace with your actual logo path
    alt: 'MoreYeahs Logo'
  },
  company_description: 'We are committed to making meaningful contributions to the environment and society. As a global technology leader, MoreYeahs aims to automate digital literacy and foster sustainable, self-sufficient communities.',
  
  // Company column
  company_columns: [
    {
      title: '',
      links: [
        { label: 'About us', url: '/about' },
        { label: 'Case Study', url: '/case-studies' },
        { label: 'Blog', url: '/blog' }
      ]
    }
  ],
  
  // About column
  about_columns: [
    {
      title: '',
      links: [
        { label: 'About Us', url: '/about' },
        { label: 'Culture', url: '/culture' }
      ]
    }
  ],
  
  // Career column
  career_columns: [
    {
      title: '',
      links: [
        { label: 'Apply Now', url: '/careers' }
      ]
    }
  ],
  
  // Services column
  services_columns: [
    {
      title: '',
      links: [
        { label: 'Data Science & AI', url: '/services/data-science' },
        { label: 'Data Engineering', url: '/services/data-engineering' },
        { label: 'DevOps', url: '/services/devops' },
        { label: 'Dynamics', url: '/services/dynamics' }
      ]
    }
  ],
  
  // Social links
  social_links: [
    { platform: 'linkedin' as const, url: 'https://linkedin.com/company/moreyeahs' },
    { platform: 'twitter' as const, url: 'https://twitter.com/moreyeahs' },
    { platform: 'facebook' as const, url: 'https://facebook.com/moreyeahs' },
    { platform: 'instagram' as const, url: 'https://instagram.com/moreyeahs' },
    { platform: 'youtube' as const, url: 'https://youtube.com/moreyeahs' }
  ],
  
  follow_us_text: 'Follow Us',
  copyright_text: '© 2025MoreYeahs. All rights reserved.',
  
  privacy_policy_link: {
    label: 'Privacy Policy',
    url: '/privacy-policy',
    target: '_self' as const
  },
  
  terms_of_use_link: {
    label: 'Terms of Use',
    url: '/terms-of-use',
    target: '_self' as const
  },
  
  // Styling
  background_color: '#f8f9fa',
  text_color: '#333333',
  link_color: '#666666',
  link_hover_color: '#000000'
};

const FooterDemo: React.FC = () => {
  return (
    <div className="footer-demo">
      <h2>Footer Section Demo</h2>
      <p>This is how your footer will look with the sample data:</p>
      <FooterSection data={sampleFooterData} />
    </div>
  );
};

export default FooterDemo;