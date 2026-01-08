import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';

export const metadata: Metadata = {
  title: 'Data Engineering Services | MoreYeahs',
  description: 'Professional data engineering services to build scalable data pipelines, ETL processes, and data infrastructure for your business.',
};

async function getDataEngineeringPageData() {
  try {
    // Try to fetch a specific Data Engineering page from WordPress using standard endpoint
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages?slug=data-engineering`);
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    // If no specific page exists, return null to show default content
    return null;
  } catch (error) {
    console.error('Error fetching Data Engineering page:', error);
    return null;
  }
}

export default async function DataEngineeringPage() {
  const pageData = await getDataEngineeringPageData();

  if (pageData) {
    // If WordPress page exists, render it with blocks
    return (
      <div className="data-engineering-page">
        <div className="mx-auto px-4 py-8">
          <div 
            className="content mb-8"
            dangerouslySetInnerHTML={{ __html: pageData.content.rendered }}
          />
          {pageData.acf && pageData.acf.blocks && (
            <BlockRenderer blocks={pageData.acf.blocks} />
          )}
        </div>
      </div>
    );
  }

  // Default Data Engineering page content
  return (
    <div className="data-engineering-page">
      <div className="mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Data Engineering Services</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            Build robust, scalable data infrastructure with our comprehensive data engineering services. 
            We help organizations design and implement data pipelines, ETL processes, and analytics platforms 
            that turn raw data into actionable insights.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Data Pipeline Development</h2>
              <p className="text-gray-600 mb-4">
                Design and build scalable data pipelines that efficiently process and transform your data.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Apache Airflow & Prefect</li>
                <li>• Real-time streaming with Kafka</li>
                <li>• Batch processing with Spark</li>
                <li>• Cloud-native solutions (AWS, GCP, Azure)</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">ETL/ELT Solutions</h2>
              <p className="text-gray-600 mb-4">
                Extract, transform, and load data from multiple sources into your data warehouse or lake.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Custom ETL pipeline development</li>
                <li>• Data validation and quality checks</li>
                <li>• Schema evolution management</li>
                <li>• Error handling and monitoring</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Data Warehouse & Lake</h2>
              <p className="text-gray-600 mb-4">
                Build modern data storage solutions optimized for analytics and machine learning.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Snowflake, BigQuery, Redshift</li>
                <li>• Data lake architecture (S3, ADLS)</li>
                <li>• Data modeling and optimization</li>
                <li>• Cost optimization strategies</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Analytics Infrastructure</h2>
              <p className="text-gray-600 mb-4">
                Set up the foundation for advanced analytics, reporting, and machine learning.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• dbt for data transformation</li>
                <li>• BI tool integration</li>
                <li>• ML pipeline infrastructure</li>
                <li>• Data governance frameworks</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-8 rounded-lg mb-8">
            <h2 className="text-3xl font-semibold mb-4">Why Choose Our Data Engineering Services?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Scalable Architecture</h3>
                <p className="text-gray-600">Build systems that grow with your data and business needs.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Cost Optimization</h3>
                <p className="text-gray-600">Efficient designs that minimize cloud costs while maximizing performance.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Data Quality</h3>
                <p className="text-gray-600">Robust validation and monitoring to ensure data reliability.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-semibold mb-4">Ready to Build Your Data Infrastructure?</h2>
            <p className="text-lg mb-6">
              Let&apos;s discuss how our data engineering expertise can help unlock the value in your data.
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