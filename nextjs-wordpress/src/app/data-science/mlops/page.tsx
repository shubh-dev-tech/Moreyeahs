import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('mlops');
}

async function getMLOpsPageData() {
  try {
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=mlops&parent=data-science`,
      { next: { revalidate: 60 } }
    );
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    const fallbackResponse = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=mlops`,
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
    console.error('Error fetching MLOps page:', error);
    return null;
  }
}

export default async function MLOpsPage() {
  const pageData = await getMLOpsPageData();

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
          <div className="mlops-page">
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
      <div className="mlops-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">MLOps</h1>
            <div className="bg-cyan-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Machine Learning Operations</h2>
              <p className="text-lg">
                Streamline your ML lifecycle with robust MLOps practices. From model development 
                to deployment and monitoring, we help you build scalable, reliable, and automated 
                machine learning pipelines that deliver consistent results in production.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our MLOps Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">CI/CD for ML</h3>
                <p className="text-gray-600">
                  Implement continuous integration and deployment pipelines for machine learning 
                  models with automated testing and validation.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Model Monitoring</h3>
                <p className="text-gray-600">
                  Track model performance, detect drift, and ensure your models maintain 
                  accuracy in production environments.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Experiment Tracking</h3>
                <p className="text-gray-600">
                  Manage experiments, track metrics, and version models with tools like 
                  MLflow, Weights & Biases, and Neptune.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Model Registry</h3>
                <p className="text-gray-600">
                  Centralize model versioning, metadata, and lifecycle management with 
                  enterprise-grade model registries.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Feature Stores</h3>
                <p className="text-gray-600">
                  Build and manage feature pipelines with centralized feature stores for 
                  consistent training and serving.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Model Deployment</h3>
                <p className="text-gray-600">
                  Deploy models to production with containerization, orchestration, and 
                  scalable serving infrastructure.
                </p>
              </div>
            </div>
          </div>

          <div className="use-cases-section mb-12">
            <h2 className="text-3xl font-bold mb-8">MLOps Best Practices</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Automated Retraining</h4>
                <p className="text-gray-600">
                  Set up automated pipelines that retrain models when performance degrades 
                  or new data becomes available.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">A/B Testing</h4>
                <p className="text-gray-600">
                  Deploy multiple model versions simultaneously and compare performance 
                  with controlled experiments.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Data Versioning</h4>
                <p className="text-gray-600">
                  Track and version datasets alongside models to ensure reproducibility 
                  and auditability.
                </p>
              </div>

              <div className="use-case-item p-6 bg-gray-50 rounded-lg">
                <h4 className="font-semibold mb-3 text-lg">Model Governance</h4>
                <p className="text-gray-600">
                  Implement compliance, security, and governance frameworks for enterprise 
                  ML deployments.
                </p>
              </div>
            </div>
          </div>

          <div className="frameworks-section mb-12">
            <h2 className="text-3xl font-bold mb-8">MLOps Tools & Platforms</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">MLflow</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Kubeflow</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Azure ML</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">AWS SageMaker</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Vertex AI</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">DVC</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Feast</p>
              </div>
              <div className="framework-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Airflow</p>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-gray-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Scale Your ML Operations?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s build robust MLOps pipelines that accelerate your ML initiatives and ensure production reliability.
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

export const revalidate = 60;
