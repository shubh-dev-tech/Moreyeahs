import { Metadata } from 'next';
import Link from 'next/link';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';

export const metadata: Metadata = {
  title: 'Microsoft Services | MoreYeahs',
  description: 'Comprehensive Microsoft solutions including Dynamics 365, Azure, Microsoft 365, and Power Platform services.',
};

async function getMicrosoftServicesPageData() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=microsoft-services`,
      { next: { revalidate: 60 } }
    );
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Microsoft Services page:', error);
    return null;
  }
}

export default async function MicrosoftServicesPage() {
  const pageData = await getMicrosoftServicesPageData();

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
          <div className="microsoft-services-page">
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
      <div className="microsoft-services-page">
      <div className="mx-auto px-4 py-8">
        <div className="hero-section mb-12">
          <h1 className="text-4xl font-bold mb-6">Microsoft Services</h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive Microsoft solutions to transform your business operations, 
            enhance productivity, and drive digital innovation.
          </p>
        </div>

        <div className="services-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Link href="/microsoft-services/dynamics-365" className="service-card p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-4">Dynamics 365</h3>
            <p className="text-gray-600 mb-4">
              Unified business applications for sales, service, finance, operations, 
              and marketing in a single connected system.
            </p>
            <span className="text-cyan-400 font-semibold">Learn More →</span>
          </Link>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Azure Cloud</h3>
            <p className="text-gray-600">
              Cloud infrastructure, platform services, and enterprise solutions 
              powered by Microsoft Azure.
            </p>
          </div>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Microsoft 365</h3>
            <p className="text-gray-600">
              Productivity and collaboration tools including Teams, SharePoint, 
              and Office applications.
            </p>
          </div>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Power Platform</h3>
            <p className="text-gray-600">
              Low-code solutions with Power Apps, Power Automate, Power BI, 
              and Power Virtual Agents.
            </p>
          </div>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Azure DevOps</h3>
            <p className="text-gray-600">
              Complete DevOps toolchain for planning, development, delivery, 
              and operations.
            </p>
          </div>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Security & Compliance</h3>
            <p className="text-gray-600">
              Enterprise-grade security, identity management, and compliance 
              solutions across Microsoft platforms.
            </p>
          </div>
        </div>

        <div className="why-microsoft-section mb-12">
          <h2 className="text-3xl font-bold mb-8">Why Choose Microsoft Solutions?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="benefit-item p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-lg">Integrated Ecosystem</h4>
              <p className="text-gray-600">
                Seamlessly connected tools and services that work together to 
                enhance productivity and collaboration.
              </p>
            </div>

            <div className="benefit-item p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-lg">Enterprise Scale</h4>
              <p className="text-gray-600">
                Solutions that scale from small businesses to global enterprises 
                with reliability and performance.
              </p>
            </div>

            <div className="benefit-item p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-lg">AI & Innovation</h4>
              <p className="text-gray-600">
                Built-in AI capabilities and continuous innovation to keep your 
                business at the cutting edge.
              </p>
            </div>

            <div className="benefit-item p-6 bg-gray-50 rounded-lg">
              <h4 className="font-semibold mb-2 text-lg">Security First</h4>
              <p className="text-gray-600">
                Industry-leading security, compliance, and privacy protections 
                built into every service.
              </p>
            </div>
          </div>
        </div>

        <div className="cta-section text-center bg-cyan-400 text-white p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Leverage Microsoft Solutions?</h2>
          <p className="text-xl mb-8">
            Let our Microsoft-certified experts help you choose and implement 
            the right solutions for your business.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-white text-cyan-400 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Get Started Today
          </a>
        </div>
      </div>
      </div>
    </main>
  );
}

// Build-safe: ISR with 60s revalidation
export const revalidate = 60;
