import { Metadata } from 'next';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WORDPRESS_API_URL } from '@/lib/env';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('devops');
}

async function getDevOpsPageData() {
  try {
    // Try to fetch a specific DevOps page from WordPress using standard endpoint
    const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages?slug=devops`);
    
    if (response.ok) {
      const pages = await response.json();
      if (pages && pages.length > 0) {
        return pages[0];
      }
    }
    
    // If no specific page exists, return null to show default content
    return null;
  } catch (error) {
    console.error('Error fetching DevOps page:', error);
    return null;
  }
}

export default async function DevOpsPage() {
  const pageData = await getDevOpsPageData();

  if (pageData) {
    // If WordPress page exists, render it with blocks
    return (
      <div className="devops-page">
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

  // Default DevOps page content
  return (
    <div className="devops-page">
      <div className="mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">DevOps Services</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg mb-8">
            Streamline your development workflow with our comprehensive DevOps services. We help organizations implement modern development practices, automate deployments, and build scalable infrastructure.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">CI/CD Pipelines</h2>
              <p className="text-gray-600 mb-4">
                Automated build, test, and deployment pipelines that reduce manual errors and accelerate delivery.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• GitHub Actions & GitLab CI</li>
                <li>• Jenkins & Azure DevOps</li>
                <li>• Automated testing integration</li>
                <li>• Multi-environment deployments</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Infrastructure as Code</h2>
              <p className="text-gray-600 mb-4">
                Manage your infrastructure through code for consistency, version control, and repeatability.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Terraform & CloudFormation</li>
                <li>• Ansible & Puppet</li>
                <li>• Docker & Kubernetes</li>
                <li>• Infrastructure monitoring</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Cloud Migration</h2>
              <p className="text-gray-600 mb-4">
                Seamless migration to cloud platforms with minimal downtime and maximum efficiency.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• AWS, Azure, Google Cloud</li>
                <li>• Containerization strategies</li>
                <li>• Database migration</li>
                <li>• Performance optimization</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-semibold mb-4">Monitoring & Logging</h2>
              <p className="text-gray-600 mb-4">
                Comprehensive monitoring solutions to ensure system reliability and performance.
              </p>
              <ul className="text-sm text-gray-600 space-y-2">
                <li>• Prometheus & Grafana</li>
                <li>• ELK Stack (Elasticsearch, Logstash, Kibana)</li>
                <li>• Application performance monitoring</li>
                <li>• Alert management</li>
              </ul>
            </div>
          </div>

          <div className="bg-blue-50 p-8 rounded-lg mb-8">
            <h2 className="text-3xl font-semibold mb-4">Why Choose Our DevOps Services?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Faster Delivery</h3>
                <p className="text-gray-600">Reduce deployment time from hours to minutes with automated pipelines.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Higher Quality</h3>
                <p className="text-gray-600">Automated testing and quality gates ensure reliable releases.</p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Cost Efficiency</h3>
                <p className="text-gray-600">Optimize resource usage and reduce operational overhead.</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-semibold mb-4">Ready to Transform Your Development Process?</h2>
            <p className="text-lg mb-6">
              Let&apos;s discuss how our DevOps services can help your team deliver better software faster.
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