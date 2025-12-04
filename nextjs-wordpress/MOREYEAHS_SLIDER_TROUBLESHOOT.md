# Moreyeahs Slider - Troubleshooting

## Block Not Appearing in WordPress Editor

### Step 1: Check Browser Console

1. Open WordPress editor (edit any page/post)
2. Press **F12** to open Developer Tools
3. Go to **Console** tab
4. Look for these messages:
   - ✅ `Moreyeahs Slider Block: Script loaded`
   - ✅ `Moreyeahs Slider Block: Registering block...`
   - ✅ `Moreyeahs Slider Block: Successfully registered!`

### Step 2: If No Console Messages

The JavaScript file isn't loading. Check:

1. **File exists:**
   ```
   wp-content/themes/twentytwentyfive/blocks/moreyeahs-slider-block.js
   ```

2. **Clear WordPress cache:**
   - Go to WordPress Admin
   - If using a caching plugin, clear cache
   - Hard refresh browser: **Ctrl + Shift + R** (Windows) or **Cmd + Shift + R** (Mac)

3. **Check file permissions:**
   ```bash
   # File should be readable
   ls -la wp-content/themes/twentytwentyfive/blocks/
   ```

### Step 3: If Console Shows Errors

**Error: "wp.blocks not available"**
- The WordPress block editor scripts aren't loaded
- Make sure you're in the block editor (not classic editor)
- Try switching to a default WordPress theme temporarily

**Error: "Cannot read property 'registerBlockType'"**
- Dependencies not loaded correctly
- Check `functions.php` has correct dependencies

### Step 4: Verify Block Registration in PHP

1. Open `wp-content/themes/twentytwentyfive/functions.php`
2. Search for `twentytwentyfive_register_moreyeahs_slider`
3. Verify it's there and not commented out

### Step 5: Check Block Category

The block is in the **"Media"** category. Try:

1. Click **+** to add block
2. Click **"Media"** category (not "Design" or "Text")
3. Look for **"Moreyeahs Slider"**

Or search directly:
1. Click **+** to add block
2. Type **"moreyeahs"** or **"slider"** in search box

### Step 6: Verify Theme is Active

```
WordPress Admin → Appearance → Themes
```

Make sure **"Twenty Twenty-Five"** is the active theme.

### Step 7: Check WordPress Version

The block requires:
- WordPress 5.8 or higher
- Gutenberg block editor enabled

Check version:
```
WordPress Admin → Dashboard → Updates
```

### Step 8: Test with Default Theme

Temporarily switch to a default WordPress theme:

1. Go to **Appearance → Themes**
2. Activate **Twenty Twenty-Four** or **Twenty Twenty-Three**
3. Copy the files to that theme
4. Test if block appears

### Step 9: Check for JavaScript Conflicts

Disable other plugins temporarily:

1. Go to **Plugins**
2. Deactivate all plugins except essential ones
3. Test if block appears
4. Reactivate plugins one by one to find conflict

### Step 10: Manual Verification

Check if the script is enqueued:

1. Edit a page in WordPress
2. View page source (Ctrl+U)
3. Search for: `moreyeahs-slider-block.js`
4. Should see: `<script src=".../blocks/moreyeahs-slider-block.js?ver=..."></script>`

## Quick Fixes

### Fix 1: Force Refresh

```bash
# In WordPress admin
1. Go to Settings → Permalinks
2. Click "Save Changes" (don't change anything)
3. Clear browser cache
4. Hard refresh (Ctrl + Shift + R)
```

### Fix 2: Re-copy JavaScript File

```bash
copy nextjs-wordpress\wordpress-theme-files\blocks\moreyeahs-slider-block.js wp-content\themes\twentytwentyfive\blocks\
```

### Fix 3: Check File Encoding

The JavaScript file should be UTF-8 encoded without BOM.

### Fix 4: Verify functions.php Syntax

Check for PHP errors:

```
WordPress Admin → Tools → Site Health → Info → Server
```

Look for PHP errors related to functions.php

## Alternative: Use Plugin Instead of Theme

If theme integration isn't working, create a simple plugin:

1. Create folder: `wp-content/plugins/moreyeahs-slider/`
2. Create file: `wp-content/plugins/moreyeahs-slider/moreyeahs-slider.php`

```php
<?php
/**
 * Plugin Name: Moreyeahs Slider
 * Description: Custom slider block
 * Version: 1.0
 */

// Include the block registration from functions.php
// Copy the entire block registration code here
```

3. Activate plugin in WordPress Admin → Plugins

## Still Not Working?

### Check These Common Issues:

1. **Wrong theme active** - Must be Twenty Twenty-Five
2. **Classic editor active** - Must use block editor
3. **JavaScript disabled** - Check browser settings
4. **File permissions** - Files must be readable
5. **PHP errors** - Check error logs
6. **WordPress version** - Must be 5.8+

### Get More Info:

Add this to `functions.php` temporarily:

```php
add_action('admin_notices', function() {
    $file = get_template_directory() . '/blocks/moreyeahs-slider-block.js';
    echo '<div class="notice notice-info"><p>';
    echo 'Moreyeahs Slider JS: ' . (file_exists($file) ? 'EXISTS' : 'NOT FOUND');
    echo ' at ' . $file;
    echo '</p></div>';
});
```

This will show if WordPress can find the file.

## Success Checklist

- [ ] Console shows "Script loaded" message
- [ ] Console shows "Successfully registered" message
- [ ] No JavaScript errors in console
- [ ] Block appears in Media category
- [ ] Block appears in search results
- [ ] Can add block to page
- [ ] Block settings appear in sidebar

## Contact Points

If still having issues, check:

1. **Browser Console** - Any JavaScript errors?
2. **WordPress Debug Log** - Any PHP errors?
3. **Network Tab** - Is the JS file loading (200 status)?
4. **Theme** - Is Twenty Twenty-Five active?

---

**Most Common Solution:** Clear cache + hard refresh (Ctrl+Shift+R)
