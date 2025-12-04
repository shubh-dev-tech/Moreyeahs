export const SITE_CONFIG = {
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  name: process.env.NEXT_PUBLIC_SITE_NAME || 'My Site',
  description: process.env.NEXT_PUBLIC_SITE_DESCRIPTION || '',
  locale: 'en_US',
  twitter: '@yourhandle', // Update with your Twitter handle
};

export const WORDPRESS_CONFIG = {
  apiUrl: process.env.WORDPRESS_API_URL || '',
  restApiUrl: process.env.WORDPRESS_REST_API_URL || '',
  url: process.env.NEXT_PUBLIC_WORDPRESS_URL || '',
};

export const REVALIDATE_TIME = parseInt(process.env.REVALIDATE_TIME || '3600');

export const IMAGE_SIZES = {
  thumbnail: { width: 150, height: 150 },
  medium: { width: 300, height: 300 },
  large: { width: 1024, height: 1024 },
  featured: { width: 1200, height: 630 },
};

export const POSTS_PER_PAGE = 10;
