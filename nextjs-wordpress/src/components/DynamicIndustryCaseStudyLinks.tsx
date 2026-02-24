/**
 * Dynamic component that fetches industries from WordPress and creates case study links
 * 
 * Usage:
 * import DynamicIndustryCaseStudyLinks from '@/components/DynamicIndustryCaseStudyLinks';
 * 
 * <DynamicIndustryCaseStudyLinks />
 */

import Link from 'next/link';

interface Industry {
  id: number;
  name: string;
  slug: string;
  count: number;
}

// Fetch industries from WordPress
async function getIndustries(): Promise<Industry[]> {
  try {
    const { getWordPressApiUrl } = await import('@/lib/environment');
    const apiUrl = getWordPressApiUrl();
    
    const response = await fetch(`${apiUrl}/wp/v2/industry?per_page=20`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
      signal: AbortSignal.timeout(10000),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('Failed to fetch industries:', response.statusText);
      return [];
    }

    const industries = await response.json();
    
    if (!Array.isArray(industries)) {
      console.error('Invalid industries response format');
      return [];
    }
    
    return industries
      .filter((ind: any) => ind.count > 0) // Only show industries with case studies
      .map((ind: any) => ({
        id: ind.id,
        name: ind.name,
        slug: ind.slug,
        count: ind.count
      }));
  } catch (error) {
    console.error('Error fetching industries:', error);
    return [];
  }
}

export default async function DynamicIndustryCaseStudyLinks() {
  const industries = await getIndustries();

  if (industries.length === 0) {
    return null;
  }

  return (
    <div className="dynamic-industry-links">
      <h2>Case Studies by Industry</h2>
      <p className="subtitle">
        Explore our work across different industries
      </p>
      
      <div className="industry-grid">
        {industries.map((industry) => (
          <Link
            key={industry.id}
            href={`/case-study?industry=${industry.slug}`}
            className="industry-card"
          >
            <h3>{industry.name}</h3>
            <span className="count">{industry.count} case {industry.count === 1 ? 'study' : 'studies'}</span>
            <span className="view-link">View All →</span>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .dynamic-industry-links {
          padding: 3rem 0;
          max-width: 1200px;
          margin: 0 auto;
        }

        h2 {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          text-align: center;
          color: #1a1a1a;
        }

        .subtitle {
          text-align: center;
          color: #666;
          font-size: 1.1rem;
          margin-bottom: 3rem;
        }

        .industry-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 2rem;
        }

        .industry-card {
          padding: 2rem;
          border: 2px solid #f0f0f0;
          border-radius: 12px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          background: white;
        }

        .industry-card:hover {
          border-color: #0070f3;
          box-shadow: 0 8px 24px rgba(0, 112, 243, 0.15);
          transform: translateY(-4px);
        }

        .industry-card h3 {
          font-size: 1.5rem;
          margin-bottom: 0.75rem;
          color: #1a1a1a;
        }

        .count {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .view-link {
          font-size: 1rem;
          color: #0070f3;
          font-weight: 600;
          margin-top: auto;
        }

        @media (max-width: 768px) {
          .industry-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          h2 {
            font-size: 2rem;
          }
        }
      `}</style>
    </div>
  );
}
