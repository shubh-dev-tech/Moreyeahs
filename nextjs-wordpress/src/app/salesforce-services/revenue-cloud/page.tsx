import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('revenue-cloud');
}

async function getRevenueCloudPageData() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=revenue-cloud&parent=salesforce-services`,
      { next: { revalidate: 60 } }
    );
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    const fallbackResponse = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=revenue-cloud`,
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
    console.error('Error fetching Revenue Cloud page:', error);
    return null;
  }
}

export default async function RevenueCloudPage() {
  const pageData = await getRevenueCloudPageData();

  if (pageData) {
    if (pageData.blocks && Array.isArray(pageData.blocks) && pageData.blocks.length > 0) {
      return (
        <main className="min-h-screen">
          <BlockRenderer blocks={pageData.blocks} />
        </main>
      );
    }

    const blocks = parseBlocks(pageData.content?.rendered || '') || [];

    if (blocks && blocks.length > 0) {
      return (
        <main className="min-h-screen">
          <BlockRenderer blocks={blocks} />
        </main>
      );
    }

    if (pageData.content?.rendered) {
      return (
        <main className="min-h-screen">
          <WordPressContent content={pageData.content.rendered} />
        </main>
      );
    }

    if (pageData.acf && pageData.acf.blocks) {
      return (
        <main className="min-h-screen">
          <div className="revenue-cloud-page">
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

  return (
    <main className="min-h-screen">
      <div className="revenue-cloud-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">Revenue Cloud</h1>
            <div className="bg-blue-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Salesforce Revenue Cloud</h2>
              <p className="text-lg">
                Streamline your quote-to-cash process with Revenue Cloud. Automate pricing, 
                configure complex products, and accelerate revenue recognition across your business.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Revenue Cloud Capabilities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">CPQ (Configure, Price, Quote)</h3>
                <p className="text-gray-600">
                  Configure complex products, apply pricing rules, and generate accurate quotes 
                  in minutes, not hours.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Billing Management</h3>
                <p className="text-gray-600">
                  Automate invoicing, manage subscriptions, and handle complex billing scenarios 
                  with ease.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Revenue Recognition</h3>
                <p className="text-gray-600">
                  Ensure compliance with revenue recognition standards and automate complex 
                  revenue schedules.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Contract Management</h3>
                <p className="text-gray-600">
                  Create, negotiate, and manage contracts with automated workflows and e-signature 
                  integration.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Subscription Management</h3>
                <p className="text-gray-600">
                  Manage recurring revenue, handle upgrades and downgrades, and reduce churn 
                  with automated renewals.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Partner Relationship Management</h3>
                <p className="text-gray-600">
                  Enable channel partners with self-service portals, deal registration, and 
                  automated commission tracking.
                </p>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-blue-400 text-white p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Accelerate Revenue Growth?</h2>
            <p className="text-xl mb-8">
              Let our experts help you implement Revenue Cloud and streamline your quote-to-cash process.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-white text-blue-400 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

export const revalidate = 60;
