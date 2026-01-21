import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';

export const metadata: Metadata = {
  title: 'Power BI | Microsoft Services | MoreYeahs',
  description: 'Transform data into actionable insights with Microsoft Power BI. Create stunning visualizations and interactive reports for data-driven decision making.',
};

async function getPowerBIPageData() {
  try {
    // Try to fetch the Microsoft Services Power BI page from WordPress
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=power-bi&parent=microsoft-services`,
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
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=power-bi`,
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
    console.error('Error fetching Power BI page:', error);
    return null;
  }
}

export default async function PowerBIPage() {
  const pageData = await getPowerBIPageData();

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
          <div className="power-bi-page">
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
      <div className="power-bi-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">Microsoft Power BI</h1>
            <div className="bg-cyan-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Data Visualization & Business Intelligence</h2>
              <p className="text-lg">
                Transform your data into stunning visualizations and interactive reports with 
                Microsoft Power BI. Empower your team to make data-driven decisions with 
                real-time insights accessible from anywhere.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our Power BI Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Dashboard Development</h3>
                <p className="text-gray-600">
                  Create interactive dashboards that provide real-time insights into 
                  your business metrics and KPIs.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Data Modeling</h3>
                <p className="text-gray-600">
                  Design optimized data models using DAX and Power Query for 
                  efficient reporting and analysis.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Report Development</h3>
                <p className="text-gray-600">
                  Build comprehensive reports with drill-down capabilities, 
                  filters, and interactive visualizations.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Data Integration</h3>
                <p className="text-gray-600">
                  Connect to multiple data sources including SQL databases, Excel, 
                  cloud services, and APIs.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Embedded Analytics</h3>
                <p className="text-gray-600">
                  Embed Power BI reports and dashboards into your applications 
                  for seamless user experiences.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Training & Support</h3>
                <p className="text-gray-600">
                  Comprehensive training programs and ongoing support to maximize 
                  your Power BI investment.
                </p>
              </div>
            </div>
          </div>

          <div className="features-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="feature-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Real-Time Analytics</h4>
                  <p className="text-gray-600">
                    Access up-to-the-minute data with live connections and automatic 
                    refresh capabilities.
                  </p>
                </div>
              </div>

              <div className="feature-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">AI-Powered Insights</h4>
                  <p className="text-gray-600">
                    Leverage built-in AI features for automated insights, anomaly 
                    detection, and forecasting.
                  </p>
                </div>
              </div>

              <div className="feature-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Mobile Access</h4>
                  <p className="text-gray-600">
                    Access your reports and dashboards on any device with native 
                    mobile apps for iOS and Android.
                  </p>
                </div>
              </div>

              <div className="feature-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Secure Sharing</h4>
                  <p className="text-gray-600">
                    Share reports securely with role-based access control and 
                    row-level security.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-gray-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Visualize Your Data?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s discuss how Power BI can transform your data into actionable insights.
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
