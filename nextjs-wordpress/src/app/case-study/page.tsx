import { Metadata } from 'next';
import Link from 'next/link';
import CaseStudiesWithSidebar from '@/components/case-study/CaseStudiesWithSidebar';
import { generatePageMetadata } from '@/lib/seo';
import styles from './page.module.css';

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
  categories?: number[];
  _embedded?: any;
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
      signal: AbortSignal.timeout(15000), // 15 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-App/1.0'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch case studies:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      
      // Try fallback to regular posts with case-study category
      return await getCaseStudiesFromPosts(apiUrl);
    }

    const caseStudies = await response.json();
    
    if (!Array.isArray(caseStudies)) {
      console.error('Invalid case studies response format:', typeof caseStudies);
      return await getCaseStudiesFromPosts(apiUrl);
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
    
    // Remove duplicates by ID and slug
    const uniqueCaseStudies = new Map();
    
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
        acf_fields: cs.acf_fields || cs.acf || {},
        categories: cs.categories || [],
        _embedded: cs._embedded
      };
    });
    
    // Remove duplicates by ID
    processedData.forEach(cs => {
      if (!uniqueCaseStudies.has(cs.id)) {
        uniqueCaseStudies.set(cs.id, cs);
      }
    });
    
    const finalData = Array.from(uniqueCaseStudies.values());
    console.log(`Fetched ${caseStudies.length} case studies, after deduplication: ${finalData.length}`);
    
    return finalData;
  } catch (error) {
    console.error('Error fetching case studies:', error);
    // Try fallback to regular posts
    try {
      const { getWordPressApiUrl } = await import('@/lib/environment');
      const apiUrl = getWordPressApiUrl();
      return await getCaseStudiesFromPosts(apiUrl);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return [];
    }
  }
}

// Fallback function to get case studies from regular posts with case-study category
async function getCaseStudiesFromPosts(apiUrl: string): Promise<ProcessedCaseStudyData[]> {
  try {
    
    const response = await fetch(`${apiUrl}/wp/v2/posts?categories=case-study&per_page=100&_embed`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(15000),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Fallback posts fetch failed:', response.status);
      return [];
    }

    const posts = await response.json();
    
    if (!Array.isArray(posts)) {
      return [];
    }
    
    // Remove duplicates by ID
    const uniquePosts = new Map();
    
    const processedPosts = posts.map((post: any) => ({
      id: post.id,
      title: post.title?.rendered || 'Untitled Case Study',
      slug: post.slug,
      content: post.content?.rendered || '',
      excerpt: post.excerpt?.rendered || '',
      date: post.date,
      featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null,
      blocks: [],
      acf_fields: {},
      categories: post.categories || [],
      _embedded: post._embedded
    }));
    
    // Remove duplicates by ID
    processedPosts.forEach(post => {
      if (!uniquePosts.has(post.id)) {
        uniquePosts.set(post.id, post);
      }
    });
    
    const finalPosts = Array.from(uniquePosts.values());
    console.log(`Fallback: Fetched ${posts.length} posts, after deduplication: ${finalPosts.length}`);
    
    return finalPosts;
  } catch (error) {
    console.error('Fallback posts fetch error:', error);
    return [];
  }
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <div className={styles['case-study-page']}>
      {/* Hero Section */}
      <section className={styles['case-study-hero']}>
        <div className={styles.container}>
          <h1 className={styles['case-study-hero__title']}>Case Studies</h1>
          <p className={styles['case-study-hero__subtitle']}>
            Discover how we&apos;ve helped businesses transform and achieve their goals
          </p>
        </div>
      </section>

      {/* Case Studies Content */}
      <section className={styles['case-study-content-section']}>
        <div className={styles.container}>
          {caseStudies.length === 0 ? (
            <div className={styles['no-case-studies']}>
              <p>No case studies found. Check back soon!</p>
              <p style={{ marginTop: '20px' }}>
                <Link href="/">Go back home</Link>
              </p>
            </div>
          ) : (
            <CaseStudiesWithSidebar caseStudies={caseStudies} />
          )}
        </div>
      </section>
    </div>
  );
}
