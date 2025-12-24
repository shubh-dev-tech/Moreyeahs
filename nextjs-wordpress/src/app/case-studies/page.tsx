import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CaseStudyData } from '@/components/case-study';
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
    const baseUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || process.env.WORDPRESS_URL || 'http://localhost';
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/case_study?per_page=20`, {
      next: { revalidate: 300 } // Revalidate every 5 minutes
    });

    if (!response.ok) {
      console.error('Failed to fetch case studies:', response.statusText);
      return [];
    }

    const caseStudies = await response.json();
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
                        alt={caseStudy.title}
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
                      {caseStudy.title}
                    </Link>
                  </h2>
                  
                  {caseStudy.excerpt && (
                    <div 
                      className={styles.caseStudyCardExcerpt}
                      dangerouslySetInnerHTML={{ __html: caseStudy.excerpt }}
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