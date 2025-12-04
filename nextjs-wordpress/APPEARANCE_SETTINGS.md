# Appearance Settings Guide

This guide explains how to manage your site's appearance including site title, logo, and favicon from the WordPress dashboard.

## Overview

Your Next.js site now dynamically pulls appearance settings from WordPress, including:
- **Site Title** - Displayed in the header and browser tab
- **Site Description** - Used for SEO meta descriptions
- **Logo** - Displayed in the header navigation
- **Favicon** - The icon shown in browser tabs and bookmarks

## How to Update Appearance Settings

### 1. Access WordPress Dashboard

Log in to your WordPress admin panel at:
```
http://your-domain.com/wp-admin
```

### 2. Navigate to Appearance Settings

There are two ways to access appearance settings:

#### Option A: Customizer (Recommended)
1. Go to **Appearance → Customize**
2. You'll see the WordPress Customizer interface

#### Option B: Settings Menu
1. Go to **Settings → General** for site title and description
2. Go to **Appearance → Customize** for logo and favicon

### 3. Update Site Title & Description

**In Customizer:**
1. Click on **Site Identity**
2. Update **Site Title**
3. Update **Tagline** (site description)
4. Click **Publish** to save changes

**In Settings:**
1. Go to **Settings → General**
2. Update **Site Title**
3. Update **Tagline**
4. Click **Save Changes**

### 4. Upload Logo

1. In the Customizer, click on **Site Identity**
2. Click **Select Logo** button
3. Upload your logo image or select from Media Library
4. Recommended logo specifications:
   - Format: PNG, JPG, or SVG
   - Max width: 400px
   - Max height: 100px
   - Transparent background recommended for PNG
5. Click **Select** and then **Publish**

### 5. Upload Favicon (Site Icon)

1. In the Customizer, click on **Site Identity**
2. Scroll down to **Site Icon**
3. Click **Select Site Icon** button
4. Upload your favicon or select from Media Library
5. Favicon specifications:
   - Format: PNG or ICO
   - Size: 512x512px (will be automatically resized)
   - Square image required
6. Click **Select** and then **Publish**

## How It Works

### WordPress Side

The theme's `functions.php` includes:
- Theme support for custom logo and site icon
- REST API endpoint at `/wp-json/wp/v2/site-settings`
- Returns site title, description, logo, and favicon data

### Next.js Side

The Next.js app automatically:
1. Fetches site settings from WordPress REST API
2. Updates the header logo dynamically
3. Updates the favicon in browser tabs
4. Updates SEO metadata with site title and description

### API Response Example

```json
{
  "title": "My Awesome Site",
  "description": "A great website built with WordPress and Next.js",
  "url": "https://example.com",
  "logo": {
    "url": "https://example.com/wp-content/uploads/2024/logo.png",
    "width": 400,
    "height": 100,
    "alt": "My Awesome Site Logo"
  },
  "favicon": {
    "url": "https://example.com/wp-content/uploads/2024/favicon.png",
    "width": 512,
    "height": 512,
    "sizes": {
      "32": "https://example.com/wp-content/uploads/2024/favicon-32x32.png",
      "180": "https://example.com/wp-content/uploads/2024/favicon-180x180.png",
      "192": "https://example.com/wp-content/uploads/2024/favicon-192x192.png",
      "512": "https://example.com/wp-content/uploads/2024/favicon-512x512.png"
    }
  }
}
```

## Live Updates

Changes made in WordPress will appear on your Next.js site:
- **Development**: Changes appear immediately (no cache)
- **Production**: Changes may take a few minutes due to caching

To force an immediate update in production:
1. Clear your CDN cache (if using one)
2. Restart your Next.js application
3. Or wait for the cache to expire naturally

## Troubleshooting

### Logo Not Showing
1. Verify the logo is uploaded in **Appearance → Customize → Site Identity**
2. Check that the image URL is accessible
3. Clear your browser cache
4. Check browser console for errors

### Favicon Not Updating
1. Browsers cache favicons aggressively
2. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Clear browser cache completely
4. Try in an incognito/private window

### API Not Working
1. Check that WordPress REST API is enabled
2. Verify the endpoint: `http://your-domain.com/wp-json/wp/v2/site-settings`
3. Check CORS settings if WordPress and Next.js are on different domains
4. Verify `WORDPRESS_REST_API_URL` in your `.env` file

## Best Practices

### Logo Design
- Use a transparent background (PNG)
- Keep it simple and readable
- Ensure it works on both light and dark backgrounds
- Test at different sizes

### Favicon Design
- Use a simple, recognizable icon
- Avoid too much detail (it will be tiny)
- Use high contrast colors
- Test on different browser tabs

### Site Title
- Keep it concise (under 60 characters)
- Include your brand name
- Avoid special characters that might break SEO

### Site Description
- Keep it under 160 characters for SEO
- Clearly describe what your site is about
- Include relevant keywords naturally

## Files Modified

### WordPress Theme
- `wp-content/themes/twentytwentyfive/functions.php`
  - Added theme support for custom logo and site icon
  - Added REST API endpoint for site settings

### Next.js App
- `src/lib/wordpress.ts` - Added `getSiteSettings()` function
- `src/components/Header.tsx` - Updated to use dynamic logo
- `src/app/layout.tsx` - Updated to use dynamic favicon
- `src/lib/seo.ts` - Updated to use dynamic site info
- `src/app/globals.css` - Added logo image styles

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify the REST API endpoint is working
3. Check your environment variables
4. Review the WordPress error logs
5. Test with a different browser

## Next Steps

- Customize your logo design
- Add a professional favicon
- Update your site title and description
- Test on different devices and browsers
- Consider adding a dark mode logo variant
