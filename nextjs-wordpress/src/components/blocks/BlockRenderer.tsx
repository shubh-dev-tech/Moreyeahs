/**
 * Block Renderer Component
 * Dynamically renders WordPress blocks based on their type
 */

import React from 'react';
import { Block, isACFBlock, getBlockType } from '@/lib/blocks';

// Import block components
import { HeroBlock } from './hero-block';
import { ContentBlock } from './content-block';
import { ImageTextBlock } from './image-text-block';
import { CTABlock } from './cta-block';
import { MoreyeahsHeadingTestBlock } from './moreyeahs-heading-test-block';
import { MoreyeahsSliderBlock } from './moreyeahs-slider-block';
import { FullWidthLeftTextSection } from './FullWidthLeftTextSection';
import ImageGridHover from './ImageGridHover';
import IconTextGrid from './IconTextGrid';
import PromoBlock from './promo-block';
import PurposeBlock from './purpose-block/PurposeBlock';
import CounterBlock from './counter-block';
import NewsBlock from './news-block/NewsBlock';
import { InvestorBlock } from './investor-block';
import TestimonialBlock from './testimonial-block';
import NavigationNextBlock from './navigation-next-block';
import StepperBlock from './stepper-block/StepperBlock';
import MoreyeahsServiceBlock from './moreyeahs-service-block';
import MoreyeahsContentBlock from './moreyeahs-content-block';
import StoriesBlogBlockWrapper from './stories-blog-block/StoriesBlogBlockWrapper';
import FullImgContentBlock from './full-img-content-block/FullImgContentBlock';
import RoadmapBlock from './roadmap-block/RoadmapBlock';
import ServiceRoadmapsBlock from './service-roadmaps-block/ServiceRoadmapsBlock';
import ServiceAcrossMultiBlock from './service-across-multi-block/ServiceAcrossMultiBlock';
import InfinityTestimonialBothSideBlock from './infinity-testimonial-both-side/InfinityTestimonialBothSideBlock';
import VideoSectionBlock from './video-section/VideoSectionBlock';
import CredentialsAcquiredBlock from './credentials-acquired-block/CredentialsAcquiredBlock';
import TextImageAlternatingBlock from './text-image-alternating-block';
import ServiceDetailsSection from './service-details-section/ServiceDetailsSection';
import CallToActionSection from './call-to-action-section/CallToActionSection';
import FullOneByTwoSection from './full-one-by-two-section/FullOneByTwoSection';
import PartnershipGallery from './partnership-gallery/PartnershipGallery';
import HeroSection from './hero-section/HeroSection';
import { FooterSection } from './footer-section';
import { CoreParagraph } from './core/Paragraph';
import { CoreHeading } from './core/Heading';
import { CoreImage } from './core/Image';

interface BlockRendererProps {
  blocks: Block[];
}

// Map block names to components
const BLOCK_COMPONENTS: Record<string, React.ComponentType<any>> = {
  // ACF Blocks
  'acf/hero': HeroBlock,
  'acf/content': ContentBlock,
  'acf/image-text': ImageTextBlock,
  'acf/cta': CTABlock,
  'acf/moreyeahs-heading-test': MoreyeahsHeadingTestBlock,
  'acf/full-width-left-text-section': FullWidthLeftTextSection,
  'acf/image-grid-hover': ImageGridHover,
  'acf/icon-text-grid': IconTextGrid,
  'acf/promo-block': PromoBlock,
  'acf/purpose-block': PurposeBlock,
  'acf/counter-block': CounterBlock,
  'acf/news-block': NewsBlock,
  'acf/investor-block': InvestorBlock,
  'acf/testimonial-block': TestimonialBlock,
  'acf/navigation-next-block': NavigationNextBlock,
  'acf/stepper-block': StepperBlock,
  'acf/moreyeahs-service-block': MoreyeahsServiceBlock,
  'acf/moreyeahs-content-block': MoreyeahsContentBlock,
  'acf/stories-blog-block': StoriesBlogBlockWrapper,
  'acf/full-img-content-block': FullImgContentBlock,
  'acf/roadmap-block': RoadmapBlock,
  'acf/service-roadmaps-block': ServiceRoadmapsBlock,
  'acf/service-across-multi-block': ServiceAcrossMultiBlock,
  'acf/infinity-testimonial-both-side': InfinityTestimonialBothSideBlock,
  'acf/video-section': VideoSectionBlock,
  'acf/credentials-acquired-block': CredentialsAcquiredBlock,
  'acf/text-image-alternating-block': TextImageAlternatingBlock,
  'acf/service-details-section': ServiceDetailsSection,
  'acf/call-to-action-section': CallToActionSection,
  'acf/full-one-by-two-section': FullOneByTwoSection,
  'acf/partnership-gallery': PartnershipGallery,
  'acf/hero-section': HeroSection,
  'acf/footer-section': FooterSection,
  
  // Custom Blocks (without ACF)
  'moreyeahs/slider': MoreyeahsSliderBlock,
  
  // Core Gutenberg Blocks
  'core/paragraph': CoreParagraph,
  'core/heading': CoreHeading,
  'core/image': CoreImage,
};

// Map block names to section IDs for stepper navigation
const BLOCK_SECTION_IDS: Record<string, string> = {
  'acf/hero': 'hero',
  'acf/purpose-block': 'purpose',
  'acf/promo-block': 'operating-models',
  'acf/counter-block': 'counter',
  'acf/testimonial-block': 'testimonials',
  'acf/news-block': 'news',
  'acf/investor-block': 'investors',
  'acf/navigation-next-block': 'navigation-next',
  'acf/infinity-testimonial-both-side': 'infinity-testimonials',
  'acf/text-image-alternating-block': 'text-image-alternating',
  'acf/service-details-section': 'service-details',
  'acf/call-to-action-section': 'call-to-action',
  'acf/full-one-by-two-section': 'full-one-by-two',
  'acf/hero-section': 'hero-section',
};

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }
  // Recursive renderer for a single block
  const renderBlock = (block: Block, index: number) => {
    if (!block.blockName) return null;

    const BlockComponent = BLOCK_COMPONENTS[block.blockName];
    const sectionId = block.attrs?.anchor || BLOCK_SECTION_IDS[block.blockName];
    const blockData = isACFBlock(block) ? (block.attrs as any).data : block.attrs;

    // If we have a mapped component, render it
    if (BlockComponent) {
      return (
        <section key={`${block.blockName}-${index}`} id={sectionId}>
          <BlockComponent data={blockData} innerHTML={block.innerHTML} {...block.attrs} />
        </section>
      );
    }

    // If no component mapped, but there are innerBlocks from REST, render them recursively
    if (block.innerBlocks && block.innerBlocks.length > 0) {
      return (
        <section key={`${block.blockName}-${index}`} id={sectionId}>
          <div className="block-fallback-container">
            {block.innerBlocks.map((inner, i) => renderBlock(inner, i))}
          </div>
        </section>
      );
    }

    // Final fallback: render innerHTML if present
    if (block.innerHTML) {
      return (
        <section key={`${block.blockName}-${index}`} id={sectionId}>
          <div
            className="prose max-w-none"
            suppressHydrationWarning
            dangerouslySetInnerHTML={{ __html: block.innerHTML }}
          />
        </section>
      );
    }

    return null;
  };

  return <div className="blocks-container">{blocks.map((b, i) => renderBlock(b, i))}</div>;
}
