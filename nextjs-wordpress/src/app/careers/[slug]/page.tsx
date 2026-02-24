import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CareerDetailPage from '@/components/careers/CareerDetailPage';
import ErrorBoundary from '@/components/ErrorBoundary';
import { generatePostMetadata } from '@/lib/seo';

interface CareerPageProps {
  params: {
    slug: string;
  };
}

interface CareerData {
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
  acf_fields?: any;
  _embedded?: any;
}

async function getCareer(slug: string): Promise<CareerData | null> {
  try {
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();
    
    if (!slug || typeof slug !== 'string') {
      console.error('Invalid slug provided:', slug);
      return null;
    }

    const response = await fetch(`${apiUrl}/wp/v2/careers?slug=${encodeURIComponent(slug)}&_embed`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(10000),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch career: ${response.status}`);
      return null;
    }

    const careers = await response.json();
    if (!careers || !Array.isArray(careers) || careers.length === 0) {
      console.warn('No careers found for slug:', slug);
      return null;
    }

    const career = careers[0];
    
    if (!career.id || !career.title) {
      console.error('Invalid career data structure:', career);
      return null;
    }
    
    // Fetch ACF fields separately if not included
    if (!career.acf_fields && !career.acf) {
      try {
        const acfResponse = await fetch(`${apiUrl}/wp/v2/careers/${career.id}?acf_format=standard`, {
          next: { revalidate: 60 },
          signal: AbortSignal.timeout(5000),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          }
        });
        
        if (acfResponse.ok) {
          const acfData = await acfResponse.json();
          career.acf_fields = acfData.acf || acfData.acf_fields || {};
        } else {
          career.acf_fields = {};
        }
      } catch (error) {
        console.warn('Failed to fetch ACF fields:', error);
        career.acf_fields = {};
      }
    } else {
      career.acf_fields = career.acf_fields || career.acf || {};
    }

    return career;
  } catch (error) {
    console.error('Error fetching career:', error);
    return null;
  }
}

export async function generateMetadata({ params }: CareerPageProps): Promise<Metadata> {
  return generatePostMetadata(params.slug, 'careers');
}

export async function generateStaticParams() {
  try {
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();

    const response = await fetch(`${apiUrl}/wp/v2/careers?per_page=20`, {
      signal: AbortSignal.timeout(10000),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch careers for static generation: ${response.status}`);
      return [];
    }

    const careers = await response.json();
    
    if (!Array.isArray(careers)) {
      return [];
    }
    
    return careers.map((career: any) => ({
      slug: career.slug
    }));
  } catch (error) {
    console.warn('Error generating static params:', error);
    return [];
  }
}

export default async function CareerPage({ params }: CareerPageProps) {
  const career = await getCareer(params.slug);

  if (!career) {
    notFound();
  }

  return (
    <main className="career-main">
      <ErrorBoundary>
        <CareerDetailPage career={career} />
      </ErrorBoundary>
    </main>
  );
}
