# Specializations Section Block - Troubleshooting Guide

## Issue: Dynamic content not showing, only fallback content appears

### Step 1: Check ACF Field Group Sync
1. Go to WordPress Admin → Custom Fields → Field Groups
2. Look for "Specializations Section" field group
3. If you see a "Sync available" notice, click "Sync" to import the fields
4. If the field group doesn't exist, the ACF JSON file may not have been loaded properly

### Step 2: Verify Block Registration
1. Go to WordPress Admin → Pages → Add New (or edit existing page)
2. Click the "+" button to add a block
3. Search for "Specializations Section"
4. If the block doesn't appear, check the functions.php file for registration errors

### Step 3: Add Content to the Block
1. Add the "Specializations Section" block to a page
2. Fill in the required fields:
   - **Left Side Items**: Add at least one item with heading
   - **Right Side Heading**: Add main heading text
   - **Right Side Paragraphs**: Add at least one paragraph
3. Set background options (color, gradient, or image)
4. Save/Update the page

### Step 4: Check WordPress Debug Logs
1. Enable WordPress debugging in wp-config.php:
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   ```
2. Check the debug log at `/wp-content/debug.log` for any ACF-related errors
3. Look for "Specializations Section" entries in the log

### Step 5: Test REST API Endpoint
1. Visit: `your-site.com/wp-json/wp/v2/debug-acf/[PAGE_ID]`
2. Replace `[PAGE_ID]` with the ID of the page containing the block
3. Check if the ACF fields are being returned properly
4. Look for `left_items`, `right_heading`, and `right_paragraphs` in the response

### Step 6: Check NextJS Console
1. Open browser developer tools on the NextJS frontend
2. Look for console logs starting with "SpecializationsSection"
3. Check what data is being received by the component
4. If data is null/undefined, the issue is with the WordPress REST API

### Step 7: Verify Field Names
Ensure the ACF field names match exactly:
- `left_items` (repeater)
  - `image` (image field)
  - `heading` (text field)
  - `heading_color` (color picker)
  - `subheading` (textarea)
  - `subheading_color` (color picker)
- `right_heading` (text field)
- `right_heading_color` (color picker)
- `right_span_text` (text field)
- `right_span_color` (color picker)
- `right_paragraphs` (repeater)
  - `text` (textarea)
  - `color` (color picker)

### Step 8: Clear Caches
1. Clear any WordPress caching plugins
2. Clear NextJS build cache: `npm run build` in the nextjs-wordpress directory
3. Clear browser cache and hard refresh

### Common Issues and Solutions

#### Issue: Block appears but fields are empty
**Solution**: The ACF fields may not be synced. Go to Custom Fields → Field Groups and sync the "Specializations Section" group.

#### Issue: Images not displaying
**Solution**: Check that images are uploaded and the `process_acf_image_field` function is working properly in the REST API.

#### Issue: Colors not applying
**Solution**: Verify that color picker fields are returning valid hex color codes.

#### Issue: Block not appearing in editor
**Solution**: Check that the block is properly registered in functions.php and there are no PHP errors.

### Debug Information

If you're still having issues, check these debug endpoints:
- REST API: `/wp-json/wp/v2/debug-acf/[PAGE_ID]`
- Page data: `/wp-json/wp/v2/pages-with-blocks/[PAGE_SLUG]`

### Contact Support

If the issue persists after following these steps, provide:
1. WordPress debug log entries
2. Browser console output
3. REST API response from debug endpoint
4. Screenshots of the WordPress admin fields