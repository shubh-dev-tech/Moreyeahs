/**
 * WordPress Content Utilities
 * Handles sanitization and processing of WordPress content for Next.js
 */

/**
 * Sanitizes WordPress HTML content for safe rendering in Next.js
 * Removes potentially problematic scripts and event handlers
 */
export function sanitizeWordPressContent(html: string): string {
  if (!html) return '';

  return html
    // Remove all script tags and their content
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    // Remove inline event handlers
    .replace(/\s*on\w+="[^"]*"/gi, '')
    .replace(/\s*on\w+='[^']*'/gi, '')
    // Remove javascript: URLs
    .replace(/href="javascript:[^"]*"/gi, 'href="#"')
    .replace(/src="javascript:[^"]*"/gi, '')
    // Remove any remaining onclick, onload, etc. attributes
    .replace(/\s*on[a-z]+\s*=\s*["'][^"']*["']/gi, '')
    // Clean up any WordPress-generated function calls that might be problematic
    .replace(/\w+_block_[a-f0-9]+\s*\(/gi, 'void(')
    // Remove any remaining script-like content
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '');
}

/**
 * Processes WordPress blocks data for Next.js components
 */
export function processWordPressBlocks(blocks: any[]): any[] {
  if (!Array.isArray(blocks)) return [];

  return blocks.map(block => {
    // Ensure block has required properties
    if (!block || typeof block !== 'object') return block;

    // Process any HTML content in the block
    if (block.content && typeof block.content === 'string') {
      block.content = sanitizeWordPressContent(block.content);
    }

    // Recursively process nested blocks
    if (block.innerBlocks && Array.isArray(block.innerBlocks)) {
      block.innerBlocks = processWordPressBlocks(block.innerBlocks);
    }

    return block;
  });
}

/**
 * Global error handler for WordPress-related JavaScript errors
 */
export function setupWordPressErrorHandler(): void {
  if (typeof window === 'undefined') return;

  // Add global error handler for undefined WordPress functions
  const originalError = window.onerror;
  
  window.onerror = function(message, source, lineno, colno, error) {
    // Check if this is a WordPress block function error
    if (typeof message === 'string' && message.includes('_block_') && message.includes('is not defined')) {
      console.warn('WordPress block function error caught and ignored:', message);
      return true; // Prevent the error from being thrown
    }

    // Call original error handler if it exists
    if (originalError) {
      return originalError.call(this, message, source, lineno, colno, error);
    }

    return false;
  };

  // Also handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && typeof event.reason === 'string' && 
        event.reason.includes('_block_') && event.reason.includes('is not defined')) {
      console.warn('WordPress block promise rejection caught and ignored:', event.reason);
      event.preventDefault();
    }
  });
}