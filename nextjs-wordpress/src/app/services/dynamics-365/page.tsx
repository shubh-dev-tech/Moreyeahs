import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';

export const metadata: Metadata = {
  title: 'Microsoft Dynamics 365 Services | MoreYeahs',
  description: 'Professional Microsoft Dynamics 365 implementation, customization, and support services to streamline your business operations.',
};

async function getDynamics365PageData() {
  try {
    // Try to fetch a specific Dynamics 365 page from WordPress using standard endpoint
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages?slug=dynamics-365`);
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    // If no specific page exists, return null to show default content
    return null;
  } catch (error) {
    console.error('Error fetching Dynamics 365 page:', error);
    return null;
  }
}

export default async function Dynamics365Page() {
  const pageData = await getDynamics365PageData();

  if (pageData) {
    // If WordPress page exists, render it with blocks
    return (
      <div className="dynamics-365-page">
        <div className="mx-auto px-4 py-8">
          <div 
            className="content mb-8"
            dangerouslySetInnerHTML={{ 
              __html: sanitizeWordPressContent(pageData.content.rendered)
            }}
          />
          {pageData.acf && pageData.acf.blocks && (
            <BlockRenderer blocks={pageData.acf.blocks} />
          )}
        </div>
      </div>
    );
  }

  // Default Dynamics 365 page content
  return (
    <div className="dynamics-365-page">
      <div className="mx-auto px-4 py-8">
        <div className="hero-section mb-12">
          <h1 className="text-4xl font-bold mb-6">Microsoft Dynamics 365 Services</h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your business operations with our comprehensive Microsoft Dynamics 365 
            implementation, customization, and support services.
          </p>
        </div>

        <div className="services-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Implementation</h3>
            <p className="text-gray-600">
              Full-scale Dynamics 365 implementation tailored to your business needs, 
              from planning to go-live support.
            </p>
          </div>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Customization</h3>
            <p className="text-gray-600">
              Custom workflows, forms, and integrations to maximize your Dynamics 365 
              investment and business efficiency.
            </p>
          </div>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Migration</h3>
            <p className="text-gray-600">
              Seamless data migration from legacy systems to Dynamics 365 with 
              minimal downtime and data integrity.
            </p>
          </div>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Training & Support</h3>
            <p className="text-gray-600">
              Comprehensive user training and ongoing support to ensure your team 
              maximizes Dynamics 365 capabilities.
            </p>
          </div>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Integration</h3>
            <p className="text-gray-600">
              Connect Dynamics 365 with your existing systems and third-party 
              applications for unified business operations.
            </p>
          </div>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Optimization</h3>
            <p className="text-gray-600">
              Performance tuning and process optimization to ensure your Dynamics 365 
              environment runs at peak efficiency.
            </p>
          </div>
        </div>

        <div className="cta-section text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Transform Your Business?</h2>
          <p className="text-gray-600 mb-6">
            Let our Dynamics 365 experts help you streamline operations and drive growth.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started Today
          </a>
        </div>
      </div>
    </div>
  );
}