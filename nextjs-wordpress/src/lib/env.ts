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

// WordPress API URL with hardcoded fallback
export const WORDPRESS_API_URL = getEnvVar(
  'NEXT_PUBLIC_WP_API', 
  'https://dev.moreyeahs.com/wp-json'
);

// Additional environment variables with safe fallbacks
export const WORDPRESS_BASE_URL = WORDPRESS_API_URL.replace(/\/wp-json\/?$/, '');
export const NODE_ENV = getEnvVar('NODE_ENV', 'production');
export const IS_DEVELOPMENT = NODE_ENV === 'development';
export const REVALIDATE_TIME = parseInt(getEnvVar('REVALIDATE_TIME', '60'));

// Build-time safety check - log configuration but never throw
if (typeof process !== 'undefined' && IS_DEVELOPMENT) {
  console.log('[env] WordPress API:', WORDPRESS_API_URL);
  console.log('[env] Base URL:', WORDPRESS_BASE_URL);
}