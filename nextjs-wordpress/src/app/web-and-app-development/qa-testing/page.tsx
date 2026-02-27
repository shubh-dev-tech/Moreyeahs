import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('qa-testing');
}

async function getQATestingPageData() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=qa-testing&parent=web-and-app-development`,
      { next: { revalidate: 60 } }
    );
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    const fallbackResponse = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=qa-testing`,
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
    console.error('Error fetching QA Testing page:', error);
    return null;
  }
}

export default async function QATestingPage() {
  const pageData = await getQATestingPageData();

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
          <div className="qa-testing-page">
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
      <div className="qa-testing-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">QA Testing Services</h1>
            <div className="bg-blue-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Quality Assurance & Testing</h2>
              <p className="text-lg">
                Ensure your applications meet the highest quality standards with our comprehensive 
                QA testing services. From manual testing to automated test suites, we help you 
                deliver bug-free software.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our QA Testing Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Manual Testing</h3>
                <p className="text-gray-600">
                  Comprehensive manual testing to identify usability issues, edge cases, and 
                  ensure your application works as expected.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Automated Testing</h3>
                <p className="text-gray-600">
                  Build robust automated test suites using modern frameworks like Jest, Cypress, 
                  Selenium, and Playwright for faster releases.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Performance Testing</h3>
                <p className="text-gray-600">
                  Load testing, stress testing, and performance optimization to ensure your 
                  application scales under real-world conditions.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Security Testing</h3>
                <p className="text-gray-600">
                  Identify vulnerabilities and security risks with penetration testing, security 
                  audits, and compliance validation.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">API Testing</h3>
                <p className="text-gray-600">
                  Validate API functionality, performance, and security with comprehensive API 
                  testing using tools like Postman and REST Assured.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Mobile App Testing</h3>
                <p className="text-gray-600">
                  Test mobile applications across devices, platforms, and network conditions to 
                  ensure consistent user experiences.
                </p>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-blue-400 text-white p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Software Quality?</h2>
            <p className="text-xl mb-8">
              Let our QA experts help you build reliable, high-quality applications that your users will love.
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
