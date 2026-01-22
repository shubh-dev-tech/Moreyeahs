import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseStudyTemplatePage from '@/components/case-study/CaseStudyTemplatePage';
import ErrorBoundary from '@/components/ErrorBoundary';
import { generatePostMetadata } from '@/lib/seo';
import { sanitizeSlug, isValidSlug, isMalformedSlug } from '@/utils/slugUtils';

interface CaseStudyPageProps {
  params: {
    slug: string;
  };
}

interface CaseStudyData {
  id: number;
  title: {
    rendered: string;
  };
  slug: string;
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  date: string;
  featured_image?: string;
  acf_fields?: any;
  _embedded?: any;
}

// Fetch case study data from WordPress API
async function getCaseStudy(slug: string): Promise<CaseStudyData | null> {
  try {
    // Use environment-aware URL detection
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();
    
    // Validate and sanitize slug
    if (!slug || typeof slug !== 'string') {
      console.error('Invalid slug provided:', slug);
      return null;
    }
    
    // Check if slug is malformed and reject it early
    if (isMalformedSlug(slug)) {
      console.error('Malformed slug detected:', slug);
      return null;
    }
    
    // Sanitize slug - remove invalid characters and limit length
    const sanitizedSlug = sanitizeSlug(slug);
    
    // If slug is invalid after sanitization, return null
    if (!isValidSlug(sanitizedSlug)) {
      console.error('Slug invalid after sanitization:', sanitizedSlug);
      return null;
    }
    
    // Use standard WordPress REST API endpoint
    const response = await fetch(`${apiUrl}/wp/v2/case_study?slug=${encodeURIComponent(sanitizedSlug)}&_embed`, {
      next: { revalidate: 60 }, // Revalidate every minute
      // Add timeout for build process
      signal: AbortSignal.timeout(10000), // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-App/1.0'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch case study: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error('Error response body:', errorText);
      
      // Try fallback to regular posts with case-study category
      return await getCaseStudyFromPosts(slug, apiUrl);
    }

    const caseStudies = await response.json();
    if (!caseStudies || !Array.isArray(caseStudies) || caseStudies.length === 0) {
      console.warn('No case studies found for slug:', slug);
      // Try fallback to regular posts
      return await getCaseStudyFromPosts(slug, apiUrl);
    }

    const caseStudy = caseStudies[0];
    
    // Validate required fields
    if (!caseStudy.id || !caseStudy.title) {
      console.error('Invalid case study data structure:', caseStudy);
      return null;
    }
    
    // Fetch ACF fields separately if not included
    if (!caseStudy.acf_fields && !caseStudy.acf) {
      try {
        const acfResponse = await fetch(`${apiUrl}/wp/v2/case_study/${caseStudy.id}?acf_format=standard`, {
          next: { revalidate: 60 },
          signal: AbortSignal.timeout(5000), // 5 second timeout for ACF
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'NextJS-App/1.0'
          }
        });
        
        if (acfResponse.ok) {
          const acfData = await acfResponse.json();
          caseStudy.acf_fields = acfData.acf || acfData.acf_fields || {};
        } else {
          console.warn('Failed to fetch ACF fields, using empty object');
          caseStudy.acf_fields = {};
        }
      } catch (error) {
        console.warn('Failed to fetch ACF fields:', error);
        caseStudy.acf_fields = {};
      }
    } else {
      caseStudy.acf_fields = caseStudy.acf_fields || caseStudy.acf || {};
    }

    return caseStudy;
  } catch (error) {
    console.error('Error fetching case study:', error);
    // Try fallback to regular posts
    try {
      const { getWordPressApiUrl } = await import('@/lib/environment');
      const apiUrl = getWordPressApiUrl();
      return await getCaseStudyFromPosts(slug, apiUrl);
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return null;
    }
  }
}

// Fallback function to get case study from regular posts with case-study category
async function getCaseStudyFromPosts(slug: string, apiUrl: string): Promise<CaseStudyData | null> {
  try {
    // Sanitize slug for fallback as well
    const sanitizedSlug = sanitizeSlug(slug);
    
    if (!isValidSlug(sanitizedSlug)) {
      return null;
    }
    
    const response = await fetch(`${apiUrl}/wp/v2/posts?slug=${encodeURIComponent(sanitizedSlug)}&categories=case-study&_embed`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(10000),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-App/1.0'
      }
    });

    if (!response.ok) {
      console.error('Fallback post fetch failed:', response.status);
      return null;
    }

    const posts = await response.json();
    
    if (!Array.isArray(posts) || posts.length === 0) {
      return null;
    }
    
    const post = posts[0];
    
    // Transform post to case study format
    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      date: post.date,
      featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url,
      acf_fields: post.acf || {},
      _embedded: post._embedded
    };
  } catch (error) {
    console.error('Fallback post fetch error:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: CaseStudyPageProps): Promise<Metadata> {
  return generatePostMetadata(params.slug, 'case_study');
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  try {
    // Use environment-aware URL detection
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();
    

    
    const response = await fetch(`${apiUrl}/wp/v2/case_study?per_page=100`, {
      // Add timeout and retry logic for build process
      signal: AbortSignal.timeout(10000), // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch case studies for static generation: ${response.status}`);
      return [];
    }

    const caseStudies = await response.json();
    
    if (!Array.isArray(caseStudies)) {
      console.warn('Invalid case studies response format');
      return [];
    }
    
    return caseStudies.map((caseStudy: any) => ({
      slug: caseStudy.slug
    }));
  } catch (error) {
    console.warn('Error generating static params (will use dynamic rendering):', error);
    // Return empty array to allow dynamic rendering
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
      <ErrorBoundary>
        <CaseStudyTemplatePage caseStudy={caseStudy} />
      </ErrorBoundary>
    </main>
  );
}