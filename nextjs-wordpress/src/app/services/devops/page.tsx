import { Metadata } from 'next';
import { wpFetch } from '@/lib/wpFetch';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

export const metadata: Metadata = {
  title: 'DevOps Services | MoreYeahs',
  description: 'Professional DevOps services to streamline your development and deployment processes.',
};

async function getDevOpsPageData() {
  try {
    // Try to fetch a specific DevOps page from WordPress
    const response = await wpFetch('/wp/v2/pages?slug=devops');
    
    if (response && response.length > 0) {
      return response[0];
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

}