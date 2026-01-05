'use client';

import React from 'react';
import EnhancedServiceDetailsSection from '@/components/blocks/service-details-section/EnhancedServiceDetailsSection';
import { SERVICE_TEMPLATES } from '@/components/blocks/service-details-section/ServiceTemplates';

// Build-safe: all test pages are force-dynamic
export const dynamic = 'force-dynamic';

export default function TestEnhancedServicesPage() {
  // Test data with all the enhanced features
  const enhancedTestData = {
    data: {
      background_color: '#f8f9fa',
      heading: 'Our Complete Service Portfolio',
      sub_heading: 'Comprehensive solutions across technology, business, and enterprise domains',
      show_categories: true,
      sort_by: 'priority' as const,
      services: [
        // Featured Technical Service
        {
          service_category: 'technical',
          service_icon: {
            url: 'https://via.placeholder.com/64x64/007cba/ffffff?text=AI',
            alt: 'Data Science & AI'
          },
          service_icon_color: '#007cba',
          service_title: 'Data Science & AI',
          service_subtitle: 'Advanced Analytics Solutions',
          service_description_type: 'bullet_list' as const,
          service_description: '• Machine Learning models\n• Computer vision systems\n• Predictive analytics\n• Data visualization dashboards\n• Natural language processing',
          service_link: '#data-science',
          service_link_text: 'Explore AI Solutions',
          service_priority: '4',
          service_status: 'featured' as const
        },
        // Business Service with Features
        {
          service_category: 'business',
          service_icon: {
            url: 'https://via.placeholder.com/64x64/28a745/ffffff?text=UX',
            alt: 'UI/UX Design'
          },
          service_title: 'UI/UX Design',
          service_subtitle: 'User-Centered Design Excellence',
          service_description_type: 'features' as const,
          service_features: [
            { feature_text: 'User research & personas' },
            { feature_text: 'Wireframing & prototyping' },
            { feature_text: 'Visual design systems' },
            { feature_text: 'Usability testing' },
            { feature_text: 'Conversion optimization' }
          ],
          service_link: '#design',
          service_link_text: 'View Design Portfolio',
          service_priority: '3',
          service_status: 'active' as const
        },
        // Coming Soon Service
        {
          service_category: 'technical',
          service_icon: {
            url: 'https://via.placeholder.com/64x64/6f42c1/ffffff?text=QC',
            alt: 'Quantum Computing'
          },
          service_title: 'Quantum Computing',
          service_subtitle: 'Next-Generation Computing Power',
          service_description_type: 'paragraph' as const,
          service_description: 'Revolutionary quantum computing solutions for complex optimization problems, cryptography, and scientific simulations. Our quantum-ready algorithms prepare your business for the quantum advantage.',
          service_priority: '4',
          service_status: 'coming_soon' as const
        },
        // Enterprise Service
        {
          service_category: 'enterprise',
          service_icon: {
            url: 'https://via.placeholder.com/64x64/17a2b8/ffffff?text=SP',
            alt: 'SharePoint'
          },
          service_title: 'SharePoint & Collaboration',
          service_subtitle: 'Modern Workplace Solutions',
          service_description_type: 'bullet_list' as const,
          service_description: '• Modern intranet design\n• Workflow automation\n• Document management\n• Teams integration\n• Knowledge bases',
          service_link: '#sharepoint',
          service_priority: '3',
          service_status: 'active' as const
        },
        // Legacy Service
        {
          service_category: 'enterprise',
          service_icon: {
            url: 'https://via.placeholder.com/64x64/6c757d/ffffff?text=AS',
            alt: 'Legacy Systems'
          },
          service_title: 'Legacy System Support',
          service_subtitle: 'Maintaining Critical Infrastructure',
          service_description_type: 'bullet_list' as const,
          service_description: '• System maintenance\n• Security updates\n• Performance optimization\n• Migration planning\n• End-of-life support',
          service_priority: '1',
          service_status: 'legacy' as const
        },
        // Additional services for category testing
        {
          service_category: 'business',
          service_icon: {
            url: 'https://via.placeholder.com/64x64/ffc107/000000?text=DM',
            alt: 'Digital Marketing'
          },
          service_title: 'Digital Marketing',
          service_subtitle: 'Growth-Driven Strategies',
          service_description_type: 'bullet_list' as const,
          service_description: '• SEO optimization\n• PPC campaigns\n• Social media marketing\n• Content strategy\n• Analytics & reporting',
          service_link: '#marketing',
          service_priority: '3',
          service_status: 'active' as const
        }
      ]
    }
  };

  // Template-based test data
  const templateTestData = {
    data: {
      background_color: '#1a1a1a',
      heading: 'Technology Services Template',
      sub_heading: 'Pre-configured services using our template system',
      show_categories: false,
      sort_by: 'priority' as const,
      services: SERVICE_TEMPLATES.tech_services.map((template, index) => ({
        ...template,
        service_icon: {
          url: `https://via.placeholder.com/64x64/007cba/ffffff?text=${template.service_title.charAt(0)}`,
          alt: template.service_title
        },
        service_link: `#${template.service_title.toLowerCase().replace(/\s+/g, '-')}`,
        service_link_text: 'Learn More'
      }))
    }
  };

  return (
    <div className="test-page">
      <div style={{ padding: '20px', backgroundColor: '#fff' }}>
        <h1>Enhanced Service Details Section Test</h1>
        <p>Testing all the enhanced features including categories, priorities, status badges, and different content types.</p>
      </div>
      
      {/* Enhanced Features Test */}
      <EnhancedServiceDetailsSection {...enhancedTestData} />
      
      {/* Template-based Test */}
      <EnhancedServiceDetailsSection {...templateTestData} />
      
      {/* 4-Column Layout Test */}
      <EnhancedServiceDetailsSection 
        data={{
          ...enhancedTestData.data,
          background_color: "#e3f2fd",
          heading: "4-Column Layout Test",
          sub_heading: "Testing maximum column layout with category filtering",
          grid_columns: "4",
          show_categories: true,
          sort_by: "category"
        }}
      />

      {/* Minimal Configuration Test */}
      <EnhancedServiceDetailsSection 
        data={{
          background_color: "#fff",
          heading: "Minimal Configuration",
          sub_heading: "Basic setup with just essential services",
          show_categories: false,
          sort_by: "order",
          grid_columns: "2",
          services: [
            {
              service_category: 'technical',
              service_icon: {
                url: 'https://via.placeholder.com/64x64/007cba/ffffff?text=WD',
                alt: 'Web Development'
              },
              service_title: 'Web Development',
              service_description_type: 'paragraph' as const,
              service_description: 'Custom web applications built with modern technologies and best practices.',
              service_priority: '2',
              service_status: 'active' as const
            },
            {
              service_category: 'business',
              service_icon: {
                url: 'https://via.placeholder.com/64x64/28a745/ffffff?text=CO',
                alt: 'Consulting'
              },
              service_title: 'Technology Consulting',
              service_description_type: 'paragraph' as const,
              service_description: 'Strategic technology guidance to help your business make informed decisions.',
              service_priority: '2',
              service_status: 'active' as const
            }
          ]
        }}
      />
    </div>
  );
}