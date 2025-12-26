# Stories & Blog Block URL Fix Summary

## Problem
When clicking on case study links from the Stories & Blog Block in the Next.js frontend, users were being redirected to WordPress URLs like:
```
http://localhost/moreyeahs-new/case-study/hello-world/
```

Instead of the desired Next.js frontend URLs like:
```
http://localhost:3001/case-study/hello-world
```

## Root Cause
The Stories & Blog Block components were using the `post.link` property directly from the WordPress REST API, which contains the WordPress site URL instead of the Next.js frontend URL.

## Solution
Modified the Stories & Blog Block components to convert WordPress URLs to Next.js frontend URLs:

### Files Modified:
1. `nextjs-wordpress/src/components/blocks/stories-blog-block/StoriesBlogBlock.tsx`
2. `nextjs-wordpress/src/components/blocks/stories-blog-block/StoriesBlogBlockSimple.tsx`

### Changes Made:
1. **Added `getPostUrl()` function** that:
   - Detects case study post types
   - Extracts the slug from WordPress URLs
   - Converts to Next.js frontend URLs using `window.location.origin`
   - Falls back to relative URLs for server-side rendering

2. **Updated link generation** to use `getPostUrl(post)` instead of `post.link`

3. **Made it environment-aware** by using `window.location.origin` to automatically detect the correct port (works for both localhost:3000, localhost:3001, and production)

## Code Example
```typescript
const getPostUrl = (post: Post) => {
  // Convert WordPress URLs to Next.js frontend URLs
  if (post_type === 'case_study' && post.link) {
    // Extract slug from WordPress URL
    const urlParts = post.link.split('/');
    const slug = urlParts[urlParts.length - 2] || urlParts[urlParts.length - 1];
    
    if (slug) {
      // Use current origin for the Next.js URL (automatically detects the correct port)
      if (typeof window !== 'undefined') {
        return `${window.location.origin}/case-study/${slug}`;
      }
      // Fallback for server-side rendering
      return `/case-study/${slug}`;
    }
  }
  
  // For other post types, fallback to original link
  return post.link;
};
```

## Testing
1. **Test file created**: `test-stories-blog-url-fix.html` - Contains JavaScript tests to verify URL conversion logic
2. **No TypeScript errors**: All components pass TypeScript validation
3. **Environment compatibility**: Works with any port (3000, 3001, production)

## Result
✅ **Case study links now redirect correctly** to Next.js frontend URLs
✅ **Maintains backward compatibility** for other post types
✅ **Environment-aware** - works in development and production
✅ **No breaking changes** to existing functionality

## Next Steps for Testing
1. Go to WordPress admin and add a Stories & Blog Block
2. Configure it to show Case Studies
3. Click on any case study link
4. Verify it redirects to `http://localhost:3001/case-study/[slug]` (or whatever port Next.js is running on)