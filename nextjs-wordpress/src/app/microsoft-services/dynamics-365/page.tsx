import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('dynamics-365');
}

async function getDynamics365PageData() {
  try {
    // Try to fetch the Microsoft Services Dynamics 365 page from WordPress
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=dynamics-365&parent=microsoft-services`,
      { next: { revalidate: 60 } }
    );
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    // Fallback: try without parent filter
    const fallbackResponse = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=dynamics-365`,
      { next: { revalidate: 60 } }
    );
    
    if (fallbackResponse.ok) {
      const pages = await fallbackResponse.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Dynamics 365 page:', error);
    return null;
  }
}

export default async function MicrosoftDynamics365Page() {
  const pageData = await getDynamics365PageData();

  if (pageData) {
    // First check if we have blocks from the custom endpoint
    if (pageData.blocks && Array.isArray(pageData.blocks) && pageData.blocks.length > 0) {
      return (
        <main className="min-h-screen">
          <BlockRenderer blocks={pageData.blocks} />
        </main>
      );
    }

    // Parse blocks from content if available
    const blocks = parseBlocks(pageData.content?.rendered || '') || [];

    // If we have parsed blocks, render them with BlockRenderer
    if (blocks && blocks.length > 0) {
      return (
        <main className="min-h-screen">
          <BlockRenderer blocks={blocks} />
        </main>
      );
    }

    // If no blocks but we have content, render with WordPressContent
    if (pageData.content?.rendered) {
      return (
        <main className="min-h-screen">
          <WordPressContent content={pageData.content.rendered} />
        </main>
      );
    }

    // If WordPress page exists but has no content, render with ACF blocks if available
    if (pageData.acf && pageData.acf.blocks) {
      return (
        <main className="min-h-screen">
          <div className="microsoft-dynamics-365-page">
            <div className="mx-auto px-4 py-8">
              <div className="blocks">
                <BlockRenderer blocks={pageData.acf.blocks} />
              </div>
            </div>
          </div>
        </main>
      );
    }
  }

  // Default content if no WordPress page exists
  return (
    <main className="min-h-screen">
      <div className="microsoft-dynamics-365-page">
        <div className="mx-auto px-4 py-8">
        <div className="hero-section mb-12">
          <h1 className="text-4xl font-bold mb-6">Dynamics 365</h1>
          <div className="bg-cyan-400 p-8 rounded-lg text-white mb-8">
            <h2 className="text-3xl font-bold mb-4">Dynamics 365</h2>
            <p className="text-lg">
              We design and implement Dynamics 365 solutions that unify your sales, service, 
              finance, operations, and marketing workflows into a single connected system. 
              Our platforms help organizations eliminate data silos, automate business 
              processes, and gain real-time insights across all departments.
            </p>
          </div>
        </div>

        <div className="services-section mb-12">
          <h2 className="text-3xl font-bold mb-8">Our Dynamics 365 Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Sales & CRM</h3>
              <p className="text-gray-600">
                Empower your sales team with intelligent CRM tools that track customer 
                interactions, automate workflows, and provide actionable insights.
              </p>
            </div>

            <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Customer Service</h3>
              <p className="text-gray-600">
                Deliver exceptional customer experiences with omnichannel support, 
                case management, and AI-powered service insights.
              </p>
            </div>

            <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Finance & Operations</h3>
              <p className="text-gray-600">
                Streamline financial management, supply chain, and manufacturing 
                operations with integrated ERP capabilities.
              </p>
            </div>

            <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Marketing Automation</h3>
              <p className="text-gray-600">
                Create personalized customer journeys, automate campaigns, and 
                measure marketing ROI with advanced analytics.
              </p>
            </div>

            <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Business Central</h3>
              <p className="text-gray-600">
                All-in-one business management solution for small to medium-sized 
                businesses, connecting financials, sales, and operations.
              </p>
            </div>

            <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Power Platform Integration</h3>
              <p className="text-gray-600">
                Extend Dynamics 365 with Power Apps, Power Automate, and Power BI 
                for custom solutions and advanced analytics.
              </p>
            </div>
          </div>
        </div>

        <div className="benefits-section mb-12">
          <h2 className="text-3xl font-bold mb-8">Why Choose Our Dynamics 365 Services?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="benefit-item flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                ✓
              </div>
              <div>
                <h4 className="font-semibold mb-2">Certified Experts</h4>
                <p className="text-gray-600">
                  Our team holds Microsoft certifications and has extensive experience 
                  implementing Dynamics 365 across various industries.
                </p>
              </div>
            </div>

            <div className="benefit-item flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                ✓
              </div>
              <div>
                <h4 className="font-semibold mb-2">End-to-End Implementation</h4>
                <p className="text-gray-600">
                  From requirements gathering to deployment and training, we handle 
                  every aspect of your Dynamics 365 journey.
                </p>
              </div>
            </div>

            <div className="benefit-item flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                ✓
              </div>
              <div>
                <h4 className="font-semibold mb-2">Custom Solutions</h4>
                <p className="text-gray-600">
                  We tailor Dynamics 365 to your specific business processes and 
                  requirements, not the other way around.
                </p>
              </div>
            </div>

            <div className="benefit-item flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                ✓
              </div>
              <div>
                <h4 className="font-semibold mb-2">Ongoing Support</h4>
                <p className="text-gray-600">
                  Continuous support and optimization to ensure your Dynamics 365 
                  environment evolves with your business needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section text-center bg-gray-50 p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business Operations?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Let&apos;s discuss how Dynamics 365 can streamline your workflows and drive growth.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-cyan-400 text-white px-8 py-4 rounded-lg hover:bg-cyan-500 transition-colors font-semibold text-lg"
          >
            Schedule a Consultation
          </a>
        </div>
      </div>
    </div>
    </main>
  );
}

// Build-safe: ISR with 60s revalidation
export const revalidate = 60;
