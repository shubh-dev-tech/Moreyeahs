import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';

export const metadata: Metadata = {
  title: 'Application Support & Management | Salesforce Services | MoreYeahs',
  description: 'Comprehensive Salesforce application support and management services to keep your CRM running smoothly with proactive monitoring, maintenance, and optimization.',
};

async function getApplicationSupportPageData() {
  try {
    // Try to fetch the Salesforce Services Application Support page from WordPress
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=power-bi&parent=salesforce-services`,
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
    console.error('Error fetching Application Support page:', error);
    return null;
  }
}

export default async function ApplicationSupportPage() {
  const pageData = await getApplicationSupportPageData();

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
          <div className="application-support-page">
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
      <div className="application-support-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">Salesforce Application Support & Management</h1>
            <div className="bg-cyan-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Proactive Salesforce Support & Maintenance</h2>
              <p className="text-lg">
                Keep your Salesforce environment running at peak performance with our comprehensive 
                application support and management services. From proactive monitoring to rapid issue 
                resolution, we ensure your CRM delivers maximum value to your business.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our Support Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">24/7 Monitoring</h3>
                <p className="text-gray-600">
                  Continuous monitoring of your Salesforce environment to identify and 
                  resolve issues before they impact users.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Helpdesk Support</h3>
                <p className="text-gray-600">
                  Multi-tiered support desk to handle user questions, troubleshoot issues, 
                  and provide timely resolutions.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">System Maintenance</h3>
                <p className="text-gray-600">
                  Regular system health checks, data cleanup, performance tuning, and 
                  configuration updates.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Release Management</h3>
                <p className="text-gray-600">
                  Stay current with Salesforce releases through impact analysis, testing, 
                  and smooth implementation.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">User Training</h3>
                <p className="text-gray-600">
                  Ongoing training programs to ensure users maximize productivity and 
                  adopt new features effectively.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Enhancement Requests</h3>
                <p className="text-gray-600">
                  Prioritize and implement enhancements to continuously improve your 
                  Salesforce experience.
                </p>
              </div>
            </div>
          </div>

          <div className="support-tiers-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Support Tiers</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="tier-card p-6 border-2 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-cyan-600">Essential</h3>
                <p className="text-gray-600 mb-4">
                  Basic support for small teams with standard business hours coverage.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>Business hours support (8x5)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>Email & phone support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>Monthly system reviews</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>Release updates</span>
                  </li>
                </ul>
              </div>

              <div className="tier-card p-6 border-2 border-cyan-400 rounded-lg bg-cyan-50">
                <div className="text-xs bg-cyan-400 text-white px-3 py-1 rounded-full inline-block mb-2">
                  POPULAR
                </div>
                <h3 className="text-2xl font-bold mb-4 text-cyan-600">Professional</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive support for growing organizations with extended coverage.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>Extended hours support (12x5)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>Priority response times</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>Bi-weekly system reviews</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>Proactive monitoring</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>Quarterly training sessions</span>
                  </li>
                </ul>
              </div>

              <div className="tier-card p-6 border-2 rounded-lg">
                <h3 className="text-2xl font-bold mb-4 text-cyan-600">Enterprise</h3>
                <p className="text-gray-600 mb-4">
                  Premium support for mission-critical Salesforce deployments.
                </p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>24/7/365 support</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>Dedicated account manager</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>Weekly system reviews</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>Advanced monitoring & alerts</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>Custom SLAs</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2">✓</span>
                    <span>On-demand training</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="benefits-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Benefits of Managed Support</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Reduced Downtime</h4>
                  <p className="text-gray-600">
                    Proactive monitoring and rapid response minimize system disruptions 
                    and keep your team productive.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cost Predictability</h4>
                  <p className="text-gray-600">
                    Fixed monthly fees provide budget certainty compared to variable 
                    hourly consulting costs.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Expert Knowledge</h4>
                  <p className="text-gray-600">
                    Access to certified Salesforce professionals with deep expertise 
                    across all clouds and features.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Continuous Improvement</h4>
                  <p className="text-gray-600">
                    Regular reviews and optimization ensure your Salesforce environment 
                    evolves with your business.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-gray-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready for Reliable Salesforce Support?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s discuss how our managed support services can keep your Salesforce running smoothly.
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
