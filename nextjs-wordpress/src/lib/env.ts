/**
 * Environment Configuration - Build-Safe
 * 
 * This is the ONLY place where process.env is accessed.
 * Provides safe fallbacks to ensure builds never fail.
 */

// Safe environment variable access with fallbacks
function getEnvVar(key: string, fallback: string = ''): string {
  if (typeof process === 'undefined') return fallback;
  return process.env[key] || fallback;
}

// Environment detection
export const NODE_ENV = getEnvVar('NODE_ENV', 'production');
export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const IS_VERCEL = getEnvVar('VERCEL', '') === '1';
export const IS_LOCAL = !IS_VERCEL && (
  typeof window !== 'undefined' 
    ? window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    : IS_DEVELOPMENT
);

// WordPress URL selection based on environment
function getWordPressApiUrl(): string {
  // Check for explicit environment variable first
  const explicitUrl = getEnvVar('NEXT_PUBLIC_WP_API', '');
  if (explicitUrl) return explicitUrl;
  
  // Auto-detect based on environment
  if (IS_LOCAL) {
    // Local development - use localhost
    return 'http://localhost/moreyeahs-new/wp-json';
  } else {
    // Vercel or other production environments - use dev server
    return 'https://dev.moreyeahs.com/wp-json';
  }
}

// WordPress API URL with smart environment detection
export const WORDPRESS_API_URL = getWordPressApiUrl();

// Additional environment variables with safe fallbacks
export const WORDPRESS_BASE_URL = WORDPRESS_API_URL.replace(/\/wp-json\/?$/, '');
export const REVALIDATE_TIME = parseInt(getEnvVar('REVALIDATE_TIME', '60'));

// Utility function for components to get WordPress URL
export function getWordPressUrl(): string {
  return WORDPRESS_BASE_URL;
}

// Build-time safety check - log configuration but never throw
if (typeof process !== 'undefined' && IS_DEVELOPMENT) {
  // Environment logging removed for production
}