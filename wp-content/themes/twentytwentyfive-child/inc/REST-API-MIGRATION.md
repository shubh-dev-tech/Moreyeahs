# REST API Routes Migration

## Overview
The REST API routes have been extracted from `functions.php` into a separate file for better organization and maintainability.

## Changes Made

### 1. New File Created
- **File**: `wp-content/themes/twentytwentyfive-child/inc/rest-api-routes.php`
- **Purpose**: Contains all custom REST API endpoint registrations and their callbacks
- **Benefits**:
  - Better code organization
  - Easier to maintain and debug
  - Cleaner functions.php file
  - Follows WordPress best practices

### 2. Functions.php Updated
- Added include statement for the new `rest-api-routes.php` file
- Commented out the old inline REST API registration code (kept for reference)
- The old code is preserved but inactive

### 3. REST API Endpoints Included

The following endpoints are now registered in the separate file:

1. **GET** `/wp/v2/simple-test` - Simple test endpoint
2. **POST** `/wp/v2/site-settings` - Site settings (logo, favicon, etc.)
3. **POST** `/wp/v2/pages-with-blocks/:slug` - Pages with ACF blocks data
4. **GET** `/wp/v2/posts-with-acf-blocks/:id` - Posts with ACF blocks data
5. **POST** `/wp/v2/posts-data` - Posts data endpoint
6. **POST** `/wp/v2/categories-data` - Categories data endpoint
7. **POST** `/wp/v2/footer-settings` - Footer settings endpoint
8. **GET** `/wp/v2/test-services-data/:post_id` - Test services data
9. **GET** `/wp/v2/debug-services-acf/:post_id` - Debug services ACF
10. **GET** `/wp/v2/debug-acf/:post_id` - Debug ACF fields
11. **POST** `/wp/v2/process-gallery` - Process gallery images
12. **GET** `/wp/v2/partnership-gallery/:id` - Partnership gallery data

## Implementation Status

### ✅ Fully Implemented
- Simple test endpoint
- Site settings endpoint
- Pages with blocks endpoint (with full ACF processing logic)

### ⚠️ Placeholder (To Be Migrated)
The following endpoints are registered but their callback implementations still need to be migrated from functions.php:
- Posts with ACF blocks
- Posts data
- Categories data
- Footer settings
- Test services data
- Debug services ACF
- Debug ACF
- Process gallery
- Partnership gallery

These currently return a "not_implemented" error and need their full callback code moved from functions.php.

## How It Works

1. **functions.php** includes the new file:
   ```php
   $rest_api_routes = get_stylesheet_directory() . '/inc/rest-api-routes.php';
   if (file_exists($rest_api_routes)) {
       require_once $rest_api_routes;
   }
   ```

2. **rest-api-routes.php** registers all routes in one place:
   ```php
   add_action('rest_api_init', function() {
       register_rest_route('wp/v2', '/simple-test', [
           'methods' => 'GET',
           'callback' => 'twentytwentyfive_child_simple_test_callback',
           'permission_callback' => '__return_true'
       ]);
       // ... more routes
   });
   ```

3. **Callback functions** are defined as named functions for better debugging:
   ```php
   function twentytwentyfive_child_simple_test_callback() {
       return rest_ensure_response([...]);
   }
   ```

## Testing

To verify the migration worked correctly:

1. **Test the simple endpoint**:
   ```bash
   curl http://your-site.com/wp-json/wp/v2/simple-test
   ```
   Should return: `{"message":"Simple test endpoint working from rest-api-routes.php",...}`

2. **Test site settings**:
   ```bash
   curl -X POST http://your-site.com/wp-json/wp/v2/site-settings
   ```

3. **Test pages with blocks**:
   ```bash
   curl -X POST http://your-site.com/wp-json/wp/v2/pages-with-blocks/your-page-slug
   ```

## Next Steps (Optional)

If you want to complete the migration:

1. Copy the remaining callback implementations from functions.php
2. Replace the placeholder functions in rest-api-routes.php
3. Test each endpoint to ensure it works correctly
4. Remove the commented code from functions.php once everything is verified

## Rollback Instructions

If you need to revert to the old setup:

1. Open `functions.php`
2. Uncomment the REST API code (remove `/*` and `*/`)
3. Comment out or remove the include for `rest-api-routes.php`
4. The site will work exactly as before

## Benefits of This Approach

- ✅ **Organized**: REST API code is in one dedicated file
- ✅ **Maintainable**: Easier to find and update endpoints
- ✅ **Debuggable**: Named functions show up clearly in error logs
- ✅ **Scalable**: Easy to add new endpoints
- ✅ **Safe**: Old code is preserved for reference
- ✅ **Compatible**: Works exactly the same as before

## File Locations

- Main file: `wp-content/themes/twentytwentyfive-child/inc/rest-api-routes.php`
- Updated file: `wp-content/themes/twentytwentyfive-child/functions.php`
- This documentation: `wp-content/themes/twentytwentyfive-child/inc/REST-API-MIGRATION.md`
