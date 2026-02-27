# Disabling Imagify Optimization

The Imagify optimization error you're seeing is coming from WordPress, not from your Next.js application.

## Option 1: Disable Imagify Plugin (Recommended)

1. Log into your WordPress admin panel
2. Go to **Plugins** → **Installed Plugins**
3. Find **Imagify** in the list
4. Click **Deactivate** or **Delete**

## Option 2: Disable Imagify for Specific Requests

If you want to keep Imagify but disable it for certain requests, add this to your WordPress theme's `functions.php`:

```php
// Disable Imagify for AJAX requests
add_filter('imagify_optimize_attachment', function($optimize, $attachment_id) {
    if (defined('DOING_AJAX') && DOING_AJAX) {
        return false;
    }
    return $optimize;
}, 10, 2);

// Or disable Imagify completely
add_filter('imagify_optimize_attachment', '__return_false');
```

## Option 3: Disable Imagify Auto-Optimization

1. Go to WordPress admin → **Settings** → **Imagify**
2. Uncheck **Auto-optimize images on upload**
3. Save changes

## Note

The error message you saw was:
```
POST /wp-admin/admin-ajax.php?action=imagify_optimize_media&nonce=cf4d64cdc
```

This is a WordPress admin AJAX call that happens when Imagify tries to optimize images. Since you don't need this optimization, disabling the plugin is the cleanest solution.
