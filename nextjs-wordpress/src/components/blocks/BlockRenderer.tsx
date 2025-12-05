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
  
  // Custom Blocks (without ACF)
  'moreyeahs/slider': MoreyeahsSliderBlock,
  
  // Core Gutenberg Blocks
  'core/paragraph': CoreParagraph,
  'core/heading': CoreHeading,
  'core/image': CoreImage,
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
          console.warn(`No component found for block: ${block.blockName}`);
          return (
            <div key={index} className="unsupported-block">
              <p>Unsupported block: {block.blockName}</p>
            </div>
          );
        }

        const blockData = isACFBlock(block) ? block.attrs.data : block.attrs;

        return (
          <BlockComponent
            key={`${block.blockName}-${index}`}
            data={blockData}
            innerHTML={block.innerHTML}
            {...block.attrs}
          />
        );
      })}
    </div>
  );
}
