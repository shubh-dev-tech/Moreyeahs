/**
 * Client-side Environment Configuration
 * 
 * This handles environment variables that are available on the client side.
 * Only NEXT_PUBLIC_ variables are available in the browser.
 */

// Client-side environment detection
function getClientEnvVar(key: string, fallback: string = ''): string {
  if (typeof window === 'undefined') return fallback;
  return process.env[key] || fallback;
}

// Environment detection for client-side
export const IS_CLIENT_LOCAL = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || 
  window.location.hostname === '127.0.0.1'
);

// WordPress API URL for client-side components
export function getClientWordPressApiUrl(): string {
  // Check for explicit environment variable first
  const explicitUrl = getClientEnvVar('NEXT_PUBLIC_WP_API', '');
  if (explicitUrl) return explicitUrl;
  
  // Auto-detect based on current hostname
  if (IS_CLIENT_LOCAL) {
    // Local development - use localhost
    return 'http://localhost/moreyeahs-new/wp-json';
  } else {
    // Production or other environments - use dev server
    return 'https://dev.moreyeahs.com/wp-json';
  }
}

export const CLIENT_WORDPRESS_API_URL = getClientWordPressApiUrl();