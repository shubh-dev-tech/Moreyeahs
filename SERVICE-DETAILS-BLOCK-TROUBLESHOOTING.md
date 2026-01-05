# Service Details Section Block - Troubleshooting Guide

## Issue: Block Not Showing in WordPress Editor

If the Service Details Section block is not appearing in the WordPress block editor, follow these troubleshooting steps:

## Step 1: Verify Files Are in Place

Check that all required files exist:

```bash
# WordPress Backend Files
wp-content/themes/twentytwentyfive-child/blocks/service-details-section/block.php
wp-content/themes/twentytwentyfive-child/blocks/service-details-section/style.css
wp-content/themes/twentytwentyfive-child/acf-json/group_service_details_section.json

# Next.js Frontend Files
nextjs-wordpress/src/components/blocks/service-details-section/ServiceDetailsSection.tsx
nextjs-wordpress/src/components/blocks/service-details-section/styles.scss
nextjs-wordpress/src/components/blocks/service-details-section/acf.json
```

## Step 2: Check ACF Plugin

1. **Verify ACF Pro is installed and active**
   - Go to WordPress Admin > Plugins
   - Ensure "Advanced Custom Fields PRO" is active
   - Version should be 6.0+ for block support

2. **Check ACF Field Groups**
   - Go to WordPress Admin > Custom Fields > Field Groups
   - Look for "Service Details Section" field group
   - Ensure it's active (not disabled)

## Step 3: Sync ACF Fields

Run the sync script to force ACF field registration:

```bash
# If you have PHP CLI access:
php force-sync-acf-service-details.php

# Or access via browser:
http://your-site.com/force-sync-acf-service-details.php
```

## Step 4: Check Functions.php

Verify the block is registered in `wp-content/themes/twentytwentyfive-child/functions.php`:

```php
// Look for this section in the twentytwentyfive_child_register_acf_blocks() function:
acf_register_block_type(array(
    'name'              => 'service-details-section',
    'title'             => __('Service Details Section', 'twentytwentyfive'),
    // ... rest of configuration
));
```

## Step 5: Check for PHP Errors

1. **Enable WordPress Debug Mode**
   ```php
   // Add to wp-config.php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   define('WP_DEBUG_DISPLAY', false);
   ```

2. **Check Error Logs**
   - Look in `/wp-content/debug.log`
   - Check server error logs
   - Look for PHP fatal errors or warnings

3. **Test Functions.php Syntax**
   ```bash
   php debug-functions-php.php
   ```

## Step 6: Clear Caches

1. **WordPress Cache**
   - If using caching plugins, clear all caches
   - Go to WordPress Admin > Settings > Permalinks and click "Save Changes"

2. **Browser Cache**
   - Hard refresh the WordPress editor (Ctrl+F5 or Cmd+Shift+R)
   - Try in incognito/private browsing mode

3. **ACF Cache**
   - Go to WordPress Admin > Custom Fields > Tools
   - Click "Sync Available" if any field groups are listed

## Step 7: Manual ACF Field Group Import

If automatic sync doesn't work:

1. Go to WordPress Admin > Custom Fields > Tools
2. Click "Import Field Groups"
3. Copy the contents of `group_service_details_section.json`
4. Paste into the import field and click "Import"

## Step 8: Check Theme Compatibility

1. **Verify Child Theme is Active**
   - Go to WordPress Admin > Appearance > Themes
   - Ensure "Twenty Twenty-Five Child" is active

2. **Test with Default Theme**
   - Temporarily switch to a default WordPress theme
   - Check if the block appears
   - If it does, there's a theme conflict

## Step 9: Plugin Conflicts

1. **Deactivate Other Plugins**
   - Temporarily deactivate all plugins except ACF
   - Check if the block appears
   - Reactivate plugins one by one to identify conflicts

## Step 10: Manual Block Registration Test

Create a simple test file to verify block registration:

```php
<?php
// test-block-registration.php
require_once 'wp-config.php';
require_once ABSPATH . 'wp-admin/includes/admin.php';

if (function_exists('acf_get_block_types')) {
    $blocks = acf_get_block_types();
    foreach ($blocks as $name => $config) {
        if (strpos($name, 'service-details') !== false) {
            echo "Found: $name - {$config['title']}\n";
        }
    }
} else {
    echo "ACF block functions not available\n";
}
?>
```

## Common Issues and Solutions

### Issue: "Block not found" error
**Solution:** The block name in the location rule doesn't match the registered block name.
- Check that location rule uses `acf/service-details-section`
- Verify block registration uses `service-details-section`

### Issue: Fields not showing in block editor
**Solution:** ACF field group is not properly linked to the block.
- Check location rules in the field group
- Ensure field group is active
- Re-sync ACF fields

### Issue: Block appears but no fields
**Solution:** Field group location rules are incorrect.
- Location should be: Block > is equal to > acf/service-details-section

### Issue: CSS not loading
**Solution:** Check file paths and permissions.
- Verify CSS file exists at the specified path
- Check file permissions (should be readable)
- Clear browser cache

### Issue: Block works in WordPress but not Next.js
**Solution:** Check Next.js integration.
- Verify component is imported in BlockRenderer.tsx
- Check block name mapping in BLOCK_COMPONENTS
- Ensure TypeScript interfaces match data structure

## Debug Commands

```bash
# Check if files exist
ls -la wp-content/themes/twentytwentyfive-child/blocks/service-details-section/
ls -la wp-content/themes/twentytwentyfive-child/acf-json/group_service_details_section.json

# Validate JSON syntax
php validate-acf-json.php

# Test functions.php syntax
php debug-functions-php.php

# Test block registration
php test-service-details-block.php

# Force sync ACF fields
php force-sync-acf-service-details.php
```

## Still Not Working?

If none of the above steps work:

1. **Check WordPress Version Compatibility**
   - Ensure WordPress 5.8+ (for block editor support)
   - Ensure ACF Pro 6.0+ (for ACF blocks)

2. **Server Requirements**
   - PHP 7.4+ recommended
   - Sufficient memory limit (256MB+)
   - No PHP errors in error logs

3. **Contact Support**
   - Provide WordPress version
   - Provide ACF version
   - Provide PHP error logs
   - Provide steps already attempted

## Success Indicators

When everything is working correctly, you should see:

1. ✅ "Service Details Section" in WordPress Admin > Custom Fields > Field Groups
2. ✅ Block appears in WordPress editor under "Formatting" category
3. ✅ Block has all expected fields (background color, heading, services repeater, etc.)
4. ✅ Block renders correctly on frontend
5. ✅ Next.js component renders the block data properly

## Next Steps After Resolution

Once the block is working:

1. Test the block with sample data
2. Verify responsive behavior on mobile devices
3. Test with different background colors and images
4. Ensure all field types work correctly (color picker, image upload, repeater)
5. Test the Next.js frontend rendering