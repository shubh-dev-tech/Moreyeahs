import { Metadata } from 'next';
import { getPageWithBlocks } from '@/lib/wpFetch';
import { parseBlocks } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { WordPressContent } from '@/components/WordPressContent';
import { generatePageMetadata } from '@/lib/seo';
import styles from './page.module.css';

interface PageData {
  id: number;
  title: string;
  content: string;
  slug: string;
  blocks?: any[];
}

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('life-at-moreyeahs');
}

async function getPageData(): Promise<PageData | null> {
  return await getPageWithBlocks('life-at-moreyeahs');
}

export default async function LifeAtMoreYeahsPage() {
  const page = await getPageData();

  // If no page found in WordPress, show hero with fallback message
  if (!page) {
    return (
      <div className={styles['life-page']}>
        {/* Hero Section */}
        <section className={styles['life-hero']}>
          <div className={styles.container}>
            <h1 className={styles['life-hero__title']}>Life At MoreYeahs</h1>
            <p className={styles['life-hero__subtitle']}>
              At MoreYeahs, we believe great work happens when people feel inspired, supported, and empowered. 
              Our culture is built on collaboration, continuous learning, and a shared passion for creating meaningful 
              digital solutions. Here, ideas are valued, growth is encouraged, and every individual plays a role in 
              shaping what we build together.
            </p>
          </div>
        </section>

        {/* WordPress Content Section */}
        <section className={styles['life-content-section']}>
          <div className={styles.container}>
            <div className={styles['no-content']}>
              <p>Content coming soon...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Use blocks from API if available, otherwise parse from content
  const blocks = page.blocks && Array.isArray(page.blocks) && page.blocks.length > 0 
    ? page.blocks 
    : parseBlocks(page.content) || [];

  return (
    <div className={styles['life-page']}>
      {/* Hero Section */}
      <section className={styles['life-hero']}>
        <div className={styles.container}>
          <h1 className={styles['life-hero__title']}>Life At MoreYeahs</h1>
          <p className={styles['life-hero__subtitle']}>
            At MoreYeahs, we believe great work happens when people feel inspired, supported, and empowered. 
            Our culture is built on collaboration, continuous learning, and a shared passion for creating meaningful 
            digital solutions. Here, ideas are valued, growth is encouraged, and every individual plays a role in 
            shaping what we build together.
          </p>
        </div>
      </section>

      {/* WordPress Content Section */}
      {blocks && blocks.length > 0 ? (
        <BlockRenderer blocks={blocks} />
      ) : page.content ? (
        <div className={styles['life-content-section']}>
          <WordPressContent content={page.content} />
        </div>
      ) : null}
    </div>
  );
}

// ISR with 60s revalidation
export const revalidate = 60;
