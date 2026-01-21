import { Metadata } from 'next';
import Link from 'next/link';
import CaseStudyCard from '@/components/case-study/CaseStudyCard';
import { generatePageMetadata } from '@/lib/seo';

// Interface for processed case study data (strings only)
interface ProcessedCaseStudyData {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  featured_image: string | null;
  blocks: any[];
  acf_fields: any;
}

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('case-study');
}

// Fetch all case studies from WordPress API
async function getCaseStudies(): Promise<ProcessedCaseStudyData[]> {
  try {
    // Use environment-aware URL detection
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();
    

    
    const response = await fetch(`${apiUrl}/wp/v2/case_study?per_page=100&_embed`, {
      next: { revalidate: 60 },
      // Add timeout for build process
      signal: AbortSignal.timeout(10000), // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch case studies:', response.status);
      return [];
    }

    const caseStudies = await response.json();
    
    if (!Array.isArray(caseStudies)) {
      console.error('Invalid case studies response format');
      return [];
    }
    
    // Extract rendered content helper
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
    
    const processedData = caseStudies.map((cs: any) => {
      const rawTitle = extractRendered(cs.title);
      const content = extractRendered(cs.content);
      const excerpt = extractRendered(cs.excerpt);
      
      // If title is empty, extract from content
      const finalTitle = rawTitle.trim() || extractTitleFromContent(content);
      
      // If excerpt is empty, extract from content
      const finalExcerpt = excerpt.trim() || content.replace(/<[^>]+>/g, '').substring(0, 200);
      
      return {
        id: cs.id,
        title: finalTitle,
        slug: cs.slug,
        content: content,
        excerpt: finalExcerpt,
        date: cs.date,
        featured_image: cs._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null,
        blocks: [],
        acf_fields: cs.acf_fields || cs.acf || {}
      };
    });
    
    return processedData;
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return [];
  }
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <main className="case-studies-archive">
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px' }}>
        <header style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px', fontWeight: 'bold' }}>
            Case Studies
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#666', maxWidth: '700px', margin: '0 auto' }}>
            Discover how we&apos;ve helped businesses transform and achieve their goals
          </p>
        </header>

        {caseStudies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <p style={{ fontSize: '1.25rem', color: '#666' }}>No case studies found.</p>
            <p style={{ marginTop: '20px' }}>
              <Link href="/" style={{ color: '#0070f3', textDecoration: 'underline' }}>
                Go back home
              </Link>
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: '30px'
          }}>
            {caseStudies.map((caseStudy) => (
              <CaseStudyCard
                key={caseStudy.id}
                id={caseStudy.id}
                title={caseStudy.title}
                slug={caseStudy.slug}
                excerpt={caseStudy.excerpt}
                featured_image={caseStudy.featured_image ?? null}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
