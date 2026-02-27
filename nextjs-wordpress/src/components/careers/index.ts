export { default as CareersWithSidebar } from './CareersWithSidebar';
export { default as CareerDetailPage } from './CareerDetailPage';

// Type definitions for career data
export interface CareerData {
  id: number;
  title: {
    rendered: string;
  } | string;
  slug: string;
  content: {
    rendered: string;
  } | string;
  excerpt: {
    rendered: string;
  } | string;
  date: string;
  acf_fields?: {
    job_type?: string;
    department?: string;
    location?: string;
    experience_level?: string;
    background_image?: {
      url: string;
      alt: string;
    };
    job_sections?: Array<{
      section_heading: string;
      section_content?: Array<{
        paragraph?: string;
        bullet_points?: Array<{
          bullet_text: string;
        }>;
      }>;
    }>;
  };
  career_department?: number[];
  career_type?: number[];
  career_level?: number[];
  career_preference?: number[];
  _embedded?: any;
}

// Utility functions to safely extract rendered content
export function getRenderedTitle(career: CareerData): string {
  if (typeof career.title === 'string') {
    return career.title;
  }
  return career.title?.rendered || '';
}

export function getRenderedContent(career: CareerData): string {
  if (typeof career.content === 'string') {
    return career.content;
  }
  return career.content?.rendered || '';
}

export function getRenderedExcerpt(career: CareerData): string {
  if (typeof career.excerpt === 'string') {
    return career.excerpt;
  }
  return career.excerpt?.rendered || '';
}
