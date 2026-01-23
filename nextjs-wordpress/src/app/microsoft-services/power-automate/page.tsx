import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('power-automate');
}

async function getPowerAutomatePageData() {
  try {
    // Try to fetch the Microsoft Services Power Automate page from WordPress
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=power-automate&parent=microsoft-services`,
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
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=power-automate`,
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
    console.error('Error fetching Power Automate page:', error);
    return null;
  }
}

export default async function PowerAutomatePage() {
  const pageData = await getPowerAutomatePageData();

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
          <div className="power-automate-page">
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
      <div className="power-automate-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">Microsoft Power Automate</h1>
            <div className="bg-cyan-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Workflow Automation Made Simple</h2>
              <p className="text-lg">
                Automate repetitive tasks and complex business processes with Microsoft Power Automate. 
                Connect your favorite apps and services to streamline workflows, increase productivity, 
                and reduce manual effort across your organization.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our Power Automate Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Cloud Flows</h3>
                <p className="text-gray-600">
                  Create automated workflows that connect cloud services like Office 365, 
                  SharePoint, Dynamics 365, and hundreds of other apps.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Desktop Flows (RPA)</h3>
                <p className="text-gray-600">
                  Automate legacy applications and desktop processes with robotic process 
                  automation capabilities.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Business Process Flows</h3>
                <p className="text-gray-600">
                  Guide users through defined business processes with step-by-step 
                  workflows in Dynamics 365 and Power Apps.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Approval Workflows</h3>
                <p className="text-gray-600">
                  Streamline approval processes for documents, expenses, time-off requests, 
                  and other business decisions.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Document Processing</h3>
                <p className="text-gray-600">
                  Automate document generation, routing, and processing with AI-powered 
                  data extraction and workflows.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Integration Solutions</h3>
                <p className="text-gray-600">
                  Connect disparate systems and applications to enable seamless data 
                  flow across your technology stack.
                </p>
              </div>
            </div>
          </div>

          <div className="use-cases-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Common Automation Scenarios</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Email & Notifications</h4>
                <p className="text-gray-600">
                  Automatically send emails, Teams messages, and notifications based on 
                  triggers like form submissions or data changes.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Data Collection & Sync</h4>
                <p className="text-gray-600">
                  Collect data from forms, emails, or other sources and sync it to databases, 
                  spreadsheets, or CRM systems.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">File Management</h4>
                <p className="text-gray-600">
                  Automatically organize, move, and process files in SharePoint, OneDrive, 
                  or cloud storage services.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Social Media Monitoring</h4>
                <p className="text-gray-600">
                  Track mentions, posts, and engagement across social platforms and 
                  trigger automated responses.
                </p>
              </div>
            </div>
          </div>

          <div className="benefits-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Benefits of Power Automate</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Increased Productivity</h4>
                  <p className="text-gray-600">
                    Free your team from repetitive manual tasks to focus on high-value work.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">No-Code/Low-Code</h4>
                  <p className="text-gray-600">
                    Build powerful automations without programming knowledge using visual designers.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">500+ Connectors</h4>
                  <p className="text-gray-600">
                    Integrate with a vast ecosystem of Microsoft and third-party services.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">AI Builder Integration</h4>
                  <p className="text-gray-600">
                    Add intelligence to workflows with pre-built AI models for forms, text, and images.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-gray-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Workflows?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s explore how Power Automate can streamline your business processes.
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-cyan-400 text-white px-8 py-4 rounded-lg hover:bg-cyan-500 transition-colors font-semibold text-lg"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}

// Build-safe: ISR with 60s revalidation
export const revalidate = 60;
