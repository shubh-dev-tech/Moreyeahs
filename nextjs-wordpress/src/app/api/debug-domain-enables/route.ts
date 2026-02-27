import { NextResponse } from 'next/server';
import { wpFetch } from '@/lib/wpFetch';

export async function GET() {
  try {
    // Try to fetch a page that might have domain enables section
    const pages = await wpFetch('/wp/v2/pages?per_page=20');
    
    if (!pages || !Array.isArray(pages)) {
      return NextResponse.json({ error: 'No pages found' });
    }
    
    // Look for pages with domain enables blocks
    const pagesWithDomainEnables = [];
    
    for (const page of pages) {
      // Check if page has ACF data
      if (page.acf) {
        // Look for domain enables related fields
        const domainEnablesFields = Object.keys(page.acf).filter(key => 
          key.includes('domain_enables') || key.includes('feature_points')
        );
        
        if (domainEnablesFields.length > 0) {
          pagesWithDomainEnables.push({
            id: page.id,
            title: page.title?.rendered || 'No title',
            slug: page.slug,
            domainEnablesFields,
            acfData: page.acf
          });
        }
      }
      
      // Also check content for domain enables blocks
      if (page.content?.rendered && page.content.rendered.includes('domain-enables')) {
        pagesWithDomainEnables.push({
          id: page.id,
          title: page.title?.rendered || 'No title',
          slug: page.slug,
          hasBlockInContent: true,
          contentSnippet: page.content.rendered.substring(0, 500)
        });
      }
    }
    
    return NextResponse.json({
      totalPages: pages.length,
      pagesWithDomainEnables,
      samplePageAcf: pages[0]?.acf || null
    });
    
  } catch (error) {
    console.error('Debug domain enables error:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch debug data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}