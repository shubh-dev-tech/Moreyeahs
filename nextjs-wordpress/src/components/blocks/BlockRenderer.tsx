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
import CounterBlock from './counter-block/CounterBlock';
import NewsBlock from './news-block/NewsBlock';
import InvestorBlock from './investor-block/InvestorBlock';
import TestimonialBlock from './testimonial-block/TestimonialBlock';
import NavigationNextBlock from './navigation-next-block/NavigationNextBlock';
import StepperBlock from './stepper-block/StepperBlock';
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
};

export function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="blocks-container">
      {blocks.map((block, index) => {
        if (!block.blockName) {
          return null;
        }

        const BlockComponent = BLOCK_COMPONENTS[block.blockName];

        if (!BlockComponent) {
          return null;
        }

        const blockData = isACFBlock(block) ? block.attrs.data : block.attrs;
        
        // Get section ID from block anchor attribute or fallback to default mapping
        const sectionId = block.attrs?.anchor || BLOCK_SECTION_IDS[block.blockName];

        return (
          <section
            key={`${block.blockName}-${index}`}
            id={sectionId}
          >
            <BlockComponent
              data={blockData}
              innerHTML={block.innerHTML}
              {...block.attrs}
            />
          </section>
        );
      })}
    </div>
  );
}
