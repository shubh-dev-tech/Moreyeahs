import { Metadata } from 'next';
import Link from 'next/link';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { sanitizeWordPressContent } from '@/lib/wordpress-content';

export const metadata: Metadata = {
  title: 'Our Services | MoreYeahs',
  description: 'Explore our comprehensive range of professional services designed to help your business grow.',
};

async function getServicesPageData() {
  try {
    // Try to fetch a services page from WordPress using standard endpoint
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages?slug=services`);
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching services page:', error);
    return null;
  }
}

export default async function ServicesPage() {
  const pageData = await getServicesPageData();

  if (pageData) {
    // If WordPress page exists, render it with blocks
    return (
      <div className="services-page">
        <div className="mx-auto px-4 py-8">
          <div 
            className="content mb-8"
            dangerouslySetInnerHTML={{ __html: sanitizeWordPressContent(pageData.content.rendered) }}
          />
          {pageData.acf && pageData.acf.blocks && (
            <BlockRenderer blocks={pageData.acf.blocks} />
          )}
        </div>
      </div>
    );
  }

  // Default services page content
  return (
    <div className="services-page">
      <div className="mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Our Services</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-12">
            We offer a comprehensive range of professional services to help your business thrive in today&apos;s digital landscape.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/services/devops" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">
                  DevOps Services
                </h2>
                <p className="text-gray-600">
                  Streamline your development workflow with CI/CD pipelines, infrastructure as code, and automated deployments.
                </p>
                <div className="mt-4 text-blue-600 font-medium">
                  Learn More →
                </div>
              </div>
            </Link>

            <Link href="/services/data-engineering" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">
                  Data Engineering
                </h2>
                <p className="text-gray-600">
                  Build scalable data pipelines, ETL processes, and analytics infrastructure to unlock the value in your data.
                </p>
                <div className="mt-4 text-blue-600 font-medium">
                  Learn More →
                </div>
              </div>
            </Link>

            <Link href="/services/data-science" className="group">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-2xl font-semibold mb-4 group-hover:text-blue-600 transition-colors">
                  Data Science
                </h2>
                <p className="text-gray-600">
                  Transform your data into actionable insights with machine learning, analytics, and predictive modeling.
                </p>
                <div className="mt-4 text-blue-600 font-medium">
                  Learn More →
                </div>
              </div>
            </Link>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Web Development</h2>
              <p className="text-gray-600">
                Custom web applications built with modern technologies like React, Next.js, and WordPress.
              </p>
              <div className="mt-4 text-gray-400 font-medium">
                Coming Soon
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Cloud Solutions</h2>
              <p className="text-gray-600">
                Scalable cloud infrastructure and migration services for AWS, Azure, and Google Cloud.
              </p>
              <div className="mt-4 text-gray-400 font-medium">
                Coming Soon
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Consulting</h2>
              <p className="text-gray-600">
                Strategic technology consulting to help you make informed decisions about your tech stack.
              </p>
              <div className="mt-4 text-gray-400 font-medium">
                Coming Soon
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Support & Maintenance</h2>
              <p className="text-gray-600">
                Ongoing support and maintenance services to keep your systems running smoothly.
              </p>
              <div className="mt-4 text-gray-400 font-medium">
                Coming Soon
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Training</h2>
              <p className="text-gray-600">
                Professional training programs for your team on modern development practices and tools.
              </p>
              <div className="mt-4 text-gray-400 font-medium">
                Coming Soon
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg mt-12">
            <h2 className="text-3xl font-semibold mb-4">Need a Custom Solution?</h2>
            <p className="text-lg mb-6">
              Don&apos;t see exactly what you&apos;re looking for? We specialize in creating custom solutions tailored to your specific needs.
            </p>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
              Get in Touch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}