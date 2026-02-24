import { Metadata } from 'next';
import Link from 'next/link';
import CareersWithSidebar from '@/components/careers/CareersWithSidebar';
import { generatePageMetadata } from '@/lib/seo';
import styles from './page.module.css';

interface CareerData {
  id: number;
  title: {
    rendered: string;
  };
  slug: string;
  excerpt: {
    rendered: string;
  };
  date: string;
  acf_fields?: {
    job_type?: string;
    department?: string;
    location?: string;
    experience_level?: string;
  };
  career_department?: number[];
  career_type?: number[];
  career_level?: number[];
  career_preference?: number[];
}

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('careers');
}

async function getCareers(): Promise<CareerData[]> {
  try {
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();

    const response = await fetch(`${apiUrl}/wp/v2/careers?per_page=20&_embed`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(15000),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      console.error(`Failed to fetch careers: ${response.status}`);
      return [];
    }

    const careers = await response.json();
    
    if (!Array.isArray(careers)) {
      return [];
    }

    return careers.map((career: any) => ({
      id: career.id,
      title: career.title,
      slug: career.slug,
      excerpt: career.excerpt,
      date: career.date,
      acf_fields: career.acf_fields || career.acf || {},
      career_department: career.career_department || [],
      career_type: career.career_type || [],
      career_level: career.career_level || [],
      career_preference: career.career_preference || [],
    }));
  } catch (error) {
    console.error('Error fetching careers:', error);
    return [];
  }
}

export default async function CareersPage() {
  const careers = await getCareers();

  return (
    <div className={styles['careers-page']}>
      {/* Hero Section */}
      <section className={styles['careers-hero']}>
        <div className={styles.container}>
          <h1 className={styles['careers-hero__title']}>Join the Team</h1>
          <p className={styles['careers-hero__subtitle']}>
            MoreYeahs is an employee centered company that looks after every employee, gives autonomy to make choices, supports self development and career growth. Our team is always in search of talented individuals to join our employee centered culture.
          </p>
          <p className={styles['careers-hero__subtitle']}>
            Navigate below to see our current open positions!
          </p>
        </div>
      </section>

      {/* Careers Content */}
      <section className={styles['careers-content-section']}>
        <div className={styles.container}>
          {careers.length === 0 ? (
            <div className={styles['no-careers']}>
              <p>No open positions at the moment. Check back soon!</p>
            </div>
          ) : (
            <CareersWithSidebar careers={careers} />
          )}
        </div>
      </section>
    </div>
  );
}
