# Moreyeahs Heading Test Block

## Overview

A custom heading block with color and alignment customization options.

**Block Name:** `acf/moreyeahs-heading-test`  
**ACF Field Group:** `moreyeahs-heading-test`

## Features

- ✅ Custom heading text
- ✅ Optional subheading
- ✅ Text color picker
- ✅ Background color picker
- ✅ Text alignment (left, center, right)
- ✅ Fully responsive
- ✅ GraphQL enabled

## ACF Fields

| Field Name | Type | Required | Default | Description |
|------------|------|----------|---------|-------------|
| `heading` | Text | Yes | - | Main heading text |
| `subheading` | Text | No | - | Optional subheading |
| `text_color` | Color Picker | No | #000000 | Text color |
| `background_color` | Color Picker | No | transparent | Background color |
| `alignment` | Radio | No | center | Text alignment (left/center/right) |

## Installation

### 1. WordPress Setup (Already Done)

The following files have been created:

✅ **PHP Template:** `wordpress-theme-files/blocks/moreyeahs-heading-test.php`  
✅ **Registration Code:** Added to `wordpress-theme-files/functions.php`  
✅ **ACF Fields:** Added to `wordpress-theme-files/ACF_FIELD_GROUPS.json`

### 2. Copy to WordPress Theme

```bash
# Copy the block template
cp wordpress-theme-files/blocks/moreyeahs-heading-test.php /path/to/your-theme/blocks/

# The functions.php code is already included in the main functions.php file
# Just copy the entire functions.php or append the new block registration
```

### 3. Import ACF Field Group

**Option A: Re-import the entire JSON**
1. Go to WordPress Admin → Custom Fields → Tools
2. Click "Import Field Groups"
3. Upload `wordpress-theme-files/ACF_FIELD_GROUPS.json`
4. Click Import (it will update existing groups and add the new one)

**Option B: Create manually**
1. Go to WordPress Admin → Custom Fields → Add New
2. Title: "Moreyeahs Heading Test Block"
3. Add fields as listed in the table above
4. Location Rule: Block is equal to "acf/moreyeahs-heading-test"
5. Enable "Show in GraphQL"
6. GraphQL Field Name: `moreyeahsHeadingTestFields`

## Usage in WordPress

### Adding the Block

1. Edit a page or post
2. Click the "+" button to add a block
3. Search for "Moreyeahs Heading Test"
4. Click to add the block

### Configuring the Block

1. **Heading** - Enter your main heading text (required)
2. **Subheading** - Enter optional subheading text
3. **Text Color** - Click to choose text color (default: black)
4. **Background Color** - Click to choose background color (default: transparent)
5. **Text Alignment** - Select left, center, or right (default: center)

### Example Configuration

```
Heading: "Welcome to Moreyeahs!"
Subheading: "Your journey starts here"
Text Color: #ffffff (white)
Background Color: #2563eb (blue)
Alignment: center
```

## Usage in Next.js

The block is automatically rendered by the BlockRenderer component. No additional code needed!

### How It Works

```typescript
// Automatically handled by BlockRenderer
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

const blocks = parseBlocks(wordpressContent);
return <BlockRenderer blocks={blocks} />;
```

### Component Props

```typescript
interface MoreyeahsHeadingTestBlockProps {
  data: {
    heading?: string;
    subheading?: string;
    text_color?: string;
    background_color?: string;
    alignment?: 'left' | 'center' | 'right';
  };
}
```

## Customization

### Styling

Edit `src/components/blocks/MoreyeahsHeadingTestBlock.tsx`:

```typescript
// Change heading size
<h2 className="text-5xl font-bold mb-4">  // Larger heading

// Add animation
<h2 className="text-4xl font-bold mb-4 animate-fade-in">

// Add custom styles
<section className="moreyeahs-heading-test-block py-16 px-4 shadow-lg">
```

### Adding More Fields

1. **In WordPress:**
   - Edit ACF field group
   - Add new field (e.g., "font_size")
   - Save

2. **In Next.js:**
   - Update TypeScript interface
   - Use the new field in the component

```typescript
interface MoreyeahsHeadingTestBlockProps {
  data: {
    heading?: string;
    subheading?: string;
    text_color?: string;
    background_color?: string;
    alignment?: 'left' | 'center' | 'right';
    font_size?: 'small' | 'medium' | 'large';  // New field
  };
}
```

## Examples

### Example 1: Hero Heading

```
Heading: "Transform Your Business"
Subheading: "With cutting-edge solutions"
Text Color: #ffffff
Background Color: #1e40af
Alignment: center
```

**Result:** White text on blue background, centered

### Example 2: Section Title

```
Heading: "Our Services"
Subheading: "What we offer"
Text Color: #1f2937
Background Color: #f3f4f6
Alignment: left
```

**Result:** Dark text on light gray background, left-aligned

### Example 3: Call-out

```
Heading: "Limited Time Offer!"
Subheading: "Save 50% today"
Text Color: #dc2626
Background Color: #fef2f2
Alignment: center
```

**Result:** Red text on light red background, centered

## Testing

### In WordPress Editor

1. Add the block to a page
2. Fill in the fields
3. Preview should show styled heading
4. Publish the page

### In Next.js

1. Run `npm run dev`
2. Navigate to the page with the block
3. Verify heading renders with correct:
   - Text content
   - Colors
   - Alignment
   - Spacing

## Troubleshooting

### Block Not Showing in WordPress

- ✅ Check functions.php has the registration code
- ✅ Verify blocks/ directory exists in theme
- ✅ Check PHP template file is in blocks/ folder
- ✅ Clear WordPress cache

### Block Not Rendering in Next.js

- ✅ Check BlockRenderer.tsx includes the import
- ✅ Verify block is added to BLOCK_COMPONENTS map
- ✅ Check browser console for errors
- ✅ Verify GraphQL returns block data

### ACF Fields Not Showing

- ✅ Import ACF field group JSON
- ✅ Check location rule matches block name
- ✅ Verify "Show in GraphQL" is enabled
- ✅ Clear ACF cache

### Styling Issues

- ✅ Check Tailwind classes are correct
- ✅ Verify color values are valid hex codes
- ✅ Test in different browsers
- ✅ Check responsive breakpoints

## GraphQL Query

To fetch this block's data:

```graphql
query GetPageWithMoreyeahsBlock($slug: ID!) {
  page(id: $slug, idType: URI) {
    title
    content
    blocks {
      name
      attributes
      ... on AcfMoreyeahsHeadingTestBlock {
        moreyeahsHeadingTestFields {
          heading
          subheading
          textColor
          backgroundColor
          alignment
        }
      }
    }
  }
}
```

## Files Created

### Next.js
- ✅ `src/components/blocks/MoreyeahsHeadingTestBlock.tsx` - React component
- ✅ Updated `src/components/blocks/BlockRenderer.tsx` - Added to renderer

### WordPress
- ✅ `wordpress-theme-files/blocks/moreyeahs-heading-test.php` - PHP template
- ✅ Updated `wordpress-theme-files/functions.php` - Block registration
- ✅ Updated `wordpress-theme-files/ACF_FIELD_GROUPS.json` - Field definitions

## Next Steps

1. ✅ Copy PHP template to WordPress theme
2. ✅ Ensure functions.php code is added
3. ✅ Import/update ACF field groups
4. ✅ Test in WordPress editor
5. ✅ Test in Next.js frontend
6. 🎨 Customize styling as needed
7. 🚀 Use in your pages!

## Support

- Check main documentation: `BLOCKS_USAGE.md`
- Review setup guide: `ACF_BLOCKS_SETUP.md`
- See visual guide: `VISUAL_GUIDE.md`

---

**Your custom "Moreyeahs Heading Test" block is ready to use!** 🎉
