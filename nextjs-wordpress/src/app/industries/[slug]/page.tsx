import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { generatePageMetadata } from '@/lib/seo';

interface IndustryData {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  featured_image: string | null;
  acf_fields: any;
}

interface IndustryPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the industry page
export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const industry = await getIndustryBySlug(params.slug);
  
  if (!industry) {
    return {
      title: 'Industry Not Found',
      description: 'The requested industry page could not be found.'
    };
  }

  return {
    title: industry.title,
    description: industry.excerpt.replace(/<[^>]+>/g, '').substring(0, 160),
    openGraph: {
      title: industry.title,
      description: industry.excerpt.replace(/<[^>]+>/g, '').substring(0, 160),
      images: industry.featured_image ? [industry.featured_image] : [],
    },
  };
}

// Fetch industry by slug
async function getIndustryBySlug(slug: string): Promise<IndustryData | null> {
  try {
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();
    
    // Try industries custom post type first
    let response = await fetch(`${apiUrl}/wp/v2/industries?slug=${slug}&_embed`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(15000),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-App/1.0'
      }
    });

    // If industries custom post type doesn't exist, try posts
    if (!response.ok) {
      response = await fetch(`${apiUrl}/wp/v2/posts?slug=${slug}&categories=industries&_embed`, {
        next: { revalidate: 60 },
        signal: AbortSignal.timeout(15000),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'NextJS-App/1.0'
        }
      });
    }

    if (!response.ok) {
      return null;
    }

    const industries = await response.json();
    
    if (!Array.isArray(industries) || industries.length === 0) {
      return null;
    }

    const industry = industries[0];
    
    const extractRendered = (field: any): string => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      if (field.rendered) return field.rendered;
      return '';
    };

    return {
      id: industry.id,
      title: extractRendered(industry.title) || 'Untitled Industry',
      slug: industry.slug,
      content: extractRendered(industry.content),
      excerpt: extractRendered(industry.excerpt),
      date: industry.date,
      featured_image: industry._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null,
      acf_fields: industry.acf_fields || industry.acf || {}
    };
  } catch (error) {
    console.error('Error fetching industry:', error);
    return null;
  }
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const industry = await getIndustryBySlug(params.slug);

  if (!industry) {
    notFound();
  }

  return (
    <div className="industry-single">
      {/* Breadcrumb */}
      <nav className="breadcrumb" style={{ padding: '20px 0', backgroundColor: '#f9fafb' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <Link href="/" style={{ color: '#667eea', textDecoration: 'none' }}>Home</Link>
          <span style={{ margin: '0 10px', color: '#666' }}>/</span>
          <Link href="/industries" style={{ color: '#667eea', textDecoration: 'none' }}>Industries</Link>
          <span style={{ margin: '0 10px', color: '#666' }}>/</span>
          <span style={{ color: '#333' }}>{industry.title}</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '80px 0',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <h1 style={{ 
            fontSize: '48px', 
            fontWeight: '700', 
            marginBottom: '16px' 
          }}>
            {industry.title}
          </h1>
          {industry.excerpt && (
            <div 
              style={{ 
                fontSize: '20px', 
                opacity: '0.9', 
                maxWidth: '700px', 
                margin: '0 auto' 
              }}
              dangerouslySetInnerHTML={{ __html: industry.excerpt }}
            />
          )}
        </div>
      </section>

      {/* Content Section */}
      <section style={{ padding: '80px 0', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '60px' }}>
            {/* Main Content */}
            <div className="industry-content">
              {industry.featured_image && (
                <Image 
                  src={industry.featured_image}
                  alt={industry.title}
                  width={800}
                  height={400}
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '15px',
                    marginBottom: '40px'
                  }}
                />
              )}
              <div 
                className="content"
                dangerouslySetInnerHTML={{ __html: industry.content }}
                style={{
                  lineHeight: '1.8',
                  fontSize: '16px',
                  color: '#333'
                }}
              />
            </div>

            {/* Sidebar */}
            <div className="industry-sidebar">
              <div style={{
                background: '#f9fafb',
                padding: '30px',
                borderRadius: '15px',
                marginBottom: '30px'
              }}>
                <h3 style={{ marginBottom: '20px', color: '#333' }}>Related Industries</h3>
                <p style={{ color: '#666', marginBottom: '20px' }}>
                  Explore other industries we serve
                </p>
                <Link 
                  href="/industries"
                  style={{
                    display: 'inline-block',
                    background: '#667eea',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}
                >
                  View All Industries
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Generate static params for build time
export async function generateStaticParams() {
  try {
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();
    
    // Try industries custom post type first
    let response = await fetch(`${apiUrl}/wp/v2/industries?per_page=20`, {
      next: { revalidate: 3600 }
    });

    // If industries custom post type doesn't exist, try posts
    if (!response.ok) {
      response = await fetch(`${apiUrl}/wp/v2/posts?categories=industries&per_page=20`, {
        next: { revalidate: 3600 }
      });
    }

    if (!response.ok) {
      return [];
    }

    const industries = await response.json();
    
    if (!Array.isArray(industries)) {
      return [];
    }

    return industries.map((industry: any) => ({
      slug: industry.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for industries:', error);
    return [];
  }
}