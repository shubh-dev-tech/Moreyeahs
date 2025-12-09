/**
 * Gutenberg Blocks Parser and Utilities
 * Parses WordPress block content and extracts block data
 */

export interface Block {
  blockName: string | null;
  attrs: Record<string, any>;
  innerHTML: string;
  innerContent: (string | null)[];
  innerBlocks: Block[];
}

export interface ACFBlock extends Block {
  blockName: string;
  attrs: {
    id: string;
    name: string;
    data: Record<string, any>;
    mode?: string;
    [key: string]: any;
  };
}

/**
 * Parse WordPress block content
 * Handles both Gutenberg blocks and ACF blocks
 */
export function parseBlocks(content: string): Block[] {
  if (!content) return [];
  
  const blocks: Block[] = [];
  const blockRegex = /<!--\s+wp:([a-z0-9-]+\/[a-z0-9-]+|[a-z0-9-]+)(\s+(\{[^}]*\}))?\s+(\/)?-->/g;
  
  let lastIndex = 0;
  let match;
  
  while ((match = blockRegex.exec(content)) !== null) {
    const blockName = match[1];
    const attrsString = match[3];
    const isSelfClosing = match[4] === '/';
    
    let attrs = {};
    if (attrsString) {
      try {
        attrs = JSON.parse(attrsString);
      } catch (e) {
        // Silently handle parse error
      }
    }
    
    // Extract content between block markers
    const startIndex = match.index + match[0].length;
    const endMarker = `<!-- /wp:${blockName} -->`;
    const endIndex = content.indexOf(endMarker, startIndex);
    
    const innerHTML = endIndex > startIndex 
      ? content.substring(startIndex, endIndex).trim()
      : '';
    
    blocks.push({
      blockName,
      attrs,
      innerHTML,
      innerContent: [innerHTML],
      innerBlocks: [],
    });
    
    lastIndex = endIndex > 0 ? endIndex + endMarker.length : startIndex;
  }
  
  return blocks;
}

/**
 * Check if a block is an ACF block
 */
export function isACFBlock(block: Block): block is ACFBlock {
  return block.blockName?.startsWith('acf/') || false;
}

/**
 * Extract ACF field data from block
 */
export function getACFData(block: Block): Record<string, any> {
  if (isACFBlock(block)) {
    return block.attrs.data || {};
  }
  return {};
}

/**
 * Get block type without namespace
 */
export function getBlockType(blockName: string): string {
  return blockName.split('/').pop() || blockName;
}
