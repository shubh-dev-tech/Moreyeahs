import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('azure');
}

async function getAzurePageData() {
  try {
    // Try to fetch the Microsoft Services Azure page from WordPress
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=azure&parent=microsoft-services`,
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
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=azure`,
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
    console.error('Error fetching Azure page:', error);
    return null;
  }
}

export default async function AzurePage() {
  const pageData = await getAzurePageData();

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
          <div className="azure-page">
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
      <div className="azure-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">Microsoft Azure</h1>
            <div className="bg-cyan-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Enterprise Cloud Solutions</h2>
              <p className="text-lg">
                Unlock the power of Microsoft Azure to build, deploy, and scale applications 
                with confidence. Our Azure experts help you leverage cloud computing, AI, 
                analytics, and DevOps to accelerate innovation and digital transformation.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our Azure Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Azure Infrastructure</h3>
                <p className="text-gray-600">
                  Design and implement scalable infrastructure with Virtual Machines, 
                  Virtual Networks, and Storage solutions.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Azure Kubernetes Service</h3>
                <p className="text-gray-600">
                  Deploy and manage containerized applications at scale with managed 
                  Kubernetes orchestration.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Azure App Services</h3>
                <p className="text-gray-600">
                  Build and host web apps, mobile backends, and RESTful APIs without 
                  managing infrastructure.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Azure SQL & Databases</h3>
                <p className="text-gray-600">
                  Managed database services including SQL Database, Cosmos DB, and 
                  MySQL for mission-critical applications.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Azure DevOps</h3>
                <p className="text-gray-600">
                  Implement CI/CD pipelines, version control, and agile planning with 
                  Azure DevOps Services.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Azure AI & ML</h3>
                <p className="text-gray-600">
                  Build intelligent applications with Azure Machine Learning, Cognitive 
                  Services, and Bot Framework.
                </p>
              </div>
            </div>
          </div>

          <div className="solutions-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Azure Solutions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="solution-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Cloud Migration</h4>
                <p className="text-gray-600">
                  Migrate your on-premises workloads to Azure with minimal disruption 
                  using proven methodologies and tools.
                </p>
              </div>

              <div className="solution-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Hybrid Cloud</h4>
                <p className="text-gray-600">
                  Connect on-premises and cloud environments with Azure Arc and hybrid 
                  networking solutions.
                </p>
              </div>

              <div className="solution-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Security & Compliance</h4>
                <p className="text-gray-600">
                  Protect your workloads with Azure Security Center, Sentinel, and 
                  built-in compliance certifications.
                </p>
              </div>

              <div className="solution-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Disaster Recovery</h4>
                <p className="text-gray-600">
                  Ensure business continuity with Azure Site Recovery and backup 
                  solutions for high availability.
                </p>
              </div>
            </div>
          </div>

          <div className="benefits-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Why Choose Azure?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Global Infrastructure</h4>
                  <p className="text-gray-600">
                    60+ regions worldwide for low latency and data residency compliance.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Microsoft Ecosystem</h4>
                  <p className="text-gray-600">
                    Seamless integration with Office 365, Dynamics 365, and Power Platform.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Cost Optimization</h4>
                  <p className="text-gray-600">
                    Pay only for what you use with flexible pricing and cost management tools.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Enterprise-Ready</h4>
                  <p className="text-gray-600">
                    Built-in security, compliance, and SLAs for mission-critical workloads.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-gray-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Move to Azure?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s discuss how Azure can accelerate your digital transformation journey.
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
