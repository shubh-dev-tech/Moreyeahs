import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('sharepoint');
}

async function getSharePointPageData() {
  try {
    // Try to fetch the Microsoft Services SharePoint page from WordPress
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=sharepoint&parent=microsoft-services`,
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
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=sharepoint`,
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
    console.error('Error fetching SharePoint page:', error);
    return null;
  }
}

export default async function SharePointPage() {
  const pageData = await getSharePointPageData();

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
          <div className="sharepoint-page">
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
      <div className="sharepoint-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">Microsoft SharePoint</h1>
            <div className="bg-cyan-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Intelligent Content & Collaboration</h2>
              <p className="text-lg">
                Transform how your organization shares knowledge and collaborates with Microsoft SharePoint. 
                Build powerful intranets, manage documents securely, and connect teams with intelligent 
                content management and collaboration solutions.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our SharePoint Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Intranet Development</h3>
                <p className="text-gray-600">
                  Design and build modern, engaging intranets that connect employees, 
                  share news, and foster company culture.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Document Management</h3>
                <p className="text-gray-600">
                  Centralize document storage with version control, metadata, and 
                  powerful search capabilities.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Team Sites</h3>
                <p className="text-gray-600">
                  Create collaborative workspaces for teams to share files, 
                  communicate, and manage projects.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Workflow Automation</h3>
                <p className="text-gray-600">
                  Automate business processes with SharePoint workflows and 
                  Power Automate integration.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Custom Development</h3>
                <p className="text-gray-600">
                  Build custom solutions with SharePoint Framework (SPFx), web parts, 
                  and extensions.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Migration Services</h3>
                <p className="text-gray-600">
                  Migrate from legacy file servers, on-premises SharePoint, or 
                  other platforms to SharePoint Online.
                </p>
              </div>
            </div>
          </div>

          <div className="features-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Key SharePoint Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="feature-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Modern Sites</h4>
                <p className="text-gray-600">
                  Beautiful, responsive sites that look great on any device with 
                  no-code page building.
                </p>
              </div>

              <div className="feature-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Intelligent Search</h4>
                <p className="text-gray-600">
                  AI-powered search that finds content across SharePoint, OneDrive, 
                  and Microsoft 365.
                </p>
              </div>

              <div className="feature-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Content Types</h4>
                <p className="text-gray-600">
                  Organize and manage different types of content with custom metadata 
                  and templates.
                </p>
              </div>

              <div className="feature-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Lists & Libraries</h4>
                <p className="text-gray-600">
                  Powerful lists and document libraries with views, filters, and 
                  integration with Microsoft 365.
                </p>
              </div>

              <div className="feature-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Permissions & Security</h4>
                <p className="text-gray-600">
                  Granular permissions, data loss prevention, and compliance features 
                  to protect sensitive content.
                </p>
              </div>

              <div className="feature-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Mobile Access</h4>
                <p className="text-gray-600">
                  Access and collaborate on content from anywhere with mobile apps 
                  for iOS and Android.
                </p>
              </div>
            </div>
          </div>

          <div className="benefits-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Why Choose SharePoint?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Seamless Integration</h4>
                  <p className="text-gray-600">
                    Works natively with Teams, Outlook, OneDrive, and other Microsoft 365 apps.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Enterprise Security</h4>
                  <p className="text-gray-600">
                    Enterprise-grade security and compliance with encryption, DLP, and auditing.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Customizable</h4>
                  <p className="text-gray-600">
                    Extend and customize with apps, web parts, and custom development.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cloud & On-Premises</h4>
                  <p className="text-gray-600">
                    Available as SharePoint Online or on-premises for hybrid deployments.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-gray-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Collaboration?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s discuss how SharePoint can revolutionize your content management and teamwork.
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
