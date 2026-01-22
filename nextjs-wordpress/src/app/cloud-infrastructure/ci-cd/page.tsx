import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('ci-cd');
}

async function getCICDPageData() {
  try {
    // Try to fetch the Cloud Infrastructure CI/CD page from WordPress
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=ci-cd&parent=cloud-infrastructure`,
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
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=ci-cd`,
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
    console.error('Error fetching CI/CD page:', error);
    return null;
  }
}

export default async function CICDPage() {
  const pageData = await getCICDPageData();

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
          <div className="cicd-page">
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
      <div className="cicd-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">CI/CD Solutions</h1>
            <div className="bg-cyan-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Continuous Integration & Continuous Deployment</h2>
              <p className="text-lg">
                Automate your software delivery pipeline with modern CI/CD practices. We help you 
                implement robust automation that accelerates development, improves code quality, 
                and enables rapid, reliable releases.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our CI/CD Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Pipeline Design</h3>
                <p className="text-gray-600">
                  Design and implement automated build, test, and deployment pipelines 
                  tailored to your tech stack and workflow.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">GitHub Actions</h3>
                <p className="text-gray-600">
                  Automate your workflows with GitHub Actions for CI/CD, testing, 
                  and deployment directly from your repository.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Jenkins & GitLab CI</h3>
                <p className="text-gray-600">
                  Enterprise-grade CI/CD with Jenkins or GitLab CI for complex 
                  build and deployment scenarios.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Azure DevOps</h3>
                <p className="text-gray-600">
                  End-to-end DevOps solution with Azure Pipelines, Repos, Boards, 
                  and Artifacts integration.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Container Orchestration</h3>
                <p className="text-gray-600">
                  Kubernetes and Docker-based deployment pipelines for containerized 
                  applications at scale.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Monitoring & Rollback</h3>
                <p className="text-gray-600">
                  Integrated monitoring, alerting, and automated rollback strategies 
                  for production deployments.
                </p>
              </div>
            </div>
          </div>

          <div className="benefits-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Benefits of Our CI/CD Solutions</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Faster Time to Market</h4>
                  <p className="text-gray-600">
                    Automate repetitive tasks and accelerate your release cycles from 
                    weeks to hours.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Improved Code Quality</h4>
                  <p className="text-gray-600">
                    Automated testing and code quality checks catch issues early in 
                    the development process.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Reduced Risk</h4>
                  <p className="text-gray-600">
                    Smaller, frequent deployments with automated rollback capabilities 
                    minimize deployment risks.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Team Productivity</h4>
                  <p className="text-gray-600">
                    Free your developers from manual deployments to focus on building 
                    features and innovation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-gray-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Automate Your Delivery Pipeline?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s discuss how CI/CD can transform your development workflow and accelerate releases.
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
