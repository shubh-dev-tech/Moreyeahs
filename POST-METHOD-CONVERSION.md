# POST Method Conversion Documentation

## Overview

This document outlines the complete conversion of your WordPress headless website from GET to POST methods for all data fetching operations.

## Changes Made

### 1. WordPress REST API Endpoints

**Files Modified:**
- `wp-content/themes/twentytwentyfive/inc/rest-api-endpoints.php`
- `wp-content/themes/twentytwentyfive-child/inc/rest-api-endpoints.php`

**Changes:**
- All existing custom endpoints now use `POST` method instead of `GET`
- Added new POST endpoints for standard WordPress data:
  - `/wp/v2/posts-data` - Get posts with parameters in POST body
  - `/wp/v2/pages-data` - Get pages with parameters in POST body
  - `/wp/v2/post-by-slug` - Get single post by slug
  - `/wp/v2/page-by-slug` - Get single page by slug

### 2. Next.js Fetch Functions

**Files Modified:**
- `nextjs-wordpress/src/lib/wordpress.ts`
- `nextjs-wordpress/src/lib/wpFetch.ts`

**Changes:**
- `fetchWordPressAPI()` now uses POST method with JSON body
- `fetchRestAPI()` now uses POST method with JSON body
- `wpFetch()` now uses POST method with JSON body
- All helper functions updated to pass data in POST body instead of URL parameters

### 3. CORS Configuration

**Changes:**
- Updated CORS headers to only allow POST and OPTIONS methods
- Added proper headers for POST requests with JSON content

## Usage Examples

### Before (GET Method)
```javascript
// Old way - GET with query parameters
const posts = await fetch('/wp/v2/posts?per_page=10&category=news');
```

### After (POST Method)
```javascript
// New way - POST with JSON body
const posts = await fetch('/wp/v2/posts-data', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    per_page: 10,
    category: 'news'
  })
});
```

### Using Helper Functions
```javascript
// Using wpFetch helper
import { getPosts, getPostBySlug } from '@/lib/wpFetch';

// Get posts with parameters
const posts = await getPosts({ per_page: 10, category: 'news' });

// Get single post by slug
const post = await getPostBySlug('my-post-slug');
```

## Available POST Endpoints

### Custom Endpoints
- `POST /wp/v2/menus` - Get all menus
- `POST /wp/v2/menus/{location}` - Get menu by location
- `POST /wp/v2/site-settings` - Get site settings (logo, favicon, etc.)
- `POST /wp/v2/footer-widgets` - Get footer widgets
- `POST /wp/v2/mega-menus` - Get mega menus
- `POST /wp/v2/pages-with-blocks/{slug}` - Get page with ACF blocks

### Standard WordPress Data (New POST Endpoints)
- `POST /wp/v2/posts-data` - Get posts with filtering
- `POST /wp/v2/pages-data` - Get pages with filtering
- `POST /wp/v2/post-by-slug` - Get single post by slug
- `POST /wp/v2/page-by-slug` - Get single page by slug

## Request Body Parameters

### Posts Data (`/wp/v2/posts-data`)
```json
{
  "per_page": 10,
  "page": 1,
  "category": "news",
  "tag": "featured",
  "author": 1,
  "search": "search term"
}
```

### Pages Data (`/wp/v2/pages-data`)
```json
{
  "per_page": 10,
  "page": 1,
  "search": "search term"
}
```

### Single Post/Page by Slug
```json
{
  "slug": "post-or-page-slug"
}
```

## Testing

A test file has been created at `nextjs-wordpress/test-post-methods.js` to verify all endpoints are working correctly with POST methods.

To run the test:
```bash
cd nextjs-wordpress
node test-post-methods.js
```

## Benefits of POST Method

1. **Security**: POST requests don't expose sensitive data in URLs
2. **Flexibility**: Can send complex data structures in request body
3. **Caching Control**: Better control over caching behavior
4. **URL Length**: No URL length limitations for complex queries
5. **Data Privacy**: Request parameters are not logged in server access logs

## Migration Notes

- All existing functionality remains the same from the frontend perspective
- The helper functions in `wpFetch.ts` handle the POST conversion automatically
- No changes needed in React components that use the helper functions
- CORS is properly configured to support POST requests from your Next.js frontend

## Troubleshooting

If you encounter issues:

1. **CORS Errors**: Ensure your WordPress site URL is in the allowed origins
2. **404 Errors**: Verify the REST API endpoints are registered correctly
3. **JSON Parsing**: Ensure Content-Type header is set to 'application/json'
4. **Authentication**: Some endpoints may require authentication in production

## Security Considerations

- All endpoints use `'permission_callback' => '__return_true'` for public access
- Consider adding authentication for sensitive endpoints in production
- Validate and sanitize all input parameters in the endpoint callbacks
- Use WordPress nonces for authenticated requests if needed