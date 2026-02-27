# WordPress Plugin Installation Guide

## Problem
The `/microsoft-services` and `/salesforce-services` pages are not showing animations because they're rendering static HTML instead of React components with the block data.

## Solution
Install the custom WordPress plugin to create a REST API endpoint that returns block data.

## Installation Steps

### Option 1: Upload via WordPress Admin (Recommended)

1. **Prepare the plugin file:**
   - Locate the file `wordpress-plugin-blocks-api.php` in your Next.js project root
   - Create a folder named `nextjs-blocks-api`
   - Move `wordpress-plugin-blocks-api.php` into this folder
   - Zip the `nextjs-blocks-api` folder

2. **Upload to WordPress:**
   - Log in to your WordPress admin panel (https://dev.moreyeahs.com/wp-admin)
   - Go to **Plugins → Add New**
   - Click **Upload Plugin**
   - Choose the zip file you created
   - Click **Install Now**
   - Click **Activate Plugin**

### Option 2: Manual Installation via FTP/File Manager

1. **Access your WordPress installation:**
   - Connect via FTP or use your hosting file manager
   - Navigate to `/wp-content/plugins/`

2. **Create plugin folder:**
   - Create a new folder: `nextjs-blocks-api`
   - Upload `wordpress-plugin-blocks-api.php` into this folder

3. **Activate the plugin:**
   - Go to WordPress admin → **Plugins**
   - Find "Next.js Blocks API" in the list
   - Click **Activate**

### Option 3: Direct File Copy (If you have server access)

```bash
# Navigate to WordPress plugins directory
cd /path/to/wordpress/wp-content/plugins/

# Create plugin directory
mkdir nextjs-blocks-api

# Copy the plugin file
cp /path/to/nextjs-project/wordpress-plugin-blocks-api.php nextjs-blocks-api/

# Set proper permissions
chmod 644 nextjs-blocks-api/wordpress-plugin-blocks-api.php
```

Then activate via WordPress admin.

## Verification

After installation, test the endpoint:

```bash
# Test the custom endpoint
curl https://dev.moreyeahs.com/wp-json/wp/v2/pages-with-blocks/microsoft-services

# You should see JSON response with blocks array
```

Or run the test script:

```bash
node test-custom-endpoint.js
```

## What This Plugin Does

1. **Creates a custom REST API endpoint:** `/wp/v2/pages-with-blocks/{slug}`
2. **Returns page data with parsed blocks** including:
   - Block structure (blockName, attrs, innerHTML)
   - ACF field data for each block
   - Processed image URLs with full paths
   - Yoast SEO metadata

3. **Enables React components** to render with proper data and animations

## After Installation

Once the plugin is activated:

1. The Next.js pages will automatically fetch block data from the new endpoint
2. The `FullOneByTwoSection` React component will render with proper data
3. Animations will work correctly using IntersectionObserver
4. Images will load properly with Next.js Image optimization

## Troubleshooting

### Plugin doesn't appear in WordPress
- Check file permissions (should be 644)
- Ensure the file is in the correct directory structure
- Check WordPress error logs

### Endpoint returns 404
- Make sure the plugin is activated
- Try flushing WordPress permalinks: Settings → Permalinks → Save Changes

### No block data returned
- Verify ACF plugin is installed and active
- Check that the pages have ACF blocks (not just HTML content)
- Ensure blocks are saved properly in WordPress

### Images not loading
- Check that image URLs are absolute (not relative)
- Verify Next.js image domains are configured in `next.config.js`
- Ensure WordPress media files are accessible

## Need Help?

If you encounter issues:
1. Check WordPress debug logs
2. Test the endpoint directly in browser
3. Verify ACF plugin is active and configured
4. Check Next.js console for errors
