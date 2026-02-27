import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('education-cloud');
}

async function getEducationCloudPageData() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=education-cloud&parent=salesforce-services`,
      { next: { revalidate: 60 } }
    );
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    const fallbackResponse = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=education-cloud`,
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
    console.error('Error fetching Education Cloud page:', error);
    return null;
  }
}

export default async function EducationCloudPage() {
  const pageData = await getEducationCloudPageData();

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
          <div className="education-cloud-page">
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
      <div className="education-cloud-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">Education Cloud</h1>
            <div className="bg-blue-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Salesforce Education Cloud</h2>
              <p className="text-lg">
                Connect students, faculty, and staff with a unified platform designed for educational 
                institutions. Education Cloud helps you deliver personalized learning experiences and 
                streamline operations.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Education Cloud Capabilities</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Student Recruitment</h3>
                <p className="text-gray-600">
                  Manage the entire enrollment journey from inquiry to admission with automated 
                  workflows and personalized communications.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Student Success</h3>
                <p className="text-gray-600">
                  Track student progress, identify at-risk students, and provide timely interventions 
                  to improve outcomes.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Alumni Relations</h3>
                <p className="text-gray-600">
                  Build lifelong relationships with alumni through engagement programs and fundraising 
                  campaigns.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Advising & Case Management</h3>
                <p className="text-gray-600">
                  Provide personalized support with tools for academic advising, counseling, and 
                  student services.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Program Management</h3>
                <p className="text-gray-600">
                  Manage courses, programs, and certifications with comprehensive tracking and reporting.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Analytics & Insights</h3>
                <p className="text-gray-600">
                  Make data-driven decisions with dashboards and reports on enrollment, retention, 
                  and student outcomes.
                </p>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-blue-400 text-white p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Education?</h2>
            <p className="text-xl mb-8">
              Let our experts help you implement Education Cloud and improve student success.
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
