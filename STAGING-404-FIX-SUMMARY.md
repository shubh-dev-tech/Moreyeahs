# Staging 404 Fix Summary

## Problem
Your site works fine on localhost but shows 404 "Page Not Found" errors on staging, particularly for case studies and success stories pages. Additionally, CORS errors are preventing your NextJS frontend from accessing the WordPress REST API.

## Root Causes Identified

### 1. Fatal PHP Error (Critical)
**Location:** `wp-content/themes/twentytwentyfive-child/functions.php` line 800
**Issue:** The `wp_update_nav_menu` hook callback only accepts 1 parameter but WordPress passes 2
**Error:** `Too few arguments to function {closure}(), 1 passed... and exactly 2 expected`

### 2. CORS Policy Blocking API Access (Critical)
**Issue:** Missing CORS headers preventing NextJS frontend from accessing WordPress REST API
**Error:** `Access to fetch at 'https://moreyeahs-case-vercel.app/wp-json/wp/v2/case_study' from origin 'https://moreyeahs-case-vercel.app' has been blocked by CORS policy`

### 3. Permalink/Rewrite Rules Not Flushed
**Issue:** Custom post type rewrite rules weren't properly flushed on staging
**Result:** WordPress doesn't know how to handle `/case-study/` URLs

### 4. Environment Differences
**Issue:** Localhost vs staging server configuration differences

## Fixes Applied

### ✅ Fixed Fatal Error
**Before:**
```php
add_action('wp_update_nav_menu', function($menu_id) {
    // ... code
}, 10, 1);
```

**After:**
```php
add_action('wp_update_nav_menu', function($menu_id, $menu_data = null) {
    // ... code
}, 10, 2);
```

### ✅ Added CORS Headers
**Added to functions.php:**
```php
function enable_cors_for_rest_api() {
    $origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';
    
    $allowed_origins = array(
        'http://localhost:3000',
        'https://localhost:3000',
        'https://moreyeahs-case-vercel.app',
        // Add your frontend URLs here
    );
    
    if (in_array($origin, $allowed_origins)) {
        header('Access-Control-Allow-Origin: ' . $origin);
    } else {
        header('Access-Control-Allow-Origin: *'); // For development
    }
    
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-WP-Nonce, Accept');
    header('Access-Control-Allow-Credentials: true');
    
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        status_header(200);
        exit();
    }
}
```

### ✅ Created Fix and Test Scripts
1. **`staging-fix.php`** - Comprehensive diagnostic and fix script
2. **`flush-permalinks-staging.php`** - Simple permalink flush script
3. **`test-cors-fix.php`** - CORS configuration test script

## How to Fix on Staging

### Method 1: Run the Fix Scripts
1. Upload all fix scripts to your staging root directory
2. Visit `https://your-staging-site.com/staging-fix.php` for diagnostics
3. Visit `https://your-staging-site.com/test-cors-fix.php` to test CORS

### Method 2: Manual Fix
1. **Fix the fatal error** (already done in functions.php)
2. **Add CORS headers** (already done in functions.php)
3. **Flush permalinks:**
   - Go to WordPress Admin > Settings > Permalinks
   - Click "Save Changes" (don't change anything, just save)

### Method 3: WordPress Admin Only
1. Go to Settings > Permalinks
2. Click "Save Changes"
3. Test your case study URLs and API endpoints

## URLs to Test After Fix

### WordPress URLs
- Case Studies Archive: `https://your-staging-site.com/case-study/`
- Individual Case Study: `https://your-staging-site.com/case-study/[slug]/`

### REST API Endpoints
- Case Studies API: `https://your-staging-site.com/wp-json/wp/v2/case_study`
- Posts API: `https://your-staging-site.com/wp-json/wp/v2/posts`

### NextJS Frontend
- Your NextJS app should now be able to fetch data from WordPress without CORS errors

## NextJS Configuration

### Update your .env.local file:
```env
NEXT_PUBLIC_WORDPRESS_API_URL=https://your-staging-site.com/wp-json/wp/v2
WORDPRESS_API_URL=https://your-staging-site.com/wp-json/wp/v2
```

### Example fetch code:
```javascript
const fetchCaseStudies = async () => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/case_study`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const caseStudies = await response.json();
    return caseStudies;
  } catch (error) {
    console.error('Error fetching case studies:', error);
    throw error;
  }
};
```

## Additional Checks

### Verify .htaccess File
Ensure your `.htaccess` file contains WordPress rewrite rules:
```apache
# BEGIN WordPress
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>
# END WordPress
```

### Server Requirements
- mod_rewrite enabled
- PHP 7.4+ (recommended 8.0+)
- Proper file permissions (folders: 755, files: 644)

## Prevention for Future Deployments

1. **Always flush permalinks** after deploying to staging/production
2. **Test custom post type URLs** before going live
3. **Check error logs** for PHP fatal errors
4. **Use staging-specific configuration** when needed

## Files Modified
- ✅ `wp-content/themes/twentytwentyfive-child/functions.php` (fixed hook parameters)
- ➕ `staging-fix.php` (diagnostic script)
- ➕ `flush-permalinks-staging.php` (simple fix script)
- ➕ `STAGING-404-FIX-SUMMARY.md` (this documentation)

## Next Steps
1. Run one of the fix methods above
2. Test all case study URLs
3. Check that "No posts found for the selected criteria" message is resolved
4. Verify the NextJS frontend can fetch case studies via REST API

The main issue was the fatal PHP error preventing proper WordPress initialization, which caused the 404 errors. With the hook fixed and permalinks flushed, your staging site should work correctly.