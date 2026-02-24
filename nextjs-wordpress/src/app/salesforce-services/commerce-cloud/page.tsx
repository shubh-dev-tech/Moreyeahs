import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('commerce-cloud');
}

async function getCommerceCloudPageData() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=commerce-cloud&parent=salesforce-services`,
      { next: { revalidate: 60 } }
    );
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    const fallbackResponse = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=commerce-cloud`,
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
    console.error('Error fetching Commerce Cloud page:', error);
    return null;
  }
}

export default async function CommerceCloudPage() {
  const pageData = await getCommerceCloudPageData();

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
          <div className="commerce-cloud-page">
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
      <div className="commerce-cloud-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">Commerce Cloud</h1>
            <div className="bg-blue-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Salesforce Commerce Cloud</h2>
              <p className="text-lg">
                Deliver seamless shopping experiences across all channels with Commerce Cloud. 
                Power your B2C and B2B commerce with AI-driven personalization and unified commerce.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Commerce Cloud Capabilities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">B2C Commerce</h3>
                <p className="text-gray-600">
                  Create engaging shopping experiences for consumers with AI-powered product 
                  recommendations and personalization.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">B2B Commerce</h3>
                <p className="text-gray-600">
                  Enable self-service buying for business customers with custom catalogs, 
                  pricing, and approval workflows.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Order Management</h3>
                <p className="text-gray-600">
                  Orchestrate orders across channels with intelligent fulfillment, inventory 
                  visibility, and returns management.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Einstein AI</h3>
                <p className="text-gray-600">
                  Boost conversions with AI-powered product recommendations, search, and 
                  predictive sorting.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Mobile-First Design</h3>
                <p className="text-gray-600">
                  Deliver fast, responsive shopping experiences optimized for mobile devices 
                  and progressive web apps.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Headless Commerce</h3>
                <p className="text-gray-600">
                  Build custom storefronts with flexible APIs while leveraging Commerce Cloud&apos;s 
                  backend capabilities.
                </p>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-blue-400 text-white p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Commerce?</h2>
            <p className="text-xl mb-8">
              Let our experts help you implement Commerce Cloud and deliver exceptional shopping experiences.
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
