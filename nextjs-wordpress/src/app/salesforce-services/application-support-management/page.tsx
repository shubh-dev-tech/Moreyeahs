import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
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
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=application-support-management&parent=salesforce-services`,
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
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=application-support-management`,
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
    <div className="application-support-page">
      <div className="container">
        <div className="hero-section">
          <h1>Salesforce Application Support & Management</h1>
          <div className="hero-banner">
            <h2>Proactive Salesforce Support & Maintenance</h2>
            <p>
              Keep your Salesforce environment running at peak performance with our comprehensive 
              application support and management services. From proactive monitoring to rapid issue 
              resolution, we ensure your CRM delivers maximum value to your business.
            </p>
          </div>
        </div>

        <div className="services-section">
          <h2>Our Support Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <h3>24/7 Monitoring</h3>
              <p>
                Continuous monitoring of your Salesforce environment to identify and 
                resolve issues before they impact users.
              </p>
            </div>

            <div className="service-card">
              <h3>Helpdesk Support</h3>
              <p>
                Multi-tiered support desk to handle user questions, troubleshoot issues, 
                and provide timely resolutions.
              </p>
            </div>

            <div className="service-card">
              <h3>System Maintenance</h3>
              <p>
                Regular system health checks, data cleanup, performance tuning, and 
                configuration updates.
              </p>
            </div>

            <div className="service-card">
              <h3>Release Management</h3>
              <p>
                Stay current with Salesforce releases through impact analysis, testing, 
                and smooth implementation.
              </p>
            </div>

            <div className="service-card">
              <h3>User Training</h3>
              <p>
                Ongoing training programs to ensure users maximize productivity and 
                adopt new features effectively.
              </p>
            </div>

            <div className="service-card">
              <h3>Enhancement Requests</h3>
              <p>
                Prioritize and implement enhancements to continuously improve your 
                Salesforce experience.
              </p>
            </div>
          </div>
        </div>

        <div className="support-tiers-section">
          <h2>Support Tiers</h2>
          <div className="tiers-grid">
            <div className="tier-card">
              <h3 className="tier-title essential">Essential</h3>
              <p className="tier-description">
                Basic support for small teams with standard business hours coverage.
              </p>
              <ul className="tier-features">
                <li><span className="checkmark">✓</span>Business hours support (8x5)</li>
                <li><span className="checkmark">✓</span>Email & phone support</li>
                <li><span className="checkmark">✓</span>Monthly system reviews</li>
                <li><span className="checkmark">✓</span>Release updates</li>
              </ul>
            </div>

            <div className="tier-card popular">
              <div className="popular-badge">POPULAR</div>
              <h3 className="tier-title professional">Professional</h3>
              <p className="tier-description">
                Comprehensive support for growing organizations with extended coverage.
              </p>
              <ul className="tier-features">
                <li><span className="checkmark">✓</span>Extended hours support (12x5)</li>
                <li><span className="checkmark">✓</span>Priority response times</li>
                <li><span className="checkmark">✓</span>Bi-weekly system reviews</li>
                <li><span className="checkmark">✓</span>Proactive monitoring</li>
                <li><span className="checkmark">✓</span>Quarterly training sessions</li>
              </ul>
            </div>

            <div className="tier-card">
              <h3 className="tier-title enterprise">Enterprise</h3>
              <p className="tier-description">
                Premium support for mission-critical Salesforce deployments.
              </p>
              <ul className="tier-features">
                <li><span className="checkmark">✓</span>24/7/365 support</li>
                <li><span className="checkmark">✓</span>Dedicated account manager</li>
                <li><span className="checkmark">✓</span>Weekly system reviews</li>
                <li><span className="checkmark">✓</span>Advanced monitoring & alerts</li>
                <li><span className="checkmark">✓</span>Custom SLAs</li>
                <li><span className="checkmark">✓</span>On-demand training</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="benefits-section">
          <h2>Benefits of Managed Support</h2>
          <div className="benefits-grid">
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-content">
                <h4>Reduced Downtime</h4>
                <p>
                  Proactive monitoring and rapid response minimize system disruptions 
                  and keep your team productive.
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-content">
                <h4>Cost Predictability</h4>
                <p>
                  Fixed monthly fees provide budget certainty compared to variable 
                  hourly consulting costs.
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-content">
                <h4>Expert Knowledge</h4>
                <p>
                  Access to certified Salesforce professionals with deep expertise 
                  across all clouds and features.
                </p>
              </div>
            </div>

            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-content">
                <h4>Continuous Improvement</h4>
                <p>
                  Regular reviews and optimization ensure your Salesforce environment 
                  evolves with your business.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="cta-section">
          <h2>Ready for Reliable Salesforce Support?</h2>
          <p>
            Let&apos;s discuss how our managed support services can keep your Salesforce running smoothly.
          </p>
          <a href="/contact" className="cta-button">
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
}

// Build-safe: ISR with 60s revalidation
export const revalidate = 60;
