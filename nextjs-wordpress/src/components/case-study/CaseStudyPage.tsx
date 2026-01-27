'use client';

import React from 'react';
import {
  CaseStudyHeader,
  CaseStudyLayout,
  CaseStudyLeftSidebar,
  CaseStudyDetailsCard,
  MeetTheClient,
  CaseStudyContentSection,
  CaseStudyQuote,
  CaseStudyCTA,
  CaseStudiesImageSection,
  CaseStudyData,
  CaseStudyBlock
} from './index';
import styles from './CaseStudyPage.module.css';
import './CaseStudy.global.css';
import { formatDate } from '@/utils/dateUtils';

interface CaseStudyPageProps {
  caseStudy: CaseStudyData;
  className?: string;
}

const CaseStudyPage: React.FC<CaseStudyPageProps> = ({
  caseStudy,
  className = ''
}) => {
  // Helper function to extract string values from WordPress rendered objects
  const extractString = (value: any): string => {
    if (!value) return '';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.rendered) return value.rendered;
    return String(value);
  };

  // Helper to recursively clean ACF data
  const cleanACFData = (data: any): any => {
    if (!data) return data;
    if (typeof data !== 'object') return data;
    if (Array.isArray(data)) return data.map(cleanACFData);
    
    const cleaned: any = {};
    for (const key in data) {
      const value = data[key];
      if (value && typeof value === 'object' && value.rendered) {
        cleaned[key] = value.rendered;
      } else if (typeof value === 'object') {
        cleaned[key] = cleanACFData(value);
      } else {
        cleaned[key] = value;
      }
    }
    return cleaned;
  };

  // Get blocks from the caseStudy data
  const blocks = caseStudy.blocks || [];
  
  // Parse ACF fields from blocks if available
  const parseBlockAttrs = (block: CaseStudyBlock) => {
    // If block has attrs with ACF data, use it directly
    if (block.attrs && Object.keys(block.attrs).length > 0) {
      return cleanACFData(block.attrs);
    }
    
    // Otherwise try to get from acf_fields if available
    return cleanACFData(caseStudy.acf_fields || {});
  };

  // Render individual blocks
  const renderBlock = (block: CaseStudyBlock, index: number) => {
    const { blockName, attrs } = block;
    const blockAttrs = parseBlockAttrs(block);

    switch (blockName) {
      case 'acf/case-study-header':
        return (
          <CaseStudyHeader
            key={index}
            logo={blockAttrs.logo || attrs?.logo}
            title={blockAttrs.title || attrs?.title || extractString(caseStudy.title)}
            subtitle={blockAttrs.subtitle || attrs?.subtitle}
            backgroundImage={blockAttrs.background_image || attrs?.background_image}
            gradientOverlay={blockAttrs.gradient_overlay !== false}
            gradientColors={blockAttrs.gradient_colors || attrs?.gradient_colors}
          />
        );

      case 'acf/case-study-layout':
        return (
          <CaseStudyLayout
            key={index}
            enableSidebar={blockAttrs.enable_sidebar !== false}
            sidebarWidth={blockAttrs.sidebar_width || attrs?.sidebar_width}
            contentGap={blockAttrs.content_gap || attrs?.content_gap}
            containerMaxWidth={blockAttrs.container_max_width || attrs?.container_max_width}
            sidebar={
              <CaseStudyLeftSidebar
                sidebarSections={blockAttrs.sidebar_sections || attrs?.sidebar_sections || []}
                backgroundColor={blockAttrs.background_color || attrs?.background_color}
                textColor={blockAttrs.text_color || attrs?.text_color}
                showDownloadButtons={blockAttrs.show_download_buttons !== false}
                downloadButtons={blockAttrs.download_buttons || attrs?.download_buttons || []}
              />
            }
          >
            {block.innerBlocks?.map((innerBlock, innerIndex) => 
              renderBlock(innerBlock, innerIndex)
            )}
          </CaseStudyLayout>
        );

      case 'acf/meet-the-client':
        return (
          <MeetTheClient
            key={index}
            sectionTitle={blockAttrs.section_title || attrs?.section_title}
            clientImage={blockAttrs.client_image || attrs?.client_image}
            clientName={blockAttrs.client_name || attrs?.client_name}
            clientDesignation={blockAttrs.client_designation || attrs?.client_designation}
            clientCompany={blockAttrs.client_company || attrs?.client_company}
            clientContent={blockAttrs.client_content || attrs?.client_content}
            clientQuote={blockAttrs.client_quote || attrs?.client_quote}
            showIcon={blockAttrs.show_icon !== false}
            sectionIcon={blockAttrs.section_icon || attrs?.section_icon}
            iconColor={blockAttrs.icon_color || attrs?.icon_color}
          />
        );

      case 'acf/case-study-content-section':
        return (
          <CaseStudyContentSection
            key={index}
            enableSection={blockAttrs.enable_section !== false}
            sectionType={blockAttrs.section_type || attrs?.section_type}
            sectionTitle={blockAttrs.section_title || attrs?.section_title}
            sectionIcon={blockAttrs.section_icon || attrs?.section_icon}
            sectionContent={blockAttrs.section_content || attrs?.section_content}
            sectionQuote={blockAttrs.section_quote || attrs?.section_quote}
            bulletPoints={blockAttrs.bullet_points || attrs?.bullet_points || []}
            showDivider={blockAttrs.show_divider !== false}
            iconColor={blockAttrs.icon_color || attrs?.icon_color}
          />
        );

      case 'acf/case-study-quote':
        return (
          <CaseStudyQuote
            key={index}
            quoteText={blockAttrs.quote_text || attrs?.quote_text}
            quoteAuthor={blockAttrs.quote_author || attrs?.quote_author}
            quotePosition={blockAttrs.quote_position || attrs?.quote_position}
            quoteCompany={blockAttrs.quote_company || attrs?.quote_company}
            backgroundColor={blockAttrs.background_color || attrs?.background_color}
            textColor={blockAttrs.text_color || attrs?.text_color}
            showQuotationMarks={blockAttrs.show_quotation_marks !== false}
            quoteStyle={blockAttrs.quote_style || attrs?.quote_style}
          />
        );

      case 'acf/case-study-cta':
        return (
          <CaseStudyCTA
            key={index}
            ctaButtons={blockAttrs.cta_buttons || attrs?.cta_buttons || []}
            backgroundColor={blockAttrs.background_color || attrs?.background_color}
            showDivider={blockAttrs.show_divider !== false}
            ctaAlignment={blockAttrs.cta_alignment || attrs?.cta_alignment}
          />
        );

      default:
        // Handle other block types or return null
        return null;
    }
  };

  // If no blocks are parsed, render a simple layout with ACF fields
  const renderFallbackLayout = () => {
    return (
      <>
        <CaseStudyHeader
          title={extractString(caseStudy.title)}
          subtitle="Case Study"
        />
        
        <CaseStudyLayout
          sidebar={
            <CaseStudyLeftSidebar
              sidebarSections={[
                {
                  section_title: 'Case Study Details',
                  section_items: [
                    { item_label: 'Published', item_value: formatDate(caseStudy.date) },
                    { item_label: 'Type', item_value: 'Case Study' }
                  ]
                }
              ]}
            />
          }
        >
          <div className={styles.caseStudyContent}>
            <div dangerouslySetInnerHTML={{ __html: typeof caseStudy.content === 'string' ? caseStudy.content : caseStudy.content.rendered }} />
          </div>
        </CaseStudyLayout>
      </>
    );
  };

  return (
    <div className={`${styles.caseStudyPage} case-study-main ${className}`}>
      {blocks.length > 0 
        ? blocks.map((block, index) => renderBlock(block, index))
        : renderFallbackLayout()
      }
    </div>
  );
};

export default CaseStudyPage;