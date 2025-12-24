import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseStudyPage from '@/components/case-study/CaseStudyPage';
import { CaseStudyData } from '@/components/case-study';

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

// Fetch case study data from WordPress API
async function getCaseStudy(slug: string): Promise<CaseStudyData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL || 'http://localhost';
    
    // Use standard WordPress REST API endpoint
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/case_study?slug=${slug}&_embed`, {
      next: { revalidate: 60 } // Revalidate every minute
    });

    if (!response.ok) {
      return null;
    }

    const caseStudies = await response.json();
    if (!caseStudies || caseStudies.length === 0) {
      return null;
    }

    const caseStudy = caseStudies[0];
    
    // Helper function to extract rendered content
    const extractRendered = (field: any): string => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      if (field.rendered) return field.rendered;
      return '';
    };
    
    // Extract title from HTML content if WordPress title is empty
    const extractTitleFromContent = (content: string): string => {
      if (!content) return 'Untitled Case Study';
      // Try to find h1 tag
      const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/);
      if (h1Match) return h1Match[1];
      return 'Case Study';
    };
    
    // Parse blocks from content if available
    const contentRendered = extractRendered(caseStudy.content);
    const blocks = contentRendered ? parseWordPressBlocks(contentRendered) : [];
    
    const rawTitle = extractRendered(caseStudy.title);
    const rawExcerpt = extractRendered(caseStudy.excerpt);
    
    // If title is empty, extract from content
    const finalTitle = rawTitle.trim() || extractTitleFromContent(contentRendered);
    const finalExcerpt = rawExcerpt.trim() || contentRendered.replace(/<[^>]+>/g, '').substring(0, 200);

    return {
      id: caseStudy.id,
      title: finalTitle,
      slug: caseStudy.slug,
      content: contentRendered,
      excerpt: finalExcerpt,
      date: caseStudy.date,
      featured_image: caseStudy._embedded?.['wp:featuredmedia']?.[0]?.source_url || caseStudy.featured_image,
      blocks: blocks,
      acf_fields: caseStudy.acf_fields || caseStudy.acf || {}
    };
  } catch (error) {
    console.error('Error fetching case study:', error);
    return null;
  }
}

// Simple WordPress block parser
function parseWordPressBlocks(content: string): any[] {
  // This is a simplified parser
  // In production, use @wordpress/block-serialization-default-parser
  const blockPattern = /<!--\s+wp:(\S+)\s+(\{[^}]+\})?\s+-->/g;
  const blocks: any[] = [];
  let match;

  while ((match = blockPattern.exec(content)) !== null) {
    const blockName = match[1];
    const attrs = match[2] ? JSON.parse(match[2]) : {};
    
    blocks.push({
      blockName: `acf/${blockName.replace('acf/', '')}`,
      attrs: attrs,
      innerBlocks: [],
      innerHTML: '',
      innerContent: []
    });
  }

  return blocks;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  const caseStudy = await getCaseStudy(params.slug);

  if (!caseStudy) {
    return {
      title: 'Case Study Not Found',
      description: 'The requested case study could not be found.'
    };
  }

  const title = typeof caseStudy.title === 'string' ? caseStudy.title : 'Case Study';
  const excerpt = typeof caseStudy.excerpt === 'string' ? caseStudy.excerpt : '';
  
  return {
    title: `${title} - Case Study`,
    description: excerpt || `Read our case study about ${title}`,
    openGraph: {
      title: `${title} - Case Study`,
      description: excerpt || `Read our case study about ${title}`,
      type: 'article',
      publishedTime: caseStudy.date,
      images: caseStudy.featured_image ? [
        {
          url: caseStudy.featured_image,
          width: 1200,
          height: 630,
          alt: caseStudy.title
        }
      ] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Case Study`,
      description: excerpt || `Read our case study about ${title}`,
      images: caseStudy.featured_image ? [caseStudy.featured_image] : []
    }
  };
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL || 'http://localhost';
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/case_study?per_page=100`);
    
    if (!response.ok) {
      return [];
    }

    const caseStudies = await response.json();
    
    return caseStudies.map((caseStudy: CaseStudyData) => ({
      slug: caseStudy.slug
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function CaseStudyPageRoute({ params }: CaseStudyPageProps) {
  const caseStudy = await getCaseStudy(params.slug);

  if (!caseStudy) {
    notFound();
  }

  return (
    <main className="case-study-main">
      <CaseStudyPage caseStudy={caseStudy} />
    </main>
  );
}