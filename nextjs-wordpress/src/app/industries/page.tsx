import { Metadata } from 'next';
import Link from 'next/link';
import { generatePageMetadata } from '@/lib/seo';
import styles from './page.module.css';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('industries');
}

// Fetch the Industries page from WordPress
async function getIndustriesPage() {
  try {
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();
    
    const response = await fetch(`${apiUrl}/wp/v2/pages?slug=industries&_embed`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(15000),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'NextJS-App/1.0'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch industries page:', response.status, response.statusText);
      return null;
    }

    const pages = await response.json();
    
    if (!Array.isArray(pages) || pages.length === 0) {
      console.error('No industries page found');
      return null;
    }

    const page = pages[0];
    
    const extractRendered = (field: any): string => {
      if (!field) return '';
      if (typeof field === 'string') return field;
      if (field.rendered) return field.rendered;
      return '';
    };

    return {
      id: page.id,
      title: extractRendered(page.title) || 'Industries',
      slug: page.slug,
      content: extractRendered(page.content),
      excerpt: extractRendered(page.excerpt),
      featured_image: page._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? null,
      acf_fields: page.acf_fields || page.acf || {}
    };
  } catch (error) {
    console.error('Error fetching industries page:', error);
    return null;
  }
}

export default async function IndustriesPage() {
  const pageData = await getIndustriesPage();

  return (
    <div className={styles['industries-page']}>
      {/* Hero Section */}
      <section className={styles['industries-hero']}>
        <div className={styles.container}>
          <h1 className={styles['industries-hero__title']}>
            {pageData?.title || 'Industries'}
          </h1>
          <p className={styles['industries-hero__subtitle']}>
            Explore the diverse industries we serve and the solutions we provide
          </p>
        </div>
      </section>

      {/* Industries Content */}
      <section className={styles['industries-content-section']}>
        <div className={styles.container}>
          {!pageData ? (
            <div className={styles['no-industries']}>
              <p>Industries page not found. Please check back soon!</p>
              <p style={{ marginTop: '20px' }}>
                <Link href="/">Go back home</Link>
              </p>
            </div>
          ) : (
            <div className={styles['industries-content']}>
              {/* Render page content */}
              <div 
                className={styles['page-content']}
                dangerouslySetInnerHTML={{ __html: pageData.content }}
              />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}