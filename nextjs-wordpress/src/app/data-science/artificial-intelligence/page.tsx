import { Metadata } from 'next';
import { WORDPRESS_API_URL } from '@/lib/env';
import { parseBlocks } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WordPressContent } from '@/components/WordPressContent';

export const metadata: Metadata = {
  title: 'Artificial Intelligence Services | MoreYeahs',
  description: 'Professional AI services including machine learning, natural language processing, computer vision, and intelligent automation solutions.',
};

async function getAIPageData() {
  try {
    // Try to fetch using the custom pages-with-blocks endpoint first
    const customResponse = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages-with-blocks/artificial-intelligence`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 60 }
    });
    
    if (customResponse.ok) {
      const pageData = await customResponse.json();
      return pageData;
    }
    
    // Fallback to standard WordPress API
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages?slug=artificial-intelligence`, {
      next: { revalidate: 60 }
    });
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    // If no specific page exists, return null to show default content
    return null;
  } catch (error) {
    console.error('Error fetching AI page:', error);
    return null;
  }
}

export default async function ArtificialIntelligencePage() {
  const pageData = await getAIPageData();

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
          <div className="ai-page">
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

  // Default AI page content - only show if no WordPress page exists
  return (
    <main className="min-h-screen">
      <div className="ai-page">
        <div className="mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6">Artificial Intelligence Services</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-8">
              Harness the power of artificial intelligence to transform your business operations, 
              automate complex processes, and unlock new opportunities for growth. Our AI solutions 
              are designed to deliver measurable results and competitive advantages.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Machine Learning & AI Models</h2>
                <p className="text-gray-600 mb-4">
                  Custom AI models tailored to your specific business needs and data requirements.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Custom neural networks and deep learning</li>
                  <li>• Computer vision and image recognition</li>
                  <li>• Recommendation systems</li>
                  <li>• Anomaly detection and fraud prevention</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Natural Language Processing</h2>
                <p className="text-gray-600 mb-4">
                  Advanced NLP solutions to understand, process, and generate human language.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Intelligent chatbots and virtual assistants</li>
                  <li>• Document analysis and extraction</li>
                  <li>• Sentiment analysis and social listening</li>
                  <li>• Language translation and localization</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Intelligent Automation</h2>
                <p className="text-gray-600 mb-4">
                  Automate complex business processes using AI-powered decision making.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Robotic Process Automation (RPA)</li>
                  <li>• Intelligent document processing</li>
                  <li>• Workflow optimization</li>
                  <li>• Smart decision engines</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">AI Strategy & Consulting</h2>
                <p className="text-gray-600 mb-4">
                  Strategic guidance to help you identify and implement AI opportunities.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• AI readiness assessment</li>
                  <li>• Use case identification and prioritization</li>
                  <li>• Technology stack recommendations</li>
                  <li>• AI governance and ethics frameworks</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-8 rounded-lg mb-8">
              <h2 className="text-3xl font-semibold mb-4">Our AI Development Process</h2>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Discovery</h3>
                  <p className="text-gray-600 text-sm">Understand your business needs and identify AI opportunities</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">2</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Design</h3>
                  <p className="text-gray-600 text-sm">Architect AI solutions and select optimal technologies</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">3</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Develop</h3>
                  <p className="text-gray-600 text-sm">Build, train, and validate AI models and systems</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-orange-600 font-bold">4</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Deploy</h3>
                  <p className="text-gray-600 text-sm">Launch AI solutions with monitoring and continuous improvement</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg mb-8">
              <h2 className="text-3xl font-semibold mb-4">Why Choose Our AI Services?</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cutting-Edge Technology</h3>
                  <p className="text-gray-600">Latest AI frameworks, models, and best practices for optimal results.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Business-Focused</h3>
                  <p className="text-gray-600">AI solutions designed to solve real business problems and drive ROI.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Scalable Solutions</h3>
                  <p className="text-gray-600">AI systems built to grow with your business and handle increasing demands.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-3xl font-semibold mb-4">Ready to Transform Your Business with AI?</h2>
              <p className="text-lg mb-6">
                Let&apos;s explore how artificial intelligence can revolutionize your operations and create new opportunities.
              </p>
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors">
                Get Started with AI
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Build-safe: ISR with 60s revalidation
export const revalidate = 60;
