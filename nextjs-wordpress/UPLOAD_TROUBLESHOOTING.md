# Upload Troubleshooting Guide

## Issue: Can't Upload Logo or Favicon

If the upload buttons aren't working, follow these steps to diagnose and fix the issue.

---

## Step 1: Check Browser Console

### Open Browser Console:
- **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
- **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)

### Look for Errors:
1. Go to the **Console** tab
2. Refresh the appearance settings page
3. Look for any red error messages
4. Take note of what they say

### Expected Console Messages:
```
Appearance settings page loaded
WordPress media library is available
All event handlers attached
```

### When You Click Upload Button:
```
Logo upload button clicked
Creating new logo uploader
```

---

## Step 2: Common Issues & Solutions

### Issue: "WordPress media library not loaded"

**Solution:**
1. Refresh the page (F5)
2. Clear browser cache (Ctrl+Shift+Delete)
3. Try in incognito/private window
4. Check if you're logged in as admin

---

### Issue: Nothing Happens When Clicking Button

**Possible Causes:**

#### A. JavaScript Not Loading
**Check:**
- Open browser console
- Look for JavaScript errors
- Verify jQuery is loaded

**Solution:**
```
1. Refresh the page
2. Disable other plugins temporarily
3. Try different browser
```

#### B. Button Not Found
**Check:**
- Verify you're on the right page
- URL should be: `.../wp-admin/themes.php?page=site-appearance-settings`

**Solution:**
```
1. Navigate to Appearance → Site Appearance
2. Or use direct URL
```

---

### Issue: Upload Window Opens But Can't Select Image

**Solution:**
1. **Upload New Image:**
   - Click "Upload files" tab
   - Drag & drop your image
   - Or click "Select Files" button
   - Wait for upload to complete
   - Click image thumbnail
   - Click "Use as Logo" or "Use as Site Icon"

2. **Select Existing Image:**
   - Click "Media Library" tab
   - Click on an existing image
   - Click "Use as Logo" or "Use as Site Icon"

---

### Issue: Image Uploads But Doesn't Show Preview

**Check Console For:**
```
Logo selected
Logo attachment: {id: 123, url: "...", ...}
Logo preview updated
```

**Solution:**
1. Click "Save Settings" button
2. Refresh the page
3. Image should appear

---

## Step 3: Alternative Upload Method

### Method 1: Upload to Media Library First

1. **Go to Media Library:**
   ```
   WordPress Admin → Media → Library
   ```

2. **Upload Your Images:**
   - Click "Add New"
   - Upload logo and favicon
   - Note the image IDs (in URL when viewing)

3. **Go Back to Appearance Page:**
   ```
   Appearance → Site Appearance
   ```

4. **Click Upload Buttons:**
   - Click "Upload Logo"
   - Click "Media Library" tab
   - Select your logo
   - Click "Use as Logo"

---

### Method 2: Use WordPress Settings

#### For Site Title & Description:
```
Settings → General
Update "Site Title" and "Tagline"
Click "Save Changes"
```

#### For Logo (if Customizer works):
```
Appearance → Customize → Site Identity
Upload logo there
```

---

## Step 4: Check PHP Errors

### Enable WordPress Debug Mode:

1. **Edit wp-config.php:**
   ```php
   define('WP_DEBUG', true);
   define('WP_DEBUG_LOG', true);
   define('WP_DEBUG_DISPLAY', false);
   ```

2. **Check Debug Log:**
   ```
   wp-content/debug.log
   ```

3. **Look for errors related to:**
   - Media upload
   - File permissions
   - Theme functions

---

## Step 5: Check File Permissions

### Verify Upload Directory:

**Location:**
```
wp-content/uploads/
```

**Required Permissions:**
- Folders: 755 or 775
- Files: 644 or 664

**Fix Permissions (if needed):**
```bash
# On server
chmod 755 wp-content/uploads
chmod 755 wp-content/uploads/*
```

---

## Step 6: Check Upload Limits

### Check PHP Upload Limits:

1. **Create test file:** `wp-content/uploads/phpinfo.php`
   ```php
   <?php phpinfo(); ?>
   ```

2. **Visit:** `http://localhost/moreyeahs-new/wp-content/uploads/phpinfo.php`

3. **Look for:**
   - `upload_max_filesize` (should be at least 2MB)
   - `post_max_size` (should be at least 8MB)
   - `max_execution_time` (should be at least 30)

4. **Delete the file after checking**

### Increase Limits (if needed):

**Edit php.ini:**
```ini
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 60
```

**Or add to .htaccess:**
```apache
php_value upload_max_filesize 10M
php_value post_max_size 10M
```

---

## Step 7: Test with Simple Image

### Try Uploading:
- Small file (under 100KB)
- Simple PNG or JPG
- No special characters in filename
- Square dimensions (e.g., 512×512)

### If This Works:
- Your original file might be too large
- Or has an unsupported format
- Or has a problematic filename

---

## Step 8: Disable Conflicting Plugins

### Temporarily Disable:
1. Go to **Plugins → Installed Plugins**
2. Deactivate all plugins except:
   - WPGraphQL
   - Yoast SEO (if using)
3. Try upload again
4. Re-enable plugins one by one to find conflict

---

## Step 9: Try Different Browser

### Test In:
- Chrome
- Firefox
- Edge
- Safari

### If Works in One Browser:
- Clear cache in problem browser
- Disable browser extensions
- Try incognito/private mode

---

## Step 10: Manual Database Method (Advanced)

### If Nothing Else Works:

1. **Upload images to Media Library**
2. **Note the attachment IDs**
3. **Run SQL queries:**

```sql
-- Set logo (replace 123 with your logo attachment ID)
UPDATE wp_options 
SET option_value = '123' 
WHERE option_name = 'theme_mods_twentytwentyfive';

-- Set favicon (replace 456 with your favicon attachment ID)
UPDATE wp_options 
SET option_value = '456' 
WHERE option_name = 'site_icon';
```

---

## Quick Diagnostic Checklist

Run through this checklist:

- [ ] Logged in as admin
- [ ] On correct page (Appearance → Site Appearance)
- [ ] Browser console shows no errors
- [ ] jQuery is loaded (check console)
- [ ] wp.media is available (check console)
- [ ] Upload directory exists and is writable
- [ ] PHP upload limits are sufficient
- [ ] No conflicting plugins
- [ ] Tried different browser
- [ ] Tried incognito/private mode
- [ ] Images are valid format (PNG/JPG)
- [ ] Images are reasonable size (under 2MB)

---

## Get Detailed Debug Info

### Add This to Console:

```javascript
// Check if jQuery is loaded
console.log('jQuery version:', jQuery.fn.jquery);

// Check if wp.media is available
console.log('wp.media available:', typeof wp !== 'undefined' && typeof wp.media !== 'undefined');

// Check if buttons exist
console.log('Logo button exists:', jQuery('.upload-logo-button').length);
console.log('Icon button exists:', jQuery('.upload-icon-button').length);

// Test button click
jQuery('.upload-logo-button').trigger('click');
```

---

## Still Not Working?

### Collect This Information:

1. **Browser & Version:**
   - Example: Chrome 120.0

2. **Console Errors:**
   - Copy any red error messages

3. **PHP Version:**
   - Check in phpinfo or WordPress dashboard

4. **WordPress Version:**
   - Check in Dashboard → Updates

5. **Active Plugins:**
   - List all active plugins

6. **Theme:**
   - Twenty Twenty-Five (custom)

### Then:

1. Check WordPress error log: `wp-content/debug.log`
2. Check server error log (Apache/Nginx)
3. Try the manual database method above
4. Or use Settings → General for title/description only

---

## Workaround: Use Media Library Directly

### If Upload Buttons Don't Work:

1. **Upload images:**
   ```
   Media → Library → Add New
   ```

2. **Get image URLs:**
   - Click on uploaded image
   - Copy "File URL"

3. **Use in Next.js directly:**
   - Update .env file:
   ```
   NEXT_PUBLIC_LOGO_URL=http://localhost/moreyeahs-new/wp-content/uploads/logo.png
   NEXT_PUBLIC_FAVICON_URL=http://localhost/moreyeahs-new/wp-content/uploads/favicon.png
   ```

4. **Update Header component to use env vars as fallback**

---

## Success Indicators

### When Upload Works:

✅ Console shows: "Logo selected"  
✅ Console shows: "Logo attachment: {...}"  
✅ Preview image appears on page  
✅ Hidden input field has value  
✅ "Remove" button appears  
✅ After saving, API returns logo data  

---

## Need More Help?

1. **Check browser console** - Most issues show errors there
2. **Try incognito mode** - Rules out cache/extension issues
3. **Try different browser** - Rules out browser-specific issues
4. **Check PHP error log** - Shows server-side issues
5. **Use Media Library method** - Always works as fallback

The most common issue is browser cache or JavaScript not loading. Try a hard refresh (Ctrl+Shift+R) first!
