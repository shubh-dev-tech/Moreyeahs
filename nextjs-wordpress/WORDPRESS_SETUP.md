# WordPress Setup Guide

Complete guide to configure WordPress as a headless CMS for this Next.js application.

## Required WordPress Plugins

### 1. WPGraphQL (Required)

**Installation via WordPress Admin:**
1. Go to Plugins → Add New
2. Search for "WPGraphQL"
3. Click "Install Now" then "Activate"

**Installation via WP-CLI:**
```bash
wp plugin install wp-graphql --activate
```

**Manual Installation:**
1. Download from https://wordpress.org/plugins/wp-graphql/
2. Upload to `/wp-content/plugins/`
3. Activate in WordPress admin

### 2. Yoast SEO (Recommended)

**Installation via WordPress Admin:**
1. Go to Plugins → Add New
2. Search for "Yoast SEO"
3. Click "Install Now" then "Activate"

**Installation via WP-CLI:**
```bash
wp plugin install wordpress-seo --activate
```

### 3. WPGraphQL for Yoast SEO (Required if using Yoast)

**Installation:**
1. Download from https://github.com/ashhitch/wp-graphql-yoast-seo
2. Upload to `/wp-content/plugins/`
3. Activate via WordPress admin

**Or via Composer:**
```bash
composer require ashhitch/wp-graphql-yoast-seo
```

## WordPress Configuration

### Permalink Settings

1. Navigate to **Settings → Permalinks**
2. Select **"Post name"** structure
3. Click **"Save Changes"**

This ensures clean URLs like `/my-post-title/` instead of `/?p=123`

### WPGraphQL Settings

1. Navigate to **GraphQL → Settings**
2. **Enable Public Introspection** (for development)
3. Note your GraphQL endpoint: `https://your-site.com/graphql`
4. **Enable GraphiQL IDE** (for testing queries)

### General Settings

1. Navigate to **Settings → General**
2. Set **Site Title** (used in SEO)
3. Set **Tagline** (used as site description)
4. Set **Site Language**
5. Click **"Save Changes"**

### Yoast SEO Configuration

#### General Settings

1. Navigate to **SEO → General**
2. Complete the **Configuration Wizard** (recommended)
3. Set your site name and company info

#### Social Settings

1. Navigate to **SEO → Social**
2. **Facebook Tab:**
   - Add Facebook App ID (optional)
   - Set default image for posts without featured images
   - Enable Open Graph meta data
3. **Twitter Tab:**
   - Add Twitter username
   - Set default Twitter card type (Summary with Large Image recommended)

#### Search Appearance

1. Navigate to **SEO → Search Appearance**
2. **General Tab:**
   - Set site-wide title separator (e.g., `-` or `|`)
3. **Content Types Tab:**
   - Configure default templates for Posts
   - Enable/disable post types in search results
4. **Media Tab:**
   - Redirect attachment URLs to attachment file (recommended)

## CORS Configuration (If Needed)

If your Next.js app is on a different domain than WordPress, you may need to enable CORS.

### Method 1: wp-config.php

Add to your `wp-config.php` file (before "That's all, stop editing!"):

```php
// Enable CORS for headless setup
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

### Method 2: .htaccess

Add to your `.htaccess` file:

```apache
<IfModule mod_headers.c>
    Header set Access-Control-Allow-Origin "*"
    Header set Access-Control-Allow-Methods "GET, POST, OPTIONS"
    Header set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

### Method 3: Plugin

Install a CORS plugin like "WP CORS" from the WordPress plugin directory.

## Content Setup

### Creating Posts with Proper SEO

1. **Create a new post** (Posts → Add New)

2. **Add content:**
   - Title (required)
   - Content (required)
   - Excerpt (recommended - used in post listings)

3. **Add Featured Image:**
   - Click "Set featured image"
   - Upload image (recommended size: 1200x630px)
   - Add alt text for accessibility
   - Set as featured image

4. **Configure Yoast SEO** (scroll down to Yoast SEO meta box):
   - **SEO Title:** Custom title for search results
   - **Meta Description:** 155-160 character description
   - **Focus Keyphrase:** Main keyword for the post
   - **Social Tab:**
     - Facebook title and description (optional)
     - Facebook image (optional, uses featured image by default)
     - Twitter title and description (optional)
     - Twitter image (optional)

5. **Add Categories and Tags:**
   - Select or create categories
   - Add relevant tags

6. **Publish the post**

### Categories and Tags

1. **Categories** (Posts → Categories):
   - Create main topic categories
   - Add descriptions (used in category pages)
   - Set category images (if using a plugin)

2. **Tags** (Posts → Tags):
   - Create specific topic tags
   - Add descriptions

## Testing Your Setup

### Test GraphQL Endpoint

1. Navigate to `https://your-site.com/graphql` in your browser
2. You should see the GraphiQL IDE
3. Try this test query:

```graphql
query TestQuery {
  posts(first: 5) {
    nodes {
      id
      title
      slug
      excerpt
      featuredImage {
        node {
          sourceUrl
        }
      }
      seo {
        title
        metaDesc
      }
    }
  }
}
```

4. If you see data returned, your setup is working!

### Test SEO Fields

Run this query to verify Yoast SEO integration:

```graphql
query TestSEO {
  post(id: "your-post-slug", idType: SLUG) {
    title
    seo {
      title
      metaDesc
      canonical
      opengraphTitle
      opengraphDescription
      opengraphImage {
        sourceUrl
      }
      twitterTitle
      twitterDescription
      twitterImage {
        sourceUrl
      }
      schema {
        raw
      }
    }
  }
}
```

## Performance Optimization

### Caching

1. **Install a caching plugin:**
   - WP Rocket (premium)
   - W3 Total Cache (free)
   - WP Super Cache (free)

2. **Configure caching:**
   - Enable page caching
   - Enable object caching
   - Enable browser caching

### Image Optimization

1. **Install an image optimization plugin:**
   - Smush (free/premium)
   - ShortPixel (free/premium)
   - Imagify (free/premium)

2. **Configure:**
   - Enable automatic compression
   - Enable WebP conversion
   - Set maximum image dimensions

### Database Optimization

1. **Install WP-Optimize or similar**
2. **Regular maintenance:**
   - Clean post revisions
   - Remove spam comments
   - Optimize database tables

## Security Best Practices

### 1. Disable XML-RPC (if not needed)

Add to `wp-config.php`:
```php
add_filter('xmlrpc_enabled', '__return_false');
```

### 2. Limit Login Attempts

Install "Limit Login Attempts Reloaded" plugin

### 3. Use Strong Passwords

Ensure all user accounts have strong passwords

### 4. Keep WordPress Updated

- Update WordPress core regularly
- Update all plugins
- Update themes

### 5. Use SSL Certificate

Ensure your site uses HTTPS

### 6. Hide WordPress Version

Add to `functions.php`:
```php
remove_action('wp_head', 'wp_generator');
```

## Webhooks for Auto-Revalidation (Optional)

To automatically rebuild your Next.js site when content changes:

### 1. Install WP Webhooks Plugin

```bash
wp plugin install wp-webhooks --activate
```

### 2. Configure Webhook

1. Go to **Settings → WP Webhooks**
2. Add new webhook
3. **Trigger:** Post Published/Updated
4. **URL:** Your Next.js revalidation endpoint
5. **Method:** POST

### 3. Vercel Deploy Hook (Alternative)

1. Go to Vercel dashboard
2. Project Settings → Git
3. Create Deploy Hook
4. Copy webhook URL
5. Add to WP Webhooks plugin

## Troubleshooting

### GraphQL Endpoint Not Working

- Verify WPGraphQL plugin is activated
- Check permalink settings (must be "Post name")
- Try re-saving permalink settings
- Check for conflicting plugins

### SEO Fields Not Appearing

- Verify Yoast SEO is installed and activated
- Verify WPGraphQL for Yoast SEO is installed and activated
- Check plugin compatibility
- Try deactivating other SEO plugins

### Images Not Loading

- Check image URLs are publicly accessible
- Verify media files exist in `/wp-content/uploads/`
- Check file permissions (should be 644 for files, 755 for directories)
- Ensure WordPress URL is correct in Settings → General

### CORS Errors

- Implement one of the CORS solutions above
- Clear browser cache
- Check browser console for specific error messages

## Recommended Additional Plugins

### For Better Content Management

- **Advanced Custom Fields (ACF)** - Add custom fields
- **Custom Post Type UI** - Create custom post types
- **Duplicate Post** - Quickly duplicate posts

### For Performance

- **WP Rocket** - Comprehensive caching solution
- **Autoptimize** - Optimize CSS, JS, and HTML
- **Lazy Load** - Lazy load images and iframes

### For SEO

- **Redirection** - Manage 301 redirects
- **Broken Link Checker** - Find and fix broken links
- **Schema Pro** - Advanced schema markup

## Next Steps

1. Create sample posts with proper SEO configuration
2. Test GraphQL queries in GraphiQL
3. Configure your Next.js `.env` file with WordPress URL
4. Run `npm run dev` in your Next.js project
5. Verify posts are displaying correctly
6. Test SEO meta tags in browser dev tools
7. Deploy to production

## Support Resources

- [WPGraphQL Documentation](https://www.wpgraphql.com/docs/introduction)
- [Yoast SEO Documentation](https://yoast.com/help/)
- [WordPress Codex](https://codex.wordpress.org/)
- [WPGraphQL Slack Community](https://wpgraphql.com/community)
