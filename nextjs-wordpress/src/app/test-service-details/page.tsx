'use client';

import React from 'react';
import ServiceDetailsSection from '@/components/blocks/service-details-section/ServiceDetailsSection';

// Build-safe: all test pages are force-dynamic
export const dynamic = 'force-dynamic';

export default function TestServiceDetailsPage() {
  const testData = {
    data: {
      background_color: '#f8f9fa',
      heading: 'What We Mean by Solutions',
      sub_heading: 'We bring you powerful advantages to navigate your digital transformation',
      grid_columns: '3' as const,
      services: [
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/007cba/ffffff?text=AI',
            alt: 'Data Science & AI'
          },
          service_title: 'Data Science & AI',
          service_description: '• AI/ML models\n• Computer vision\n• Predictive analytics\n• Data visualization',
          service_link: '#'
        },
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/28a745/ffffff?text=DE',
            alt: 'Data Engineering'
          },
          service_title: 'Data Engineering',
          service_description: '• Cloud data pipelines\n• Modern data platforms\n• Real-time analytics',
          service_link: '#'
        },
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/ffc107/000000?text=DO',
            alt: 'DevOps & Cloud Engineering'
          },
          service_title: 'DevOps & Cloud Engineering',
          service_description: '• CI/CD\n• Cloud migration\n• Infrastructure automation',
          service_link: '#'
        },
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/17a2b8/ffffff?text=SP',
            alt: 'SharePoint & Enterprise Collaboration'
          },
          service_title: 'SharePoint & Enterprise Collaboration',
          service_description: '• Intranets\n• Workflow automation\n• Knowledge management',
          service_link: '#'
        },
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/6f42c1/ffffff?text=MD',
            alt: 'Microsoft Dynamics'
          },
          service_title: 'Microsoft Dynamics',
          service_description: '• Dynamics 365 implementation\n• ERP/CRM implementation',
          service_link: '#'
        },
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/20c997/ffffff?text=SF',
            alt: 'Salesforce'
          },
          service_title: 'Salesforce',
          service_description: '• CRM implementation\n• Marketing Cloud\n• Sales automation',
          service_link: '#'
        }
      ]
    }
  };

  return (
    <div className="test-page">
      <div style={{ padding: '20px', backgroundColor: '#fff' }}>
        <h1>Service Details Section Test</h1>
        <p>Testing the Service Details Section block with sample data.</p>
      </div>
      
      <ServiceDetailsSection {...testData} />
      
      {/* Test with different background */}
      <ServiceDetailsSection 
        data={{
          ...testData.data,
          background_color: "#1a1a1a",
          heading: "Dark Background Test",
          sub_heading: "Testing with dark background color",
          grid_columns: "2"
        }}
      />
      
      {/* Test with 4 columns */}
      <ServiceDetailsSection 
        data={{
          ...testData.data,
          background_color: "#e3f2fd",
          heading: "4 Column Layout Test",
          sub_heading: "Testing with 4 columns layout",
          grid_columns: "4"
        }}
      />
    </div>
  );
}