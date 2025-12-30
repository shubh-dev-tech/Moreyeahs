import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CaseStudyTemplatePage from '@/components/case-study/CaseStudyTemplatePage';
import ErrorBoundary from '@/components/ErrorBoundary';

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
    
    // Validate slug
    if (!slug || typeof slug !== 'string') {
      console.error('Invalid slug provided:', slug);
      return null;
    }
    
    console.log('Fetching case study from:', apiUrl);
    
    // Use standard WordPress REST API endpoint
    const response = await fetch(`${apiUrl}/wp/v2/case_study?slug=${encodeURIComponent(slug)}&_embed`, {
      next: { revalidate: 60 }, // Revalidate every minute
      // Add timeout for build process
      signal: AbortSignal.timeout(10000), // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch case study: ${response.status} ${response.statusText}`);
      return null;
    }

    const caseStudies = await response.json();
    if (!caseStudies || !Array.isArray(caseStudies) || caseStudies.length === 0) {
      console.warn('No case studies found for slug:', slug);
      return null;
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
            'Content-Type': 'application/json'
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
    return null;
  }
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

  const title = caseStudy.acf_fields?.header_section?.title || 
               caseStudy.title?.rendered || 
               'Case Study';
  const description = caseStudy.acf_fields?.header_section?.subtitle || 
                     caseStudy.excerpt?.rendered?.replace(/<[^>]*>/g, '') || 
                     `Read our case study about ${title}`;
  
  return {
    title: `${title} - Case Study`,
    description,
    openGraph: {
      title: `${title} - Case Study`,
      description,
      type: 'article',
      publishedTime: caseStudy.date,
      images: caseStudy._embedded?.['wp:featuredmedia']?.[0]?.source_url ? [
        {
          url: caseStudy._embedded['wp:featuredmedia'][0].source_url,
          width: 1200,
          height: 630,
          alt: title
        }
      ] : []
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - Case Study`,
      description,
      images: caseStudy._embedded?.['wp:featuredmedia']?.[0]?.source_url ? 
              [caseStudy._embedded['wp:featuredmedia'][0].source_url] : []
    }
  };
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  try {
    // Use environment-aware URL detection
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();
    
    console.log('Generating static params from:', apiUrl);
    
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