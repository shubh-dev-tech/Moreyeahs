import { Metadata } from 'next';
import { WORDPRESS_API_URL } from '@/lib/env';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('data-science');
}

async function getDataSciencePageData() {
  try {
    // Try to fetch a specific Data Science page from WordPress using standard endpoint
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages?slug=data-science`);
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    // If no specific page exists, return null to show default content
    return null;
  } catch (error) {
    console.error('Error fetching Data Science page:', error);
    return null;
  }
}

export default async function DataSciencePage() {
  const pageData = await getDataSciencePageData();

  if (pageData) {
    // If WordPress page exists, render it with blocks
    return (
      <div className="data-science-page">
        <div className="mx-auto px-4 py-8">
          <div 
            className="content mb-8"
            dangerouslySetInnerHTML={{ __html: pageData.content.rendered }}
          />
          {pageData.acf && pageData.acf.blocks && (
            <div className="blocks">
              {/* Render blocks if available */}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Default Data Science page content
  return (
    <div className="data-science-page">
      <div className="mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Data Science Services</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            Transform your data into actionable insights with our comprehensive data science services. 
            We help organizations leverage machine learning, statistical analysis, and predictive modeling 
            to make data-driven decisions and unlock business value.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Machine Learning Solutions</h2>
              <p className="text-gray-600 mb-4">
                Build and deploy machine learning models to automate decisions and predict outcomes.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Supervised & unsupervised learning</li>
                <li>• Deep learning with TensorFlow/PyTorch</li>
                <li>• Model deployment and monitoring</li>
                <li>• MLOps and model lifecycle management</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Predictive Analytics</h2>
              <p className="text-gray-600 mb-4">
                Forecast trends, customer behavior, and business outcomes using advanced statistical methods.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Time series forecasting</li>
                <li>• Customer churn prediction</li>
                <li>• Demand forecasting</li>
                <li>• Risk assessment models</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Data Analytics & Visualization</h2>
              <p className="text-gray-600 mb-4">
                Extract insights from complex datasets and present them through compelling visualizations.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Exploratory data analysis</li>
                <li>• Interactive dashboards</li>
                <li>• Statistical analysis</li>
                <li>• Business intelligence reporting</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Natural Language Processing</h2>
              <p className="text-gray-600 mb-4">
                Extract insights from text data using advanced NLP techniques and large language models.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Sentiment analysis</li>
                <li>• Text classification & extraction</li>
                <li>• Chatbots and conversational AI</li>
                <li>• Document processing automation</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-8 rounded-lg mb-8">
            <h2 className="text-3xl font-semibold mb-4">Why Choose Our Data Science Services?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Proven Methodologies</h3>
                <p className="text-gray-600">Industry-standard approaches to ensure reliable and reproducible results.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Business Impact</h3>
                <p className="text-gray-600">Focus on solutions that drive measurable business outcomes and ROI.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">End-to-End Solutions</h3>
                <p className="text-gray-600">From data collection to model deployment and monitoring.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-semibold mb-4">Ready to Unlock Your Data&apos;s Potential?</h2>
            <p className="text-lg mb-6">
              Let&apos;s explore how data science can transform your business and drive innovation.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Schedule a Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}