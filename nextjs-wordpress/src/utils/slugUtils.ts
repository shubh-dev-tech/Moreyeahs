/**
 * Utility functions for handling and sanitizing URL slugs
 */

/**
 * Sanitize a slug to ensure it's valid for WordPress and Next.js routing
 */
export function sanitizeSlug(slug: string): string {
  if (!slug || typeof slug !== 'string') {
    return '';
  }
  
  return slug
    .toLowerCase()
    .trim()
    // Replace invalid characters with hyphens
    .replace(/[^a-z0-9-]/g, '-')
    // Replace multiple hyphens with single hyphen
    .replace(/-+/g, '-')
    // Remove leading and trailing hyphens
    .replace(/^-|-$/g, '')
    // Limit length to prevent issues
    .substring(0, 200);
}

/**
 * Validate if a slug is acceptable
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return false;
  }
  
  // Check length
  if (slug.length < 1 || slug.length > 200) {
    return false;
  }
  
  // Check for valid characters only
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return false;
  }
  
  // Check for consecutive hyphens
  if (slug.includes('--')) {
    return false;
  }
  
  // Check for leading/trailing hyphens
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return false;
  }
  
  return true;
}

/**
 * Extract slug from a URL path
 */
export function extractSlugFromPath(path: string, prefix: string = ''): string {
  if (!path || typeof path !== 'string') {
    return '';
  }
  
  // Remove leading slash
  const cleanPath = path.startsWith('/') ? path.substring(1) : path;
  
  // Remove prefix if provided
  if (prefix && cleanPath.startsWith(prefix)) {
    return cleanPath.substring(prefix.length);
  }
  
  return cleanPath;
}

/**
 * Generate a clean slug from a title or text
 */
export function generateSlugFromTitle(title: string): string {
  if (!title || typeof title !== 'string') {
    return '';
  }
  
  return title
    .toLowerCase()
    .trim()
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Replace spaces and special characters with hyphens
    .replace(/[^a-z0-9]+/g, '-')
    // Remove multiple hyphens
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '')
    // Limit length
    .substring(0, 100);
}

/**
 * Check if a slug might be malformed (too long, contains invalid patterns)
 */
export function isMalformedSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') {
    return true;
  }
  
  // Too long
  if (slug.length > 200) {
    return true;
  }
  
  // Contains invalid characters
  if (/[^a-zA-Z0-9-]/.test(slug)) {
    return true;
  }
  
  // Contains multiple consecutive hyphens
  if (slug.includes('--')) {
    return true;
  }
  
  // Starts or ends with hyphen
  if (slug.startsWith('-') || slug.endsWith('-')) {
    return true;
  }
  
  // Too many hyphens (might indicate a malformed URL)
  const hyphenCount = (slug.match(/-/g) || []).length;
  if (hyphenCount > slug.length / 3) {
    return true;
  }
  
  return false;
}