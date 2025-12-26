export { default as CaseStudyHeader } from './CaseStudyHeader';
export { default as CaseStudyLayout } from './CaseStudyLayout';
export { default as CaseStudyLeftSidebar } from './CaseStudyLeftSidebar';
export { default as CaseStudyDetailsCard } from './CaseStudyDetailsCard';
export { default as MeetTheClient } from './MeetTheClient';
export { default as CaseStudyContentSection } from './CaseStudyContentSection';
export { default as CaseStudyQuote } from './CaseStudyQuote';
export { default as CaseStudyCTA } from './CaseStudyCTA';
export { default as CaseStudiesImageSection } from './CaseStudiesImageSection';

// Type definitions for case study data
export interface CaseStudyData {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  date: string;
  featured_image?: string | null;
  blocks?: CaseStudyBlock[];
  acf_fields?: {
    [key: string]: any;
  };
}

export interface CaseStudyBlock {
  blockName: string;
  attrs: {
    [key: string]: any;
  };
  innerBlocks?: CaseStudyBlock[];
  innerHTML: string;
  innerContent: string[];
}

// Sidebar section types
export interface SidebarSection {
  section_icon?: {
    url: string;
    alt?: string;
  };
  section_title: string;
  section_items?: SidebarItem[];
}

export interface SidebarItem {
  item_label?: string;
  item_value?: string;
}

export interface DownloadButton {
  button_icon?: {
    url: string;
    alt?: string;
  };
  button_text: string;
  button_url: string;
  open_in_new_tab?: boolean;
}

// Content section types
export interface BulletPoint {
  bullet_text: string;
}

// CTA types
export interface CTAButton {
  button_text: string;
  button_url: string;
  button_style?: 'primary' | 'secondary' | 'outline';
  open_in_new_tab?: boolean;
}