import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('sales-cloud');
}

async function getSalesCloudPageData() {
  try {
    // Try to fetch the Salesforce Sales Cloud page from WordPress
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=sales-cloud&parent=salesforce-services`,
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
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=sales-cloud`,
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
    console.error('Error fetching Sales Cloud page:', error);
    return null;
  }
}

export default async function SalesCloudPage() {
  const pageData = await getSalesCloudPageData();

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
          <div className="sales-cloud-page">
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
      <div className="sales-cloud-page">
      <div className="mx-auto px-4 py-8">
        <div className="hero-section mb-12">
          <h1 className="text-4xl font-bold mb-6">Sales Cloud</h1>
          <div className="bg-blue-400 p-8 rounded-lg text-white mb-8">
            <h2 className="text-3xl font-bold mb-4">AI u0026 Intelligence</h2>
            <p className="text-lg">
              We design and implement intelligent systems that automate decisions, enhance human 
              capabilities, and continuously learn from data. Our AI u0026 Intelligence solutions help 
              organizations move beyond manual processes and static logic into adaptive, self-improving 
              systems that drive competitive advantage.
            </p>
          </div>
        </div>

        <div className="services-section mb-12">
          <h2 className="text-3xl font-bold mb-8">Sales Cloud Capabilities</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Lead Management</h3>
              <p className="text-gray-600">
                Capture, track, and nurture leads with intelligent scoring and automated 
                workflows that prioritize your best opportunities.
              </p>
            </div>

            <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Opportunity Management</h3>
              <p className="text-gray-600">
                Track deals through every stage with real-time visibility, forecasting, 
                and AI-powered insights to close more deals faster.
              </p>
            </div>

            <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Contact & Account Management</h3>
              <p className="text-gray-600">
                Maintain a complete view of customers and prospects with relationship 
                mapping and engagement history.
              </p>
            </div>

            <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Sales Analytics</h3>
              <p className="text-gray-600">
                Make data-driven decisions with customizable dashboards, reports, and 
                AI-powered predictions.
              </p>
            </div>

            <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Mobile CRM</h3>
              <p className="text-gray-600">
                Access customer data, update records, and close deals from anywhere 
                with the Salesforce mobile app.
              </p>
            </div>

            <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold mb-4">Einstein AI</h3>
              <p className="text-gray-600">
                Leverage AI-powered insights for lead scoring, opportunity insights, 
                and predictive forecasting.
              </p>
            </div>
          </div>
        </div>

        <div className="features-section mb-12">
          <h2 className="text-3xl font-bold mb-8">Key Features</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="feature-item flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                ✓
              </div>
              <div>
                <h4 className="font-semibold mb-2">360-Degree Customer View</h4>
                <p className="text-gray-600">
                  See every interaction, purchase, and support case in one unified platform 
                  for complete customer context.
                </p>
              </div>
            </div>

            <div className="feature-item flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                ✓
              </div>
              <div>
                <h4 className="font-semibold mb-2">Workflow Automation</h4>
                <p className="text-gray-600">
                  Automate repetitive tasks, approvals, and follow-ups to let your team 
                  focus on selling.
                </p>
              </div>
            </div>

            <div className="feature-item flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                ✓
              </div>
              <div>
                <h4 className="font-semibold mb-2">Email Integration</h4>
                <p className="text-gray-600">
                  Sync emails, track opens and clicks, and log activities automatically 
                  with Gmail and Outlook integration.
                </p>
              </div>
            </div>

            <div className="feature-item flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                ✓
              </div>
              <div>
                <h4 className="font-semibold mb-2">Customizable Dashboards</h4>
                <p className="text-gray-600">
                  Create personalized views of your sales pipeline, performance metrics, 
                  and team activities.
                </p>
              </div>
            </div>

            <div className="feature-item flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                ✓
              </div>
              <div>
                <h4 className="font-semibold mb-2">Collaboration Tools</h4>
                <p className="text-gray-600">
                  Work together with Chatter, share files, and get real-time updates 
                  on deals and accounts.
                </p>
              </div>
            </div>

            <div className="feature-item flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                ✓
              </div>
              <div>
                <h4 className="font-semibold mb-2">AppExchange Integration</h4>
                <p className="text-gray-600">
                  Extend Sales Cloud with thousands of pre-built apps and integrations 
                  from the Salesforce ecosystem.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="benefits-section mb-12 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-8">Why Sales Cloud?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">25%</div>
              <p className="text-gray-600">Average increase in revenue</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">35%</div>
              <p className="text-gray-600">Improvement in sales productivity</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">37%</div>
              <p className="text-gray-600">Faster deal closure</p>
            </div>
          </div>
        </div>

        <div className="cta-section text-center bg-blue-400 text-white p-12 rounded-lg">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Sales Process?</h2>
          <p className="text-xl mb-8">
            Let our Salesforce experts help you implement Sales Cloud and drive revenue growth.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-white text-blue-400 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
          >
            Schedule a Demo
          </a>
        </div>
      </div>
    </div>
    </main>
  );
}

// Build-safe: ISR with 60s revalidation
export const revalidate = 60;
