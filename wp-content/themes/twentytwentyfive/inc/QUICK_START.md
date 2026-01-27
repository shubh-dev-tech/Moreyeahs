# Quick Start: Adding ACF Blocks

## 🚀 3-Step Process

### Step 1: Create Template File
Create `blocks/my-block.php`:
```php
<?php
$title = get_field('title');
$content = get_field('content');
?>
<div class="my-block">
    <h2><?php echo esc_html($title); ?></h2>
    <p><?php echo esc_html($content); ?></p>
</div>
```

### Step 2: Register in acf-blocks.php
Add to the `$blocks` array:
```php
array(
    'name'              => 'my-block',
    'title'             => __('My Block', 'twentytwentyfive'),
    'description'       => __('My custom block', 'twentytwentyfive'),
    'category'          => 'formatting',
    'icon'              => 'admin-customizer',
    'keywords'          => array('custom', 'my'),
    'render_template'   => 'blocks/my-block.php',
    'supports'          => array('align' => true),
),
```

### Step 3: Create ACF Fields
1. Go to **Custom Fields** in WordPress admin
2. Click **Add New**
3. Add your fields (title, content, etc.)
4. Set **Location**: Block is equal to `acf/my-block`
5. Click **Publish**

**Done!** Your block is now available in the editor.

---

## 📁 File Structure

```
wp-content/themes/twentytwentyfive/
├── functions.php                    # Includes inc/acf-blocks.php
├── inc/
│   ├── acf-blocks.php              # ⭐ Register all blocks here
│   ├── ACF_BLOCKS_README.md        # Full documentation
│   └── QUICK_START.md              # This file
├── blocks/
│   ├── promo-block.php             # Example block template
│   └── my-block.php                # Your new block
└── acf-json/
    └── group_*.json                # Auto-saved ACF fields
```

---

## 💡 Pro Tips

**Inline Styles**: Add `<style>` tags directly in your template
**External CSS**: Use `'enqueue_style' => get_template_directory_uri() . '/assets/css/my-block.css'`
**JavaScript**: Use `'enqueue_script' => get_template_directory_uri() . '/assets/js/my-block.js'`
**Alignment**: `'supports' => array('align' => array('wide', 'full'))`

---

## 🎯 Current Blocks

- ✅ **Promo Block** (`acf/promo-block`)

Add more blocks by following the 3-step process above!
