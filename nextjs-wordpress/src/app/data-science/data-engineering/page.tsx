import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';
import { parseBlocks } from '@/lib/blocks';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('data-engineering');
}

async function getDataEngineeringPageData() {
  try {
    // Try to fetch the Data Science Data Engineering page from WordPress
    const response = await fetch(
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=data-engineering&parent=data-science`,
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
      `${WORDPRESS_API_URL}/wp/v2/pages?slug=data-engineering`,
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
    console.error('Error fetching Data Engineering page:', error);
    return null;
  }
}

export default async function DataEngineeringPage() {
  const pageData = await getDataEngineeringPageData();

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
          <div className="data-engineering-page">
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
      <div className="data-engineering-page">
        <div className="mx-auto px-4 py-8">
          <div className="hero-section mb-12">
            <h1 className="text-4xl font-bold mb-6">Data Engineering</h1>
            <div className="bg-cyan-400 p-8 rounded-lg text-white mb-8">
              <h2 className="text-3xl font-bold mb-4">Data Engineering Solutions</h2>
              <p className="text-lg">
                Build scalable data infrastructure that powers your analytics and AI initiatives. 
                We design and implement robust data pipelines, warehouses, and lakes that transform 
                raw data into trusted, analytics-ready assets for data-driven decision making.
              </p>
            </div>
          </div>

          <div className="services-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Our Data Engineering Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Data Pipeline Development</h3>
                <p className="text-gray-600">
                  Design and build ETL/ELT pipelines using Apache Airflow, Azure Data Factory, 
                  AWS Glue, and other modern tools.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Data Warehouse Design</h3>
                <p className="text-gray-600">
                  Implement scalable data warehouses using Snowflake, BigQuery, Redshift, 
                  or Azure Synapse Analytics.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Data Lake Architecture</h3>
                <p className="text-gray-600">
                  Build data lakes on AWS S3, Azure Data Lake, or Google Cloud Storage 
                  for storing structured and unstructured data.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Real-Time Streaming</h3>
                <p className="text-gray-600">
                  Process streaming data with Apache Kafka, Spark Streaming, or 
                  cloud-native solutions for real-time insights.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Data Quality & Governance</h3>
                <p className="text-gray-600">
                  Implement data validation, lineage tracking, and governance frameworks 
                  to ensure data accuracy and compliance.
                </p>
              </div>

              <div className="service-card p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <h3 className="text-xl font-semibold mb-4">Performance Optimization</h3>
                <p className="text-gray-600">
                  Optimize query performance, reduce costs, and improve data processing 
                  efficiency through best practices and tuning.
                </p>
              </div>
            </div>
          </div>

          <div className="technologies-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Technologies We Use</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Apache Spark</p>
              </div>
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Apache Airflow</p>
              </div>
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">dbt</p>
              </div>
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Snowflake</p>
              </div>
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Apache Kafka</p>
              </div>
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Databricks</p>
              </div>
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">Python</p>
              </div>
              <div className="tech-item p-4 bg-gray-50 rounded-lg text-center">
                <p className="font-semibold">SQL</p>
              </div>
            </div>
          </div>

          <div className="benefits-section mb-12">
            <h2 className="text-3xl font-bold mb-8">Why Choose Our Data Engineering Services?</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Scalable Architecture</h4>
                  <p className="text-gray-600">
                    Build systems that grow with your data volume and business needs 
                    without performance degradation.
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
                    Reduce infrastructure costs through efficient design and cloud 
                    resource optimization.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Data Quality Assurance</h4>
                  <p className="text-gray-600">
                    Ensure data accuracy, consistency, and reliability with robust 
                    validation and monitoring.
                  </p>
                </div>
              </div>

              <div className="benefit-item flex items-start">
                <div className="flex-shrink-0 w-8 h-8 bg-cyan-400 rounded-full flex items-center justify-center text-white font-bold mr-4">
                  ✓
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Best Practices</h4>
                  <p className="text-gray-600">
                    Follow industry standards for security, compliance, and data 
                    governance from day one.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="cta-section text-center bg-gray-50 p-12 rounded-lg">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Your Data Infrastructure?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Let&apos;s discuss how modern data engineering can power your analytics and AI initiatives.
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
