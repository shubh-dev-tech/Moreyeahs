import { Metadata } from 'next';
import { WORDPRESS_API_URL } from '@/lib/env';
import { parseBlocks } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WordPressContent } from '@/components/WordPressContent';

export const metadata: Metadata = {
  title: 'Cloud Infrastructure DevOps | MoreYeahs',
  description: 'Expert DevOps services for cloud infrastructure management and automation.',
};

async function getCloudDevOpsPageData() {
  try {
    // Try to fetch using the custom pages-with-blocks endpoint first
    const customResponse = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages-with-blocks/devops`, {
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
    
    // Fallback to standard WordPress API with multiple slug attempts
    const slugs = ['devops', 'cloud-infrastructure-devops', 'cloud-devops'];
    
    for (const slug of slugs) {
      const response = await fetch(`${WORDPRESS_API_URL}/wp/v2/pages?slug=${slug}`, {
        next: { revalidate: 60 }
      });
      
      if (response.ok) {
        const pages = await response.json();
        if (pages && pages.length > 0) {
          return pages[0];
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Cloud Infrastructure DevOps page:', error);
    return null;
  }
}

export default async function CloudInfrastructureDevOpsPage() {
  const pageData = await getCloudDevOpsPageData();

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
          <div className="cloud-infrastructure-devops-page">
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

  // Default DevOps page content - only show if no WordPress page exists
  return (
    <main className="min-h-screen">
      <div className="cloud-infrastructure-devops-page">
        <div className="mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-6">Cloud Infrastructure DevOps</h1>
          
          <div className="prose max-w-none">
            <p className="text-lg mb-8">
              Transform your cloud infrastructure with our specialized DevOps services. We deliver automated, scalable, and secure cloud solutions across AWS, Azure, and Google Cloud platforms.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Cloud-Native CI/CD</h2>
                <p className="text-gray-600 mb-4">
                  Build robust deployment pipelines optimized for cloud infrastructure.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• AWS CodePipeline & CodeBuild</li>
                  <li>• Azure DevOps Pipelines</li>
                  <li>• Google Cloud Build</li>
                  <li>• Multi-cloud deployments</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Infrastructure Automation</h2>
                <p className="text-gray-600 mb-4">
                  Automate cloud infrastructure provisioning and management at scale.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Terraform for multi-cloud</li>
                  <li>• AWS CloudFormation</li>
                  <li>• Azure Resource Manager</li>
                  <li>• Google Cloud Deployment Manager</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Container Orchestration</h2>
                <p className="text-gray-600 mb-4">
                  Deploy and manage containerized applications in the cloud.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Amazon EKS & ECS</li>
                  <li>• Azure Kubernetes Service</li>
                  <li>• Google Kubernetes Engine</li>
                  <li>• Service mesh implementation</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Cloud Security & Compliance</h2>
                <p className="text-gray-600 mb-4">
                  Implement security best practices and compliance automation.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• IAM & access management</li>
                  <li>• Security scanning & auditing</li>
                  <li>• Compliance automation</li>
                  <li>• Secret management</li>
                </ul>
              </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-lg mb-8">
              <h2 className="text-3xl font-semibold mb-4">Cloud Infrastructure Excellence</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="text-xl font-semibold mb-2">Scalability</h3>
                  <p className="text-gray-600">Auto-scaling infrastructure that grows with your business needs.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Reliability</h3>
                  <p className="text-gray-600">High-availability architectures with disaster recovery.</p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Cost Optimization</h3>
                  <p className="text-gray-600">Reduce cloud spending through intelligent resource management.</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h2 className="text-3xl font-semibold mb-4">Ready to Optimize Your Cloud Infrastructure?</h2>
              <p className="text-lg mb-6">
                Let&apos;s discuss how our cloud infrastructure DevOps services can accelerate your digital transformation.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started
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
