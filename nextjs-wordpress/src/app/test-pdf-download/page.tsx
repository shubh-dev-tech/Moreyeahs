'use client';

import React from 'react';
import CaseStudyTemplatePage from '../../components/case-study/CaseStudyTemplatePage';

// Mock case study data for testing
const mockCaseStudy = {
  id: 1,
  title: {
    rendered: 'Test Case Study - PDF Download Demo'
  },
  acf_fields: {
    header_section: {
      logo: {
        url: '/images/logo.png',
        alt: 'Company Logo'
      },
      title: 'Digital Transformation Success Story',
      subtitle: 'How we helped a Fortune 500 company modernize their infrastructure',
      dynamic_heading: 'The Challenge & Our Solution',
      background_image: {
        url: '/images/header-bg.jpg',
        alt: 'Header Background'
      },
      gradient_colors: {
        color_1: '#00bcd4',
        color_2: '#9c27b0'
      }
    },
    sidebar_section: {
      sidebar_sections: [
        {
          section_title: 'Project Details',
          section_items: [
            { item_text: '<strong>Duration:</strong> 6 months' },
            { item_text: '<strong>Team Size:</strong> 12 developers' },
            { item_text: '<strong>Technology:</strong> React, Node.js, AWS' }
          ]
        },
        {
          section_title: 'Key Metrics',
          section_items: [
            { item_text: '<strong>Performance:</strong> 40% improvement' },
            { item_text: '<strong>Cost Savings:</strong> $2M annually' },
            { item_text: '<strong>User Satisfaction:</strong> 95%' }
          ]
        }
      ]
    },
    client_section: {
      client_image: {
        url: '/images/client-avatar.jpg',
        alt: 'Client Photo'
      },
      client_name: 'John Smith',
      client_designation: 'CTO',
      client_company: 'TechCorp Inc.',
      client_content: 'Working with this team was exceptional. They delivered beyond our expectations.'
    },
    content_sections: [
      {
        section_icon: {
          url: '/images/challenge-icon.svg',
          alt: 'Challenge Icon'
        },
        section_title: 'The Challenge',
        icon_color: '#e91e63',
        section_content: '<p>Our client faced significant challenges with their legacy infrastructure. The system was outdated, slow, and couldn&apos;t handle the growing user base.</p><p>Key issues included:</p><ul><li>Poor performance during peak hours</li><li>Frequent system downtime</li><li>Difficulty scaling resources</li><li>High maintenance costs</li></ul>',
        section_quotes: [
          { quote_text: 'We needed a solution that could grow with our business and provide reliable performance.' }
        ]
      },
      {
        section_icon: {
          url: '/images/solution-icon.svg',
          alt: 'Solution Icon'
        },
        section_title: 'Our Solution',
        icon_color: '#2196f3',
        section_content: '<p>We implemented a comprehensive cloud migration strategy using modern technologies and best practices.</p><p>Our approach included:</p>',
        section_bullet_points: [
          { bullet_text: 'Migrated to AWS cloud infrastructure' },
          { bullet_text: 'Implemented microservices architecture' },
          { bullet_text: 'Set up automated CI/CD pipelines' },
          { bullet_text: 'Enhanced security and monitoring' }
        ]
      },
      {
        section_icon: {
          url: '/images/results-icon.svg',
          alt: 'Results Icon'
        },
        section_title: 'Results & Impact',
        icon_color: '#4caf50',
        section_content: '<p>The transformation delivered exceptional results that exceeded all expectations.</p><p>Within 3 months of deployment, the client saw:</p><ul><li>40% improvement in application performance</li><li>99.9% uptime reliability</li><li>50% reduction in infrastructure costs</li><li>Seamless scaling during traffic spikes</li></ul>'
      }
    ],
    testimonial_quote: {
      quote_text: 'This project transformed our entire business. The new system is fast, reliable, and has enabled us to scale like never before.',
      quote_author: 'John Smith, CTO at TechCorp Inc.'
    },
    cta_section: {
      cta_title: 'Ready to Transform Your Business?',
      cta_content: 'Let us help you achieve similar results with our proven expertise and cutting-edge solutions.',
      cta_buttons: [
        {
          button_text: 'Get Started Today',
          button_url: '/contact',
          button_style: 'primary' as const
        },
        {
          button_text: 'View More Case Studies',
          button_url: '/case-studies',
          button_style: 'secondary' as const
        }
      ]
    }
  }
};

export default function TestPDFDownloadPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#ffffff' }}>
      <div style={{ 
        padding: '20px', 
        textAlign: 'center', 
        background: '#f8f9fa', 
        borderBottom: '1px solid #dee2e6' 
      }}>
        <h1 style={{ margin: '0 0 10px 0', color: '#333' }}>
          PDF Download Test Page
        </h1>
        <p style={{ margin: 0, color: '#666' }}>
          This is a test page to demonstrate the PDF download functionality. 
          Click the &quot;Download as PDF&quot; button in the sidebar to generate a PDF of the case study.
        </p>
      </div>
      
      <CaseStudyTemplatePage caseStudy={mockCaseStudy} />
    </div>
  );
}