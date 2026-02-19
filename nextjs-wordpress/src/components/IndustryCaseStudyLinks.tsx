/**
 * Example component showing how to create links to case studies filtered by industry
 * 
 * Usage:
 * import IndustryCaseStudyLinks from '@/components/IndustryCaseStudyLinks';
 * 
 * <IndustryCaseStudyLinks />
 */

import Link from 'next/link';

interface Industry {
  name: string;
  slug: string;
  description?: string;
}

// Example industries - replace with your actual WordPress industries
const INDUSTRIES: Industry[] = [
  { 
    name: 'Hello', 
    slug: 'hello',
    description: 'Case studies from the hello industry'
  },
  { 
    name: 'Energy', 
    slug: 'energy',
    description: 'Energy sector case studies'
  },
  { 
    name: 'Healthcare', 
    slug: 'healthcare',
    description: 'Healthcare industry case studies'
  },
  { 
    name: 'Finance', 
    slug: 'finance',
    description: 'Financial services case studies'
  },
];

export default function IndustryCaseStudyLinks() {
  return (
    <div className="industry-case-study-links">
      <h2>Case Studies by Industry</h2>
      <div className="industry-grid">
        {INDUSTRIES.map((industry) => (
          <Link
            key={industry.slug}
            href={`/case-study?industry=${industry.slug}`}
            className="industry-card"
          >
            <h3>{industry.name}</h3>
            {industry.description && <p>{industry.description}</p>}
            <span className="view-link">View Case Studies →</span>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .industry-case-study-links {
          padding: 2rem 0;
        }

        h2 {
          font-size: 2rem;
          margin-bottom: 2rem;
          text-align: center;
        }

        .industry-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .industry-card {
          padding: 1.5rem;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
        }

        .industry-card:hover {
          border-color: #0070f3;
          box-shadow: 0 4px 12px rgba(0, 112, 243, 0.1);
          transform: translateY(-2px);
        }

        .industry-card h3 {
          font-size: 1.25rem;
          margin-bottom: 0.5rem;
          color: #0070f3;
        }

        .industry-card p {
          font-size: 0.9rem;
          color: #666;
          margin-bottom: 1rem;
        }

        .view-link {
          font-size: 0.9rem;
          color: #0070f3;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .industry-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
