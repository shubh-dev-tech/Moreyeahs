# Using ACF Blocks in Next.js

## Quick Start

Your Next.js site is now configured to render ACF blocks from WordPress. Here's how to use it:

## Available Blocks

### 1. Hero Block (`acf/hero`)
Full-width hero section with background image and CTA.

**Fields:**
- `title` - Main heading
- `subtitle` - Subheading text
- `background_image` - Hero background image
- `cta_text` - Button text
- `cta_link` - Button URL

### 2. Content Block (`acf/content`)
Simple content section with heading and rich text.

**Fields:**
- `heading` - Section heading
- `content` - Rich text content (WYSIWYG)
- `background_color` - Optional background color

### 3. Image + Text Block (`acf/image-text`)
Two-column layout with image and text content.

**Fields:**
- `image` - Image object with url, alt, width, height
- `heading` - Section heading
- `text` - Rich text content
- `image_position` - 'left' or 'right'

### 4. CTA Block (`acf/cta`)
Call-to-action section with colored background.

**Fields:**
- `heading` - CTA heading
- `description` - CTA description
- `button_text` - Button text
- `button_link` - Button URL
- `background_color` - Background color (hex)

## Creating Custom Blocks

### 1. Create Block Component

Create a new file in `src/components/blocks/YourBlock.tsx`:

```typescript
interface YourBlockProps {
  data: {
    field1?: string;
    field2?: string;
  };
}

export function YourBlock({ data }: YourBlockProps) {
  return (
    <section className="your-block py-16">
      <div className="max-w-6xl mx-auto">
        {/* Your block content */}
      </div>
    </section>
  );
}
```

### 2. Register in BlockRenderer

Edit `src/components/blocks/BlockRenderer.tsx`:

```typescript
import { YourBlock } from './YourBlock';

const BLOCK_COMPONENTS: Record<string, React.ComponentType<any>> = {
  // ... existing blocks
  'acf/your-block': YourBlock,
};
```

### 3. Register in WordPress

Add to your theme's `functions.php`:

```php
acf_register_block_type(array(
    'name'              => 'your-block',
    'title'             => __('Your Block'),
    'description'       => __('Your custom block.'),
    'render_template'   => 'blocks/your-block.php',
    'category'          => 'formatting',
    'icon'              => 'admin-comments',
    'keywords'          => array('your', 'block'),
));
```

### 4. Create ACF Fields

1. Go to WordPress Admin → Custom Fields → Add New
2. Create field group for your block
3. Add your fields
4. Set Location Rule: Block is equal to "Your Block"
5. Enable "Show in GraphQL"

## Using Blocks in Pages

### Method 1: Parse from Content

```typescript
import { parseBlocks } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

export default async function Page() {
  const data = await fetchPageData();
  const blocks = parseBlocks(data.content);
  
  return <BlockRenderer blocks={blocks} />;
}
```

### Method 2: GraphQL Blocks Field

If using WPGraphQL Gutenberg plugin:

```typescript
const query = `
  query GetPage($slug: ID!) {
    page(id: $slug, idType: URI) {
      blocks {
        name
        attributes
        innerBlocks {
          name
          attributes
        }
      }
    }
  }
`;
```

## Fetching ACF Data

### For Individual Posts

```typescript
import { getPostACFFields } from '@/lib/acf';

const acfData = await getPostACFFields('post-slug', 'post');
```

### For Options Pages

```typescript
import { getACFOptions } from '@/lib/acf';

const siteOptions = await getACFOptions('site-options');
```

## Styling Blocks

### Using Tailwind (Recommended)

Blocks use Tailwind CSS classes. Customize in the component:

```typescript
<section className="py-16 px-4 bg-gray-50">
  <div className="max-w-6xl mx-auto">
    {/* Content */}
  </div>
</section>
```

### Custom CSS

Add block-specific styles to `src/app/globals.css`:

```css
.hero-block {
  /* Custom styles */
}

.cta-block {
  /* Custom styles */
}
```

## Core Gutenberg Blocks

The following core blocks are supported:

- `core/paragraph` - Paragraph text
- `core/heading` - Headings (H1-H6)
- `core/image` - Images

Add more in `src/components/blocks/core/` as needed.

## Best Practices

1. **Keep blocks focused** - Each block should do one thing well
2. **Use TypeScript interfaces** - Define clear prop types
3. **Handle missing data** - Use optional chaining and fallbacks
4. **Optimize images** - Use Next.js Image component
5. **Test responsive layouts** - Ensure blocks work on all screen sizes
6. **Cache GraphQL queries** - Use Next.js revalidation

## Example: Building a Landing Page

In WordPress:
1. Create new page
2. Add Hero block at top
3. Add Content blocks for sections
4. Add Image + Text blocks for features
5. Add CTA block at bottom
6. Publish

In Next.js:
- The page automatically renders with all blocks
- No code changes needed
- Styles are applied automatically

## Troubleshooting

### Block Not Rendering

1. Check block is registered in `BlockRenderer.tsx`
2. Verify block name matches WordPress registration
3. Check console for warnings

### Missing Data

1. Verify ACF fields are filled in WordPress
2. Check GraphQL query includes ACF data
3. Ensure WPGraphQL for ACF is installed

### Styling Issues

1. Check Tailwind classes are correct
2. Verify `globals.css` is imported
3. Test in different viewports

## Next Steps

1. Create more custom blocks for your needs
2. Add block variations and settings
3. Implement block patterns
4. Add preview mode for editors
5. Set up incremental static regeneration
