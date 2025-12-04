# Icon Text Grid Block - Setup Guide

## ✅ Completed Steps

1. ✅ Block registered in `functions.php`
2. ✅ SCSS compiled to CSS
3. ✅ All files created in separate folder structure

## 📋 Import ACF Field Group (Required)

### Method 1: WordPress Admin (Recommended)

1. **Login to WordPress Admin**
   - Go to your WordPress admin dashboard

2. **Navigate to ACF**
   - Click on **Custom Fields** in the left sidebar
   - Click on **Tools** at the top

3. **Import Field Group**
   - Click on the **Import** tab
   - Copy the entire contents of this file:
     ```
     nextjs-wordpress/wordpress-theme-files/ACF_FIELD_GROUP_icon_text_grid.json
     ```
   - Paste it into the import text area
   - Click **Import JSON**

4. **Verify Import**
   - Go back to **Custom Fields** → **Field Groups**
   - You should see "Icon Text Grid" in the list
   - Click to edit and verify the fields:
     - items (Repeater)
       - text (Text)
       - icon (Image)
       - link (URL)

### Method 2: Programmatic Import (Alternative)

Add this code temporarily to `functions.php`:

```php
// One-time ACF field group import
add_action('acf/init', function() {
    if (function_exists('acf_import_field_group')) {
        $json_file = get_template_directory() . '/blocks/icon-text-grid/ACF_FIELD_GROUP_icon_text_grid.json';
        
        if (file_exists($json_file)) {
            $json = file_get_contents($json_file);
            $field_group = json_decode($json, true);
            
            if ($field_group) {
                acf_import_field_group($field_group);
                // Remove this code after first run
            }
        }
    }
});
```

**Note:** Remove this code after the field group is imported!

## 🎨 Usage

### In WordPress Editor

1. Edit any page or post
2. Click the **+** button to add a block
3. Search for "Icon Text Grid"
4. Add the block
5. Click "Add Item" to add grid sections
6. For each item:
   - Enter text (e.g., "Service offerings")
   - Upload icon (recommended 60x60px PNG)
   - Enter link URL
7. Add 2-12 items as needed
8. Publish!

### In Next.js

The block data will be available via GraphQL/REST API. Use the React component:

```tsx
import IconTextGrid from '@/components/blocks/IconTextGrid/IconTextGrid';

// Data from WordPress API
<IconTextGrid items={block.items} />
```

## 🎯 Features

- ✅ Flexible grid (1-12 items)
- ✅ Fully clickable sections
- ✅ 360° icon rotation on hover
- ✅ Fully responsive
- ✅ Keyboard accessible
- ✅ SEO friendly

## 🔧 Customization

Edit these files to customize:
- **Styles**: `style.scss` (then recompile to CSS)
- **Layout**: `block.php`
- **Interactions**: `script.js`
- **Fields**: WordPress Admin → Custom Fields → Icon Text Grid

## 📱 Responsive Breakpoints

- **Desktop (1200px+)**: Auto-fit grid, min 250px columns
- **Tablet (768-1024px)**: Auto-fit grid, min 220px columns
- **Mobile (480-768px)**: Auto-fit grid, min 180px columns
- **Small Mobile (<480px)**: Single column

## 🐛 Troubleshooting

**Block doesn't appear in editor:**
- Ensure ACF Pro is installed and activated
- Check that field group is imported
- Clear WordPress cache

**Styles not loading:**
- Verify `style.css` exists in the block folder
- Check browser console for 404 errors
- Clear browser cache

**Icons not rotating:**
- Check that `script.js` is loading
- Verify no JavaScript errors in console
- Test in different browser

## 📚 File Structure

```
wp-content/themes/twentytwentyfive/blocks/icon-text-grid/
├── block.php              # PHP template
├── style.scss             # Source styles
├── style.css              # Compiled styles
├── script.js              # JavaScript interactions
└── SETUP.md              # This file

nextjs-wordpress/wordpress-theme-files/
├── blocks/icon-text-grid.php                    # Block template copy
└── ACF_FIELD_GROUP_icon_text_grid.json         # ACF fields (IMPORT THIS)

nextjs-wordpress/src/components/blocks/IconTextGrid/
├── IconTextGrid.tsx       # React component
├── styles.scss            # Component styles
└── README.md             # Documentation
```

## ✨ Next Steps

1. Import the ACF field group (see above)
2. Add the block to a test page
3. Upload some test icons
4. Preview and test responsiveness
5. Customize colors/spacing if needed

Enjoy your new Icon Text Grid block! 🎉
