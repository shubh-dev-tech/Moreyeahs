import { Metadata } from 'next';
import Link from 'next/link';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';

export const metadata: Metadata = {
  title: 'Salesforce Services | MoreYeahs',
  description: 'Comprehensive Salesforce solutions including Sales Cloud, Service Cloud, Marketing Cloud, and custom implementations.',
};

async function getSalesforceServicesPageData() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=salesforce-services`,
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
    console.error('Error fetching Salesforce Services page:', error);
    return null;
  }
}

export default async function SalesforceServicesPage() {
  const pageData = await getSalesforceServicesPageData();

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
          <div className="salesforce-services-page">
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
      <div className="salesforce-services-page">
      <div className="mx-auto px-4 py-8">
        <div className="hero-section mb-12">
          <h1 className="text-4xl font-bold mb-6">Salesforce Services</h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform your customer relationships with the world&apos;s #1 CRM platform. 
            We deliver end-to-end Salesforce solutions that drive growth and customer success.
          </p>
        </div>

        <div className="services-grid grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Link href="/salesforce-services/sales-cloud" className="service-card p-6 border rounded-lg hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-4">Sales Cloud</h3>
            <p className="text-gray-600 mb-4">
              Accelerate sales with AI-powered CRM that helps teams close more deals, 
              faster with intelligent insights and automation.
            </p>
            <span className="text-blue-400 font-semibold">Learn More →</span>
          </Link>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Service Cloud</h3>
            <p className="text-gray-600">
              Deliver exceptional customer service with omnichannel support, 
              case management, and AI-powered service intelligence.
            </p>
          </div>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Marketing Cloud</h3>
            <p className="text-gray-600">
              Create personalized customer journeys across email, mobile, social, 
              and advertising with unified marketing automation.
            </p>
          </div>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Commerce Cloud</h3>
            <p className="text-gray-600">
              Build seamless shopping experiences across all channels with 
              AI-powered commerce solutions.
            </p>
          </div>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Experience Cloud</h3>
            <p className="text-gray-600">
              Build branded digital experiences for customers, partners, and 
              employees with flexible portal solutions.
            </p>
          </div>

          <div className="service-card p-6 border rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Custom Development</h3>
            <p className="text-gray-600">
              Extend Salesforce with custom apps, integrations, and Lightning 
              components tailored to your business needs.
            </p>
          </div>
        </div>

        <div className="our-services-section mb-12">
          <h2 className="text-3xl font-bold mb-8">Our Salesforce Expertise</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="expertise-card p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Implementation & Migration</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• New Salesforce implementations from scratch</li>
                <li>• Legacy system migrations to Salesforce</li>
                <li>• Multi-cloud integrations</li>
                <li>• Data migration and cleansing</li>
              </ul>
            </div>

            <div className="expertise-card p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Customization & Development</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Custom Apex and Lightning development</li>
                <li>• Process automation with Flow</li>
                <li>• AppExchange app development</li>
                <li>• API integrations</li>
              </ul>
            </div>

            <div className="expertise-card p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Optimization & Support</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Performance tuning and optimization</li>
                <li>• Health checks and audits</li>
                <li>• Ongoing managed services</li>
                <li>• Release management</li>
              </ul>
            </div>

            <div className="expertise-card p-6 bg-gray-50 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Training & Enablement</h3>
              <ul className="space-y-2 text-gray-600">
                <li>• End-user training programs</li>
                <li>• Admin and developer training</li>
                <li>• Change management support</li>
                <li>• Best practices workshops</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="why-choose-section mb-12">
          <h2 className="text-3xl font-bold mb-8">Why Choose Us for Salesforce?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="benefit-item text-center p-6">
              <div className="text-5xl mb-4">🏆</div>
              <h4 className="font-semibold mb-2 text-lg">Certified Experts</h4>
              <p className="text-gray-600">
                Our team holds multiple Salesforce certifications across all clouds 
                and specializations.
              </p>
            </div>

            <div className="benefit-item text-center p-6">
              <div className="text-5xl mb-4">⚡</div>
              <h4 className="font-semibold mb-2 text-lg">Proven Track Record</h4>
              <p className="text-gray-600">
                Successfully delivered 100+ Salesforce projects across diverse 
                industries and use cases.
              </p>
            </div>

            <div className="benefit-item text-center p-6">
              <div className="text-5xl mb-4">🤝</div>
              <h4 className="font-semibold mb-2 text-lg">Partnership Approach</h4>
              <p className="text-gray-600">
                We work as an extension of your team, ensuring long-term success 
                and continuous improvement.
              </p>
            </div>
          </div>
        </div>

        <div className="stats-section mb-12 bg-blue-400 text-white p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-8 text-center">Salesforce Impact</h2>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">25%</div>
              <p>Increase in sales revenue</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">35%</div>
              <p>Improvement in customer satisfaction</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">34%</div>
              <p>Faster case resolution</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">27%</div>
              <p>Increase in marketing ROI</p>
            </div>
          </div>
        </div>

        <div className="cta-section text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Unlock the Power of Salesforce?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Let&apos;s discuss how Salesforce can transform your customer relationships and drive growth.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-blue-400 text-white px-8 py-4 rounded-lg hover:bg-blue-500 transition-colors font-semibold text-lg"
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
