import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CaseStudyData, getRenderedTitle, getRenderedExcerpt } from '@/components/case-study';
import styles from './page.module.css';
import { formatDate } from '@/utils/dateUtils';

export const metadata: Metadata = {
  title: 'Case Studies - Our Success Stories',
  description: 'Explore our case studies and learn how we help businesses transform and grow through innovative solutions.',
  openGraph: {
    title: 'Case Studies - Our Success Stories',
    description: 'Explore our case studies and learn how we help businesses transform and grow through innovative solutions.',
    type: 'website'
  }
};

// Fetch case studies from WordPress API
async function getCaseStudies(): Promise<CaseStudyData[]> {
  try {
    // Use environment-aware URL detection
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();
    

    
    const response = await fetch(`${apiUrl}/wp/v2/case_study?per_page=20`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      // Add timeout for build process
      signal: AbortSignal.timeout(10000), // 10 second timeout
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch case studies:', response.statusText);
      return [];
    }

    const caseStudies = await response.json();
    
    if (!Array.isArray(caseStudies)) {
      console.error('Invalid case studies response format');
      return [];
    }
    
    return caseStudies;
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return [];
  }
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies();

  return (
    <main className={styles.caseStudiesArchive}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Case Studies</h1>
          <p className={styles.pageDescription}>
            Explore our success stories and learn how we help businesses transform and grow through innovative solutions.
          </p>
        </header>

        {caseStudies.length > 0 ? (
          <div className={styles.caseStudiesGrid}>
            {caseStudies.map((caseStudy) => (
              <article key={caseStudy.id} className={styles.caseStudyCard}>
                {caseStudy.featured_image && (
                  <div className={styles.caseStudyCardImage}>
                    <Link href={`/case-study/${caseStudy.slug}`}>
                      <Image
                        src={caseStudy.featured_image}
                        alt={getRenderedTitle(caseStudy)}
                        width={400}
                        height={200}
                        className={styles.cardImage}
                      />
                    </Link>
                  </div>
                )}
                
                <div className={styles.caseStudyCardContent}>
                  <h2 className={styles.caseStudyCardTitle}>
                    <Link href={`/case-study/${caseStudy.slug}`}>
                      {getRenderedTitle(caseStudy)}
                    </Link>
                  </h2>
                  
                  {caseStudy.excerpt && (
                    <div 
                      className={styles.caseStudyCardExcerpt}
                      dangerouslySetInnerHTML={{ __html: getRenderedExcerpt(caseStudy) }}
                    />
                  )}
                  
                  <div className={styles.caseStudyCardMeta}>
                    <time dateTime={caseStudy.date}>
                      {formatDate(caseStudy.date)}
                    </time>
                  </div>
                  
                  <Link href={`/case-study/${caseStudy.slug}`} className={styles.caseStudyCardLink}>
                    Read Case Study
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/>
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.noPostsFound}>
            <h2>No case studies found</h2>
            <p>It looks like no case studies have been published yet. Check back soon!</p>
          </div>
        )}
      </div>
    </main>
  );
}