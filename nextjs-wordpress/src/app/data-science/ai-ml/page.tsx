import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';

export const metadata: Metadata = {
  title: 'AI & Machine Learning | Data Science | MoreYeahs',
  description: 'Transform your business with artificial intelligence and machine learning solutions that automate processes, predict outcomes, and unlock insights from your data.',
};

async function getAIMLPageData() {
  try {
    // Try to fetch the Data Science AI ML page from WordPress
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=ai-ml&parent=data-science`,
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
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=ai-ml`,
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
    console.error('Error fetching AI ML page:', error);
    return null;
  }
}

export default async function AIMLPage() {
  const pageData = await getAIMLPageData();

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
          <div className="ai-ml-page">
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
      <div className="ai-ml-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">AI & Machine Learning</h1>
            <div className="bg-cyan-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Artificial Intelligence & Machine Learning Solutions</h2>
              <p className="text-lg">
                Leverage the power of AI and machine learning to automate complex processes, 
                predict future outcomes, and extract actionable insights from your data. Our 
                experts build custom models that solve real business problems and drive measurable results.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our AI & ML Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Predictive Analytics</h3>
                <p className="text-gray-600">
                  Build models that forecast sales, customer churn, demand, and other 
                  key business metrics with high accuracy.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Natural Language Processing</h3>
                <p className="text-gray-600">
                  Extract insights from text data with sentiment analysis, entity recognition, 
                  text classification, and chatbot development.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Recommendation Systems</h3>
                <p className="text-gray-600">
                  Personalize user experiences with collaborative filtering and content-based 
                  recommendation engines.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Deep Learning</h3>
                <p className="text-gray-600">
                  Apply neural networks for image recognition, speech processing, 
                  and complex pattern detection tasks.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">AutoML & MLOps</h3>
                <p className="text-gray-600">
                  Automate model training, deployment, and monitoring with MLOps 
                  best practices and tools.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Anomaly Detection</h3>
                <p className="text-gray-600">
                  Identify unusual patterns, fraud, and outliers in your data with 
                  advanced detection algorithms.
                </p>
              </div>
            </div>
          </div>

          <div className="use-cases-section mb-12">
            <h2 className="text-3xl font-bold mb-8">AI/ML Use Cases</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Customer Churn Prediction</h4>
                <p className="text-gray-600">
                  Identify customers at risk of churning before they leave, enabling 
                  proactive retention strategies.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Demand Forecasting</h4>
                <p className="text-gray-600">
                  Optimize inventory and supply chain with accurate predictions of 
                  future product demand.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Fraud Detection</h4>
                <p className="text-gray-600">
                  Detect fraudulent transactions and suspicious activities in real-time 
                  to protect your business.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Document Processing</h4>
                <p className="text-gray-600">
                  Automate extraction and classification of information from documents, 
                  invoices, and forms.
                </p>
              </div>
            </div>
          </div>

          <div className="frameworks-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Frameworks & Tools</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">TensorFlow</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">PyTorch</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Scikit-learn</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Azure ML</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">AWS SageMaker</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Keras</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Hugging Face</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">MLflow</p>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-gray-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Harness the Power of AI?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s explore how AI and machine learning can transform your business and create competitive advantages.
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
