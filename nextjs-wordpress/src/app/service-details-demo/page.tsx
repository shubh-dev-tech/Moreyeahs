'use client';

import React from 'react';
import ServiceDetailsSection from '@/components/blocks/service-details-section/ServiceDetailsSection';

// Build-safe: all test pages are force-dynamic
export const dynamic = 'force-dynamic';

export default function ServiceDetailsDemoPage() {
  // Professional demo data that matches the design you showed
  const professionalDemoData = {
    data: {
      background_color: '#f8f9fa',
      heading: 'What We Mean by Solutions',
      sub_heading: 'We bring you powerful advantages to navigate your digital transformation',
      grid_columns: '3' as const,
      services: [
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/007cba/ffffff?text=🔬',
            alt: 'Data Science & AI'
          },
          service_title: 'Data Science & AI',
          service_description: '• AI/ML models\n• Computer vision\n• Predictive analytics\n• Data visualization',
          service_link: '#data-science'
        },
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/28a745/ffffff?text=⚙️',
            alt: 'Data Engineering'
          },
          service_title: 'Data Engineering',
          service_description: '• Cloud data pipelines\n• Modern data platforms\n• Real-time analytics',
          service_link: '#data-engineering'
        },
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/ffc107/000000?text=☁️',
            alt: 'DevOps & Cloud Engineering'
          },
          service_title: 'DevOps & Cloud Engineering',
          service_description: '• CI/CD\n• Cloud migration\n• Infrastructure automation',
          service_link: '#devops'
        },
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/17a2b8/ffffff?text=📊',
            alt: 'SharePoint & Enterprise Collaboration'
          },
          service_title: 'SharePoint & Enterprise Collaboration',
          service_description: '• Intranets\n• Workflow automation\n• Knowledge management',
          service_link: '#sharepoint'
        },
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/6f42c1/ffffff?text=💼',
            alt: 'Microsoft Dynamics'
          },
          service_title: 'Microsoft Dynamics',
          service_description: '• Dynamics 365 implementation\n• ERP/CRM implementation',
          service_link: '#dynamics'
        },
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/20c997/ffffff?text=⚡',
            alt: 'Salesforce'
          },
          service_title: 'Salesforce',
          service_description: '• CRM implementation\n• Marketing Cloud\n• Sales automation',
          service_link: '#salesforce'
        },
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/dc3545/ffffff?text=💻',
            alt: 'Full Stack Development'
          },
          service_title: 'Full Stack Development',
          service_description: '• End-to-end development\n• Scalable architectures\n• Secure integrations',
          service_link: '#fullstack'
        },
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/fd7e14/ffffff?text=🎨',
            alt: 'UI/UX Design'
          },
          service_title: 'UI/UX Design',
          service_description: '• User-centered design\n• Intuitive interfaces\n• Conversion-focused UX',
          service_link: '#design'
        },
        {
          service_icon: {
            url: 'https://via.placeholder.com/64x64/e83e8c/ffffff?text=📈',
            alt: 'Digital Marketing'
          },
          service_title: 'Digital Marketing',
          service_description: '• Performance marketing\n• SEO-driven growth\n• Data-backed campaigns',
          service_link: '#marketing'
        }
      ]
    }
  };

  return (
    <div className="demo-page">
      {/* Header */}
      <div style={{ 
        padding: '40px 20px', 
        backgroundColor: '#fff', 
        textAlign: 'center',
        borderBottom: '1px solid #eee'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: '600', 
          color: '#333', 
          marginBottom: '15px' 
        }}>
          Service Details Section Demo
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#666', 
          maxWidth: '600px', 
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          This is how your Service Details Section should look with proper content. 
          The block is working correctly - you just need to add better content in WordPress.
        </p>
      </div>
      
      {/* Professional Demo */}
      <ServiceDetailsSection {...professionalDemoData} />
      
      {/* 2-Column Layout */}
      <ServiceDetailsSection 
        data={{
          ...professionalDemoData.data,
          background_color: "#ffffff",
          heading: "2-Column Layout Example",
          sub_heading: "Perfect for highlighting key services",
          grid_columns: "2",
          services: professionalDemoData.data.services.slice(0, 4)
        }}
      />
      
      {/* 4-Column Layout */}
      <ServiceDetailsSection 
        data={{
          ...professionalDemoData.data,
          background_color: "#1a1a1a",
          heading: "4-Column Layout Example",
          sub_heading: "Maximum density for comprehensive service listings",
          grid_columns: "4",
          services: professionalDemoData.data.services.slice(0, 8)
        }}
      />

      {/* Instructions */}
      <div style={{ 
        padding: '60px 20px', 
        backgroundColor: '#f8f9fa', 
        textAlign: 'center' 
      }}>
        <h2 style={{ 
          fontSize: '2rem', 
          fontWeight: '600', 
          color: '#333', 
          marginBottom: '20px' 
        }}>
          How to Get This Look
        </h2>
        <div style={{ 
          maxWidth: '800px', 
          margin: '0 auto', 
          textAlign: 'left' 
        }}>
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '30px', 
            borderRadius: '12px', 
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)' 
          }}>
            <h3 style={{ color: '#007cba', marginBottom: '15px' }}>In WordPress Admin:</h3>
            <ol style={{ lineHeight: '1.8', color: '#666' }}>
              <li><strong>Edit your page</strong> and add the &quot;Service Details Section&quot; block</li>
              <li><strong>Set the heading</strong> to &quot;What We Mean by Solutions&quot;</li>
              <li><strong>Set the sub-heading</strong> to your descriptive text</li>
              <li><strong>Add services</strong> using the repeater field:
                <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
                  <li>Upload professional icons (64x64px recommended)</li>
                  <li>Add compelling service titles</li>
                  <li>Write bullet-point descriptions (start lines with •)</li>
                  <li>Add service links if needed</li>
                </ul>
              </li>
              <li><strong>Choose grid columns</strong> (2, 3, or 4 based on your needs)</li>
              <li><strong>Set background color</strong> and optional background image</li>
            </ol>
            
            <div style={{ 
              marginTop: '25px', 
              padding: '20px', 
              backgroundColor: '#e3f2fd', 
              borderRadius: '8px',
              borderLeft: '4px solid #007cba'
            }}>
              <h4 style={{ color: '#007cba', marginBottom: '10px' }}>💡 Pro Tip:</h4>
              <p style={{ color: '#666', margin: '0', fontSize: '0.95rem' }}>
                The block is working perfectly! What you&apos;re seeing with &quot;test&quot; data is just placeholder content. 
                Replace it with professional service descriptions and icons to get the polished look shown above.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}