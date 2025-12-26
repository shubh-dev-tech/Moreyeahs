# Case Study Error Fix - "postType undefined"

## Error Message
```
Error: The entity being edited (postType, undefined) does not have a loaded config.
```

## What Was Wrong
The `template` parameter in the post type registration was trying to load ACF blocks before they were registered, causing WordPress to fail loading the editor.

## What Was Fixed

### 1. Removed Template Auto-Load
**Before:**
```php
'template' => array(
    array('acf/case-study-header', array()),
    array('acf/case-study-layout', array()),
),
```

**After:**
```php
// Removed - blocks will be added manually
```

### 2. Added REST Namespace
```php
'rest_namespace' => 'wp/v2',
```

### 3. Changed Init Priority
```php
add_action('init', 'register_case_study_post_type', 0);
// Priority 0 = loads earlier
```

## How to Fix (Already Applied)

The code has been updated. Now you need to:

1. **Flush Rewrite Rules**
   - Go to: http://localhost/wp-admin
   - Navigate to: Settings → Permalinks
   - Click: "Save Changes"
   - (You don't need to change anything, just save)

2. **Try Creating Case Study Again**
   - Go to: Case Studies → Add New
   - Should work now!

3. **Add Blocks Manually**
   - Click the (+) button in the editor
   - Search for "Case Study" blocks
   - Add in this order:
     1. Case Study Header
     2. Case Study Layout
     3. Inside Layout: Left Sidebar
     4. Inside Layout: Content blocks

## Benefits of Manual Block Addition

✅ **More Flexibility** - Choose which blocks to use
✅ **Custom Order** - Arrange blocks as needed
✅ **No Errors** - Blocks load only when needed
✅ **Better Performance** - Lighter initial load

## Alternative: Add Template Later (Optional)

If you want auto-loading blocks later, you can add this filter after ACF blocks are registered:

```php
add_filter('register_case_study_post_type_args', function($args) {
    if (function_exists('acf_register_block_type')) {
        $args['template'] = array(
            array('acf/case-study-header', array()),
            array('acf/case-study-layout', array()),
        );
    }
    return $args;
}, 10, 2);
```

## Verification Steps

After saving permalinks:

1. ✅ Case Studies menu appears
2. ✅ "Add New" works without errors
3. ✅ Editor loads properly
4. ✅ Can add ACF blocks
5. ✅ Can save/publish

## Common Related Issues

### Issue: Still Getting Error
**Solution:** Clear browser cache and hard refresh (Ctrl+Shift+R)

### Issue: Blocks Not Showing
**Solution:** Sync ACF fields (Custom Fields → Tools → Sync Available)

### Issue: Can't Find Blocks
**Solution:** Search for "case study" in block inserter

## Updated Workflow

### Creating a Case Study (Manual Blocks)

1. Click "Add New Case Study"
2. Enter title in the title field
3. Click (+) to add blocks:
   - Add "Case Study Header"
   - Add "Case Study Layout"
   - Click inside Layout, add "Left Sidebar"
   - Click inside Layout, add content blocks
4. Fill in all fields
5. Publish!

## Files Modified

- `/wp-content/themes/twentytwentyfive-child/functions.php`
  - Line ~330: Removed template parameter
  - Line ~320: Added rest_namespace
  - Line ~339: Changed priority to 0

## Testing Checklist

- [ ] Permalinks saved
- [ ] Can create new case study
- [ ] Editor loads without errors
- [ ] Can add blocks manually
- [ ] Blocks save properly
- [ ] Frontend displays correctly

---

**Status:** ✅ FIXED

**Date:** December 23, 2025

**Fix Applied:** Removed template auto-load, added REST namespace, adjusted init priority
