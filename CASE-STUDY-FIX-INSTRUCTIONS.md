# Case Study Fix Instructions

## Problem
The case studies are working on Vercel but not on `moreyeahs.in` because the environment configuration was not properly detecting the production domain. The WordPress API should always use `https://dev.moreyeahs.com` regardless of where the Next.js frontend is deployed.

## Changes Made

### 1. Updated Environment Configuration (`nextjs-wordpress/src/lib/environment.ts`)

**Changes:**
- Added detection for `moreyeahs.in` domain to use production environment
- **Fixed production WordPress URL to use `https://dev.moreyeahs.com`** (the correct WordPress API server)
- Improved server-side environment detection for Vercel deployments
- Added better URL detection logic for production domains

**Key Updates:**
```typescript
// Client-side detection now includes:
if (hostname === 'moreyeahs.in' || hostname === 'www.moreyeahs.in') {
  return 'production';
}

// Server-side detection now checks:
if (siteUrl.includes('moreyeahs.in')) {
  return 'production';
}

// Production WordPress URL corrected to:
'https://dev.moreyeahs.com'
```

### 2. Updated Environment Files

**Updated `.env.production`:**
```env
NEXT_PUBLIC_WORDPRESS_URL=https://dev.moreyeahs.com
WORDPRESS_REST_API_URL=https://dev.moreyeahs.com/wp-json
```

## Architecture Clarification

- **Next.js Frontend**: Can run on `moreyeahs.in`, Vercel, or other domains
- **WordPress API**: Always uses `https://dev.moreyeahs.com/wp-json/wp/v2/case_study`
- **Environment Detection**: Based on where the Next.js app is running, but WordPress URL remains consistent

### 3. Enhanced Case Study Error Handling

**Updated Files:**
- `nextjs-wordpress/src/app/case-study/page.tsx`
- `nextjs-wordpress/src/app/case-study/[slug]/page.tsx`

**Improvements:**
- Added detailed logging for API requests and responses
- Added fallback mechanism to fetch from regular posts if custom post type fails
- Enhanced error handling with response body logging
- Added User-Agent headers to requests

### 4. Created Debug Tools

**New Files:**
- `nextjs-wordpress/src/app/api/debug-case-studies/route.ts` - API endpoint to test WordPress connections
- `nextjs-wordpress/src/app/debug-env/page.tsx` - Environment debug page

## Testing the Fix

### 1. Test Environment Detection
Visit: `https://moreyeahs.in/debug-env`

This should show:
- Environment: `production`
- WordPress URL: `https://dev.moreyeahs.com`
- WordPress API URL: `https://dev.moreyeahs.com/wp-json`

### 2. Test API Endpoints
Visit: `https://moreyeahs.in/api/debug-case-studies`

This will test multiple WordPress API endpoints and show which ones are working. It should now be fetching from `https://dev.moreyeahs.com/wp-json/wp/v2/case_study`.

### 3. Test Case Studies
- Visit: `https://moreyeahs.in/case-study`
- Should show case studies fetched from `https://dev.moreyeahs.com/wp-json/wp/v2/case_study`

## Environment Variables

Make sure your production environment has these variables set:

```env
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_WORDPRESS_URL=https://dev.moreyeahs.com
NEXT_PUBLIC_SITE_URL=https://moreyeahs.in
```

## WordPress Server Requirements

The WordPress server at `https://dev.moreyeahs.com` needs to have the `case_study` custom post type registered and accessible via the REST API.

### Verify WordPress API Access

Test these URLs in your browser:
- `https://dev.moreyeahs.com/wp-json/wp/v2/case_study`
- `https://dev.moreyeahs.com/wp-json/wp/v2/posts`

Both should return JSON data (not 404 errors).

## Deployment Steps

1. Deploy the updated Next.js code to your production server
2. Ensure the WordPress server at `https://dev.moreyeahs.com` has the case study post type registered
3. Test the debug endpoints to verify everything is working
4. Check the case study pages

## Troubleshooting

If case studies still don't work:

1. Check the debug endpoints: `/debug-env` and `/api/debug-case-studies`
2. Test the WordPress REST API directly: `https://dev.moreyeahs.com/wp-json/wp/v2/case_study`
3. Check browser console for any JavaScript errors
4. Verify CORS headers are being sent from the WordPress server
5. Check server logs for any errors

The system now has fallback mechanisms, so even if the custom post type isn't working, it should fall back to regular posts with the case-study category.

## Summary

The key fix was correcting the WordPress API URL to always use `https://dev.moreyeahs.com` regardless of where the Next.js frontend is deployed. This ensures consistent API access whether the site is running on Vercel or `moreyeahs.in`.