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
    // Remove Elementor-related link tags (CSS)
    .replace(/<link[^>]*elementor[^>]*>/gi, '')
    // Remove Elementor-related style tags
    .replace(/<style[^>]*elementor[^>]*>[\s\S]*?<\/style>/gi, '')
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
    .replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, '')
    // Remove Elementor data attributes
    .replace(/\s*data-elementor[^=]*="[^"]*"/gi, '')
    .replace(/\s*data-elementor[^=]*='[^']*'/gi, '');
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

  // Block Elementor scripts from loading
  const originalCreateElement = document.createElement.bind(document);
  document.createElement = function(tagName: string, options?: any) {
    const element = originalCreateElement(tagName, options);
    
    if (tagName.toLowerCase() === 'script' || tagName.toLowerCase() === 'link') {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && (mutation.attributeName === 'src' || mutation.attributeName === 'href')) {
            const target = mutation.target as HTMLElement;
            const src = target.getAttribute('src') || target.getAttribute('href') || '';
            
            // Block Elementor-related resources
            if (src.includes('elementor') || src.includes('/wp-content/plugins/elementor')) {
              console.warn('Blocked Elementor resource:', src);
              target.remove();
            }
          }
        });
      });
      
      observer.observe(element, { attributes: true });
    }
    
    return element;
  };

  // Add global error handler for undefined WordPress functions
  const originalError = window.onerror;
  
  window.onerror = function(message, source, lineno, colno, error) {
    // Check if this is a WordPress block function error
    if (typeof message === 'string' && message.includes('_block_') && message.includes('is not defined')) {
      console.warn('WordPress block function error caught and ignored:', message);
      return true; // Prevent the error from being thrown
    }

    // Check if this is an Elementor-related error
    if (typeof message === 'string' && message.toLowerCase().includes('elementor')) {
      console.warn('Elementor error caught and ignored:', message);
      return true;
    }

    // Call original error handler if it exists
    if (originalError) {
      return originalError.call(this, message, source, lineno, colno, error);
    }

    return false;
  };

  // Also handle unhandled promise rejections
  window.addEventListener('unhandledrejection', function(event) {
    if (event.reason && typeof event.reason === 'string') {
      if ((event.reason.includes('_block_') && event.reason.includes('is not defined')) ||
          event.reason.toLowerCase().includes('elementor')) {
        console.warn('WordPress/Elementor promise rejection caught and ignored:', event.reason);
        event.preventDefault();
      }
    }
  });

  // Block network requests to Elementor resources
  if ('fetch' in window) {
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
      const url = args[0]?.toString() || '';
      
      if (url.includes('elementor') || url.includes('/wp-content/plugins/elementor')) {
        console.warn('Blocked Elementor fetch request:', url);
        return Promise.reject(new Error('Elementor resource blocked'));
      }
      
      return originalFetch.apply(this, args);
    };
  }
}