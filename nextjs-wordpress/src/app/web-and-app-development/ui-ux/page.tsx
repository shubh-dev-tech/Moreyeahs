import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('ui-ux');
}

async function getUIUXPageData() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=ui-ux&parent=web-and-app-development`,
      { next: { revalidate: 60 } }
    );
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    const fallbackResponse = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=ui-ux`,
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
    console.error('Error fetching UI/UX page:', error);
    return null;
  }
}

export default async function UIUXPage() {
  const pageData = await getUIUXPageData();

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
          <div className="ui-ux-page">
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
      <div className="ui-ux-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">UI/UX Design Services</h1>
            <div className="bg-blue-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">User Interface & User Experience Design</h2>
              <p className="text-lg">
                Create intuitive, engaging, and beautiful digital experiences that delight your users. 
                Our UI/UX design services combine research, strategy, and creativity to deliver 
                exceptional user experiences.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our UI/UX Design Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">User Research</h3>
                <p className="text-gray-600">
                  Understand your users through interviews, surveys, and analytics to inform 
                  design decisions with real user insights.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Wireframing & Prototyping</h3>
                <p className="text-gray-600">
                  Create interactive prototypes and wireframes to visualize and test your 
                  product before development begins.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Visual Design</h3>
                <p className="text-gray-600">
                  Craft beautiful, on-brand interfaces with modern design systems, typography, 
                  color theory, and visual hierarchy.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Interaction Design</h3>
                <p className="text-gray-600">
                  Design smooth, intuitive interactions and animations that guide users through 
                  your application effortlessly.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Usability Testing</h3>
                <p className="text-gray-600">
                  Validate design decisions with real users through usability testing, A/B 
                  testing, and iterative improvements.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Design Systems</h3>
                <p className="text-gray-600">
                  Build scalable design systems with reusable components, patterns, and 
                  guidelines for consistent experiences.
                </p>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-blue-400 text-white p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Create Amazing User Experiences?</h2>
            <p className="text-xl mb-8">
              Let our design experts help you build products that users love and remember.
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
