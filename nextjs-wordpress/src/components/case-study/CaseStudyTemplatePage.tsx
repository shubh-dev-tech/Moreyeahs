'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import LoadingSpinner from '../LoadingSpinner';
import CaseStudyQuote from './CaseStudyQuote';
import styles from './CaseStudyTemplatePage.module.css';
import './CaseStudy.global.css';

interface CaseStudyTemplateData {
  id: number;
  title: {
    rendered: string;
  };
  acf_fields?: {
    header_section?: {
      logo?: {
        url: string;
        alt: string;
      };
      title?: string;
      subtitle?: string;
      dynamic_heading?: string;
      background_image?: {
        url: string;
        alt: string;
      };
      gradient_colors?: {
        color_1: string;
        color_2: string;
      };
    };
    sidebar_section?: {
      sidebar_sections?: Array<{
        section_title: string;
        section_items: Array<{
          item_text: string;
        }>;
      }>;
    };
    client_section?: {
      client_image?: {
        url: string;
        alt: string;
      };
      client_name?: string;
      client_designation?: string;
      client_company?: string;
      client_content?: string;
    };
    content_sections?: Array<{
      section_icon?: {
        url: string;
        alt: string;
      };
      section_title: string;
      icon_color?: string;
      section_content?: string;
      section_quotes?: Array<{
        quote_text: string;
      }>;
      section_bullet_points?: Array<{
        bullet_text: string;
      }>;
    }>;
    testimonial_quote?: {
      quote_text?: string;
      quote_author?: string;
    };
    cta_section?: {
      cta_title?: string;
      cta_content?: string;
      cta_buttons?: Array<{
        button_text: string;
        button_url: string;
        button_style: 'primary' | 'secondary';
      }>;
    };
  };
}

interface CaseStudyTemplatePageProps {
  caseStudy: CaseStudyTemplateData;
  className?: string;
}

const CaseStudyTemplatePage: React.FC<CaseStudyTemplatePageProps> = ({
  caseStudy,
  className = ''
}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ensure we have valid data
  if (!caseStudy) {
    return <LoadingSpinner message="Loading case study..." />;
  }

  if (!isClient) {
    return <LoadingSpinner message="Initializing..." />;
  }

  const acf = caseStudy.acf_fields || {};
  const header = acf.header_section || {};
  const sidebar = acf.sidebar_section || {};
  const client = acf.client_section || {};
  const contentSections = acf.content_sections || [];
  const testimonial = acf.testimonial_quote || {};
  const cta = acf.cta_section || {};

  // Default gradient colors
  const gradientColors = header.gradient_colors || {
    color_1: '#00bcd4',
    color_2: '#9c27b0'
  };

  // Safe HTML renderer
  const SafeHTML = ({ content, className }: { content: string; className?: string }) => {
    if (!isClient || !content) return null;
    return (
      <div 
        className={className}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  // Safe Image component
  const SafeImage = ({ src, alt, width, height, className, ...props }: any) => {
    if (!isClient || !src) return null;
    return (
      <Image
        src={src}
        alt={alt || ''}
        width={width}
        height={height}
        className={className}
        onError={(e) => {
          console.warn('Image failed to load:', src);
          e.currentTarget.style.display = 'none';
        }}
        {...props}
      />
    );
  };

  return (
    <div className={`${styles.caseStudyTemplate} case-study-main ${className}`}>
      {/* Header Section */}
      <section className={styles.headerSection}>
        <div 
          className={styles.headerBackground}
          style={{
            background: header.background_image?.url 
              ? `linear-gradient(135deg, ${gradientColors.color_1}CC, ${gradientColors.color_2}CC), url(${header.background_image.url})`
              : `linear-gradient(135deg, ${gradientColors.color_1}, ${gradientColors.color_2})`
          }}
        >
          <div className={styles.headerContent}>
            <div className={styles.headerLeft}>
              {/* {header.logo?.url && (
                <div className={styles.logoContainer}>
                  <Image
                    src={header.logo.url}
                    alt={header.logo.alt || 'Logo'}
                    width={80}
                    height={80}
                    className={styles.logo}
                  />
                </div>
              )} */}
              <div className={styles.headerText}>
                <h1 className={styles.headerTitle}>
                  {header.title || caseStudy.title.rendered}
                </h1>
                {header.subtitle && (
                  <p className={styles.headerSubtitle}>{header.subtitle}</p>
                )}
              </div>
            </div>
            {header.background_image?.url && (
              <div className={styles.headerRight}>
                <SafeImage
                  src={header.background_image.url}
                  alt={header.background_image.alt || 'Header image'}
                  width={400}
                  height={300}
                  className={styles.headerImage}
                />
              </div>
            )}
          </div>
        </div>
        <div className={styles.headerWave}>
          {isClient && (
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
              <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" className={styles.shapeFill}></path>
              <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" className={styles.shapeFill}></path>
              <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" className={styles.shapeFill}></path>
            </svg>
          )}
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            {/* Left Sidebar */}
            <aside className={styles.sidebarContainer}>
              {/* Logo outside the sidebar box */}
              {header.logo?.url && (
                <div className={styles.logoContainerSidebar}>
                  <SafeImage
                    src={header.logo.url}
                    alt={header.logo.alt || 'Logo'}
                    width={120}
                    height={120}
                    className={styles.logoSidebar}
                  />
                </div>
              )}

              {/* Meet the Client Section */}
              {(client.client_name || client.client_content) && (
                <div className={styles.meetClientSection}>
                  <div className={styles.clientImageContainer}>
                    {client.client_image?.url && (
                      <SafeImage
                        src={client.client_image.url}
                        alt={client.client_image.alt || client.client_name || 'Client'}
                        width={80}
                        height={80}
                        className={styles.clientImage}
                      />
                    )}
                  </div>
                  <div className={styles.clientDetails}>
                    {client.client_name && (
                      <h3 className={styles.clientNameSidebar}>{client.client_name}</h3>
                    )}
                    {client.client_designation && (
                      <p className={styles.clientDesignationSidebar}>{client.client_designation}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Our Client Section
              {(client.client_name || client.client_content) && (
                <div className={styles.ourClientSection}>
                  <h3 className={styles.ourClientTitle}>Our Client</h3>
                  <div className={styles.ourClientContent}>
                    {client.client_name && (
                      <p className={styles.ourClientName}>{client.client_name}</p>
                    )}
                    {client.client_designation && (
                      <p className={styles.ourClientDesignation}>{client.client_designation}</p>
                    )}
                  </div>
                  
                  <h4 className={styles.profileTitle}>Profile</h4>
                  <div className={styles.profileContent}>
                    {client.client_company && (
                      <p className={styles.profileItem}>Location: {client.client_company}</p>
                    )}
                    <p className={styles.profileItem}>Size: SMB</p>
                    <p className={styles.profileItem}>Sector: IT Consultancy</p>
                  </div>
                </div>
              )} */}

              {/* Sidebar Sections */}
              <div className={styles.sidebar}>
                {sidebar.sidebar_sections && Array.isArray(sidebar.sidebar_sections) && sidebar.sidebar_sections.map((section, index) => (
                  <div key={index} className={styles.sidebarSection}>
                    <h3 className={styles.sidebarTitle}>{section.section_title}</h3>
                    <div className={styles.sidebarItems}>
                      {section.section_items && Array.isArray(section.section_items) && section.section_items.map((item, itemIndex) => (
                        <SafeHTML
                          key={itemIndex}
                          content={item.item_text}
                          className={styles.sidebarItem}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* Right Content */}
            <main className={styles.content}>
              {/* Dynamic Heading Section */}
              {header.dynamic_heading && (
                <section className={styles.dynamicHeadingSection}>
                  <h2 className={styles.dynamicHeading}>{header.dynamic_heading}</h2>
                </section>
              )}

              {/* Content Sections */}
              {Array.isArray(contentSections) && contentSections.map((section, index) => (
                <section key={index} className={styles.contentSection}>
                  <div className={styles.sectionHeader}>
                    {section.section_icon?.url && (
                      <div 
                        className={styles.sectionIcon}
                        style={{ color: section.icon_color || '#516FC2' }}
                      >
                        <SafeImage
                          src={section.section_icon.url}
                          alt={section.section_icon.alt || 'Section icon'}
                          width={50}
                          height={50}
                        />
                      </div>
                    )}
                    <h2 className={styles.sectionTitle}>{section.section_title}</h2>
                  </div>
                  
                  {section.section_content && (
                    <SafeHTML 
                      content={section.section_content}
                      className={styles.sectionContent}
                    />
                  )}
                  
                  {section.section_quotes && Array.isArray(section.section_quotes) && section.section_quotes.length > 0 && 
                   section.section_quotes.some(quote => quote.quote_text && quote.quote_text.trim() !== '') && (
                    <div className={styles.sectionQuotes}>
                      {section.section_quotes
                        .filter(quote => quote.quote_text && quote.quote_text.trim() !== '')
                        .map((quote, quoteIndex) => (
                          <CaseStudyQuote
                            key={quoteIndex}
                            quoteText={quote.quote_text}
                            backgroundColor={section.icon_color || '#516FC2'}
                            className={styles.sectionQuote}
                          />
                        ))}
                    </div>
                  )}
                  
                  {section.section_bullet_points && Array.isArray(section.section_bullet_points) && section.section_bullet_points.length > 0 && (
                    <ul className={styles.bulletPoints}>
                      {section.section_bullet_points.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet.bullet_text}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}

              {/* Testimonial Quote */}
              {testimonial.quote_text && testimonial.quote_text.trim() !== '' && (
                <section className={styles.testimonialSection}>
                  <CaseStudyQuote
                    quoteText={testimonial.quote_text}
                    quoteAuthor={testimonial.quote_author}
                    backgroundColor="#516FC2"
                    className={styles.testimonialQuote}
                  />
                </section>
              )}

              {/* CTA Section */}
              {(cta.cta_title || cta.cta_buttons) && (
                <section className={styles.ctaSection}>
                  {cta.cta_title && (
                    <h2 className={styles.ctaTitle}>{cta.cta_title}</h2>
                  )}
                  {cta.cta_content && (
                    <p className={styles.ctaContent}>{cta.cta_content}</p>
                  )}
                  {cta.cta_buttons && Array.isArray(cta.cta_buttons) && cta.cta_buttons.length > 0 && (
                    <div className={styles.ctaButtons}>
                      {cta.cta_buttons.map((button, buttonIndex) => (
                        <a
                          key={buttonIndex}
                          href={button.button_url}
                          className={`${styles.ctaButton} ${styles[button.button_style || 'primary']}`}
                        >
                          {button.button_text}
                        </a>
                      ))}
                    </div>
                  )}
                </section>
              )}
            </main>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudyTemplatePage;