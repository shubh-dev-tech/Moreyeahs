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
  if (!content || typeof content !== 'string') return [];

  const blocks: Block[] = [];

  // Find opening block comments like <!-- wp:block/name { ... } -->
  const openRegex = /<!--\s*wp:([\w-\/]+)([\s\S]*?)-->/g;

  let match: RegExpExecArray | null;

  while ((match = openRegex.exec(content)) !== null) {
    const fullMatch = match[0];
    const blockName = match[1];
    const afterName = match[2] || '';

    // Determine if this is self-closing (ends with /-->)
    const isSelfClosing = /\/\s*-->$/.test(fullMatch);

    // Try to extract a JSON attrs object from the opening comment if present
    let attrs: Record<string, any> = {};
    const jsonStart = afterName.indexOf('{');
    if (jsonStart !== -1) {
      // Find matching closing brace to support nested objects
      const substr = afterName.slice(jsonStart);
      let braceDepth = 0;
      let endIndex = -1;
      for (let i = 0; i < substr.length; i++) {
        const ch = substr[i];
        if (ch === '{') braceDepth++;
        else if (ch === '}') {
          braceDepth--;
          if (braceDepth === 0) {
            endIndex = i;
            break;
          }
        }
      }

      if (endIndex !== -1) {
        const jsonText = substr.slice(0, endIndex + 1);
        try {
          attrs = JSON.parse(jsonText);
        } catch (e) {
          // fall back to empty attrs
          attrs = {};
        }
      }
    }

    // Compute innerHTML: for non-self-closing blocks, find the closing comment
    let innerHTML = '';
    if (!isSelfClosing) {
      const endMarker = `<!-- /wp:${blockName} -->`;
      const startIndex = match.index + fullMatch.length;
      const endIndex = content.indexOf(endMarker, startIndex);
      if (endIndex !== -1) {
        innerHTML = content.substring(startIndex, endIndex).trim();
      } else {
        innerHTML = '';
      }
    }

    blocks.push({
      blockName,
      attrs,
      innerHTML,
      innerContent: innerHTML ? [innerHTML] : [],
      innerBlocks: [],
    });
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
