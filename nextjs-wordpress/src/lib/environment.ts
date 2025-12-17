/**
 * Environment Detection and Dynamic URL Configuration
 * Handles automatic environment detection and URL configuration for both Next.js and WordPress
 */

export type Environment = 'local' | 'development' | 'staging' | 'production';

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
  if (explicitEnv && ['local', 'development', 'staging', 'production'].includes(explicitEnv)) {
    return explicitEnv as Environment;
  }

  // Server-side detection
  if (typeof window === 'undefined') {
    // Check if running on Vercel
    const isVercel = process.env.VERCEL === '1';
    
    // If on Vercel, use development environment (points to dev.moreyeahs.com)
    if (isVercel) {
      return 'development';
    }
    
    // Check NODE_ENV and other indicators for local development
    if (process.env.NODE_ENV === 'development') {
      return 'local';
    }
    
    // Check Vercel environment for more specific detection
    if (process.env.VERCEL_ENV) {
      switch (process.env.VERCEL_ENV) {
        case 'development':
          return 'development';
        case 'preview':
          return 'development'; // Use dev server for preview deployments too
        case 'production':
          return 'development'; // Use dev server for production deployments too
      }
    }
    
    // Check URLs for environment indicators
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
    const wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_URL || '';
    
    if (siteUrl.includes('localhost') || wordpressUrl.includes('localhost')) {
      return 'local';
    }
    
    // Default to development for server-side (Vercel)
    return 'development';
  }
  
  // Client-side detection
  const hostname = window.location.hostname;
  
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.endsWith('.local')) {
    return 'local';
  }
  
  // If running on Vercel (any .vercel.app domain), use development
  if (hostname.endsWith('.vercel.app')) {
    return 'development';
  }
  
  // Default to development for any other domain (points to dev.moreyeahs.com)
  return 'development';
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
        // Local development - use localhost
        wordpressUrl = 'http://localhost/moreyeahs-new';
        break;
      case 'development':
        // Vercel or other remote environments - use dev server
        wordpressUrl = 'https://dev.moreyeahs.com';
        break;
      case 'staging':
        wordpressUrl = process.env.WORDPRESS_STAGING_API_URL
          ? process.env.WORDPRESS_STAGING_API_URL.replace(/\/wp-json\/?$/i, '')
          : (process.env.NEXT_PUBLIC_WORDPRESS_STAGING_URL || 'https://staging.moreyeahs.com');
        break;
      case 'production':
        wordpressUrl = process.env.WORDPRESS_PROD_API_URL
          ? process.env.WORDPRESS_PROD_API_URL.replace(/\/wp-json\/?$/i, '')
          : (process.env.NEXT_PUBLIC_WORDPRESS_PROD_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || 'https://moreyeahs.com');
        break;
    }
  } else {
    // Client-side URL detection
    nextjsUrl = `${window.location.protocol}//${window.location.host}`;
    
    // WordPress URL based on detected environment and available env vars
    switch (environment) {
      case 'local':
        // Local development - use localhost
        wordpressUrl = 'http://localhost/moreyeahs-new';
        break;
      case 'development':
        // Vercel or other remote environments - use dev server
        wordpressUrl = 'https://dev.moreyeahs.com';
        break;
      case 'staging':
        wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_STAGING_URL || 'https://staging.moreyeahs.com';
        break;
      case 'production':
        wordpressUrl = process.env.NEXT_PUBLIC_WORDPRESS_PROD_URL || 
                      process.env.NEXT_PUBLIC_WORDPRESS_URL || 
                      'https://moreyeahs.com';
        break;
    }
  }
  
  // WordPress API URL
  // Sanitize production builds: avoid localhost WordPress URLs on Vercel
  if ((process.env.VERCEL_ENV === 'production' || environment === 'production') && wordpressUrl.includes('localhost')) {
    const prodCandidate = process.env.NEXT_PUBLIC_WORDPRESS_PROD_URL || process.env.NEXT_PUBLIC_WORDPRESS_URL || '';
    if (prodCandidate && !prodCandidate.includes('localhost')) {
      wordpressUrl = prodCandidate;
    } else {
      wordpressUrl = 'https://moreyeahs.com';
    }
  }

  wordpressApiUrl = `${wordpressUrl}/wp-json`;

  // Optional build-time debug log (only server-side)
  if (typeof window === 'undefined' && (process.env.DEBUG_ENV === 'true' || process.env.NEXT_PUBLIC_DEBUG_ENV === 'true')) {
    // eslint-disable-next-line no-console
    console.info(`[env] environment=${environment} nextjsUrl=${nextjsUrl} wordpressUrl=${wordpressUrl} wordpressApiUrl=${wordpressApiUrl}`);
  }
  
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
  
  // Extract the media path (everything after wp-content)
  const mediaPathMatch = url.match(/\/wp-content\/uploads\/(.+)$/);
  if (!mediaPathMatch) {
    // If it's not a standard WordPress media URL, return as-is
    return url;
  }
  
  const mediaPath = mediaPathMatch[1];
  return `${config.wordpressUrl}/wp-content/uploads/${mediaPath}`;
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
        name: 'moreyeahs_dev',
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
        name: 'moreyeahs_dev',
        user: 'root',
        password: '',
      };
  }
}