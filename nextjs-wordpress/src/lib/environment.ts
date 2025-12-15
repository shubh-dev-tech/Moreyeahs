/**
 * Environment Detection and Dynamic URL Configuration
 * Handles automatic environment detection and URL configuration for both Next.js and WordPress
 */

export type Environment = 'local' | 'development' | 'staging' | 'production' | 'vercel';

export interface EnvironmentConfig {
  environment: Environment;
  nextjsUrl: string;
  wordpressUrl: string;
  wordpressApiUrl: string;
  isLocal: boolean;
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
}

/**
 * Detect current environment based on various factors
 */
export function detectEnvironment(): Environment {
  // Check explicit environment variable first
  const explicitEnv = process.env.NEXT_PUBLIC_ENVIRONMENT;
  if (explicitEnv && ['local', 'development', 'staging', 'production', 'vercel'].includes(explicitEnv)) {
    return explicitEnv as Environment;
  }

  // Server-side detection
  if (typeof window === 'undefined') {
    // Check NODE_ENV and other indicators
    if (process.env.NODE_ENV === 'development') {
      return 'local';
    }
    
    // Check if we're specifically in Vercel environment
    if (process.env.VERCEL && process.env.NEXT_PUBLIC_ENVIRONMENT === 'vercel') {
      return 'vercel';
    }
    
    // Check Vercel environment
    if (process.env.VERCEL_ENV) {
      switch (process.env.VERCEL_ENV) {
        case 'development':
          return 'local';
        case 'preview':
          return 'staging';
        case 'production':
          return 'production';
      }
    }
    
    // Check URLs for environment indicators
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || '';
    
    if (siteUrl.includes('localhost') || wordpressUrl.includes('localhost')) {
      return 'local';
    }
    if (siteUrl.includes('staging') || wordpressUrl.includes('staging')) {
      return 'staging';
    }
    if (siteUrl.includes('dev.') || wordpressUrl.includes('dev.')) {
      return 'development';
    }
    
    // Default to production for server-side
    return 'production';
  }
  
  // Client-side detection
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')) {
    return 'local';
  }
  
  if (hostname.includes('staging')) {
    return 'staging';
  }
  
  if (hostname.includes('dev.') || hostname.includes('-dev.')) {
    return 'development';
  }
  
  // Check if it's a Vercel preview deployment
  if (hostname.endsWith('.vercel.app') && !hostname.includes('moreyeahsnew.vercel.app')) {
    return 'staging';
  }
  
  return 'production';
}

/**
 * Get environment-specific URLs
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const environment = detectEnvironment();
  
  let nextjsUrl = '';
  let wordpressUrl = '';
  let wordpressApiUrl = '';
  
  // Server-side URL detection
  if (typeof window === 'undefined') {
    // Next.js URL
    nextjsUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    // WordPress URL based on environment
    switch (environment) {
      case 'local':
        wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_FALLBACK_URL || 'http://localhost/moreyeahs-new';
        break;
      case 'development':
        wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_DEV_URL || 
                      process.env.NEXT_PUBLIC_WORDPRESS_URL || 
                      'https://dev.moreyeahs.com';
        break;
      case 'staging':
        wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_STAGING_URL || 'https://staging.moreyeahs.com';
        break;
      case 'vercel':
        // Vercel environment uses dev.moreyeahs.com as data source
        wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_DEV_URL || 
                      process.env.NEXT_PUBLIC_WORDPRESS_URL || 
                      'https://dev.moreyeahs.com';
        break;
      case 'production':
        wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_PROD_URL || 
                      process.env.NEXT_PUBLIC_WORDPRESS_URL || 
                      'https://moreyeahs.com';
        break;
    }
  } else {
    // Client-side URL detection
    nextjsUrl = `${window.location.protocol}//${window.location.host}`;
    
    // WordPress URL based on detected environment and available env vars
    switch (environment) {
      case 'local':
        wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_FALLBACK_URL || 'http://localhost/moreyeahs-new';
        break;
      case 'development':
        wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_DEV_URL || 
                      process.env.NEXT_PUBLIC_WORDPRESS_URL || 
                      'https://dev.moreyeahs.com';
        break;
      case 'staging':
        wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_STAGING_URL || 'https://staging.moreyeahs.com';
        break;
      case 'vercel':
        // Vercel environment uses dev.moreyeahs.com as data source
        wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_DEV_URL || 
                      process.env.NEXT_PUBLIC_WORDPRESS_URL || 
                      'https://dev.moreyeahs.com';
        break;
      case 'production':
        wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_PROD_URL || 
                      process.env.NEXT_PUBLIC_WORDPRESS_URL || 
                      'https://moreyeahs.com';
        break;
    }
  }
  
  // WordPress API URL
  wordpressApiUrl = `${wordpressUrl}/wp-json`;
  
  return {
    environment,
    nextjsUrl,
    wordpressUrl,
    wordpressApiUrl,
    isLocal: environment === 'local',
    isDevelopment: environment === 'development',
    isStaging: environment === 'staging',
    isProduction: environment === 'production',
  };
}

/**
 * Transform WordPress media URLs to use current environment
 */
export function transformMediaUrl(url: string): string {
  if (!url) return url;
  
  const config = getEnvironmentConfig();
  
  // Debug logging on server-side
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('transformMediaUrl:', { url, wordpressUrl: config.wordpressUrl });
  }
  
  // If URL is already pointing to the correct domain, return as-is
  if (url.startsWith(config.wordpressUrl)) {
    return url;
  }
  
  // Extract the media path (everything after wp-content)
  const mediaPathMatch = url.match(/\/wp-content\/uploads\/(.+)$/);
  if (mediaPathMatch) {
    const mediaPath = mediaPathMatch[1];
    const result = `${config.wordpressUrl}/wp-content/uploads/${mediaPath}`;
    return result;
  }
  
  // If it's a relative URL (starts with /wp-content), prepend the WordPress URL
  if (url.startsWith('/wp-content/')) {
    return `${config.wordpressUrl}${url}`;
  }
  
  // If it's a relative URL but doesn't have wp-content, it might be relative to uploads
  if (!url.startsWith('http') && !url.startsWith('/')) {
    // Assume it's relative to uploads folder
    return `${config.wordpressUrl}/wp-content/uploads/${url}`;
  }
  
  // If it's not a standard WordPress media URL, return as-is
  // Make sure we never return empty string
  return url && url.length > 0 ? url : '';
}

/**
 * Transform any WordPress URL to use current environment
 */
export function transformWordPressUrl(url: string): string {
  if (!url) return url;
  
  const config = getEnvironmentConfig();
  
  // If it's already using the correct domain, return as-is
  if (url.startsWith(config.wordpressUrl)) {
    return url;
  }
  
  // Extract path from WordPress URL
  const urlObj = new URL(url);
  const path = urlObj.pathname + urlObj.search + urlObj.hash;
  
  return `${config.wordpressUrl}${path}`;
}

/**
 * Get current WordPress base URL
 */
export function getWordPressUrl(): string {
  return getEnvironmentConfig().wordpressUrl;
}

/**
 * Get current WordPress API URL
 */
export function getWordPressApiUrl(): string {
  return getEnvironmentConfig().wordpressApiUrl;
}

/**
 * Get current Next.js URL
 */
export function getNextJsUrl(): string {
  return getEnvironmentConfig().nextjsUrl;
}

/**
 * Check if we're in a specific environment
 */
export function isEnvironment(env: Environment): boolean {
  return detectEnvironment() === env;
}

/**
 * Get environment-specific database configuration (for WordPress)
 */
export function getDatabaseConfig() {
  const environment = detectEnvironment();
  
  switch (environment) {
    case 'local':
      return {
        host: 'localhost',
        name: 'moreyeahs-new',
        user: 'root',
        password: '',
      };
    case 'development':
      return {
        host: process.env.DB_HOST || 'localhost',
        name: process.env.DB_NAME || 'moreyeahs_dev',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
      };
    case 'staging':
      return {
        host: process.env.DB_HOST_STAGING || 'localhost',
        name: process.env.DB_NAME_STAGING || 'moreyeahs_staging',
        user: process.env.DB_USER_STAGING || 'root',
        password: process.env.DB_PASSWORD_STAGING || '',
      };
    case 'production':
      return {
        host: process.env.DB_HOST_PROD || 'localhost',
        name: process.env.DB_NAME_PROD || 'moreyeahs_prod',
        user: process.env.DB_USER_PROD || 'root',
        password: process.env.DB_PASSWORD_PROD || '',
      };
    default:
      return {
        host: 'localhost',
        name: 'moreyeahs-new',
        user: 'root',
        password: '',
      };
  }
}