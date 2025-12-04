# Next.js + WordPress ACF Blocks Integration

Complete headless CMS solution using Next.js frontend with WordPress ACF blocks managed from the dashboard.

## 🎯 What This Does

Build your entire frontend from the WordPress dashboard using custom ACF blocks. No code changes needed - just add blocks, fill in fields, and publish.

## 📦 What's Included

### Next.js Components
- ✅ Block parser for WordPress content
- ✅ ACF data fetching utilities
- ✅ Dynamic block renderer
- ✅ 4 pre-built blocks (Hero, Content, Image+Text, CTA)
- ✅ Core Gutenberg block support
- ✅ TypeScript types for all blocks

### WordPress Files
- ✅ Block registration code
- ✅ PHP templates for all blocks
- ✅ ACF field group definitions
- ✅ GraphQL integration
- ✅ REST API enhancements

## 🚀 Quick Start

### 1. Install WordPress Plugins

Required:
- **ACF Pro** - https://www.advancedcustomfields.com/pro/
- **WPGraphQL** - https://wordpress.org/plugins/wp-graphql/
- **WPGraphQL for ACF** - https://github.com/wp-graphql/wpgraphql-acf

### 2. Set Up WordPress Theme

```bash
# Copy block templates to your theme
cp -r wordpress-theme-files/blocks/ /path/to/your-theme/blocks/

# Add functions.php code
cat wordpress-theme-files/functions.php >> /path/to/your-theme/functions.php
```

### 3. Import ACF Fields

WordPress Admin → Custom Fields → Tools → Import
Upload: `wordpress-theme-files/ACF_FIELD_GROUPS.json`

### 4. Configure Environment

```env
# .env.local
WORDPRESS_API_URL=https://your-site.com/graphql
WORDPRESS_REST_API_URL=https://your-site.com/wp-json
NEXT_PUBLIC_WORDPRESS_URL=https://your-site.com
```

### 5. Start Building

```bash
npm install
npm run dev
```

Create a page in WordPress, add blocks, and watch them render in Next.js!

## 📚 Available Blocks

### Hero Block
Full-width hero section with background image and CTA button.

**Fields:**
- Title (text)
- Subtitle (text)
- Background Image (image)
- CTA Text (text)
- CTA Link (URL)

**Usage in WordPress:**
Add block → Search "Hero" → Fill fields → Publish

### Content Block
Simple content section with heading and rich text.

**Fields:**
- Heading (text)
- Content (WYSIWYG)
- Background Color (color picker)

### Image + Text Block
Two-column layout with image and text content.

**Fields:**
- Image (image)
- Heading (text)
- Text (WYSIWYG)
- Image Position (left/right)

### CTA Block
Call-to-action section with colored background.

**Fields:**
- Heading (text)
- Description (textarea)
- Button Text (text)
- Button Link (URL)
- Background Color (color picker)

## 🛠️ Creating Custom Blocks

### Step 1: Create React Component

```typescript
// src/components/blocks/FeatureBlock.tsx
interface FeatureBlockProps {
  data: {
    title?: string;
    features?: Array<{
      icon?: string;
      text?: string;
    }>;
  };
}

export function FeatureBlock({ data }: FeatureBlockProps) {
  return (
    <section className="py-16">
      <h2>{data.title}</h2>
      <div className="grid grid-cols-3 gap-8">
        {data.features?.map((feature, i) => (
          <div key={i}>
            <span>{feature.icon}</span>
            <p>{feature.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Step 2: Register in BlockRenderer

```typescript
// src/components/blocks/BlockRenderer.tsx
import { FeatureBlock } from './FeatureBlock';

const BLOCK_COMPONENTS = {
  // ... existing
  'acf/feature': FeatureBlock,
};
```

### Step 3: Register in WordPress

```php
// functions.php
acf_register_block_type(array(
    'name'              => 'feature',
    'title'             => __('Features'),
    'render_template'   => 'blocks/feature.php',
    'category'          => 'formatting',
    'icon'              => 'star-filled',
));
```

### Step 4: Create PHP Template

```php
// blocks/feature.php
<?php
$title = get_field('title');
$features = get_field('features');
?>
<section>
    <h2><?php echo esc_html($title); ?></h2>
    <?php if ($features): ?>
        <?php foreach ($features as $feature): ?>
            <div>
                <span><?php echo esc_html($feature['icon']); ?></span>
                <p><?php echo esc_html($feature['text']); ?></p>
            </div>
        <?php endforeach; ?>
    <?php endif; ?>
</section>
```

### Step 5: Create ACF Fields

WordPress Admin → Custom Fields → Add New
- Field Group: "Feature Block"
- Fields: title (text), features (repeater with icon, text)
- Location: Block is equal to "Features"
- Show in GraphQL: Yes

Done! Your custom block is ready to use.

## 📖 Documentation

- **ACF_BLOCKS_QUICKSTART.md** - Fast setup guide
- **ACF_BLOCKS_SETUP.md** - Detailed WordPress configuration
- **BLOCKS_USAGE.md** - Usage examples and best practices

## 🔧 API Reference

### Block Parser

```typescript
import { parseBlocks } from '@/lib/blocks';

const blocks = parseBlocks(wordpressContent);
// Returns: Block[]
```

### ACF Data Fetching

```typescript
import { getPostACFFields, getACFOptions } from '@/lib/acf';

// Get ACF fields for a post
const fields = await getPostACFFields('post-slug', 'post');

// Get ACF options page
const options = await getACFOptions('site-settings');
```

### Block Renderer

```typescript
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

<BlockRenderer blocks={blocks} />
```

## 🎨 Styling

Blocks use Tailwind CSS by default. Customize in component files:

```typescript
<section className="py-16 px-4 bg-gradient-to-r from-blue-500 to-purple-600">
  {/* Your content */}
</section>
```

Or add custom CSS to `src/app/globals.css`:

```css
.hero-block {
  /* Custom styles */
}
```

## 🔍 GraphQL Queries

### Fetch Page with Blocks

```graphql
query GetPage($slug: ID!) {
  page(id: $slug, idType: URI) {
    title
    content
    acf {
      fieldGroupName
    }
  }
}
```

### Fetch with Block Data (if using WPGraphQL Gutenberg)

```graphql
query GetPageBlocks($slug: ID!) {
  page(id: $slug, idType: URI) {
    blocks {
      name
      attributes
      innerBlocks {
        name
      }
    }
  }
}
```

## 🐛 Troubleshooting

### Blocks Not Rendering

1. Check block is registered in `BlockRenderer.tsx`
2. Verify block name matches WordPress (e.g., `acf/hero`)
3. Check browser console for errors

### ACF Data Missing

1. Ensure ACF Pro is activated
2. Check field groups are assigned to blocks
3. Verify "Show in GraphQL" is enabled
4. Test GraphQL query in WordPress GraphQL IDE

### Styling Issues

1. Verify Tailwind is configured
2. Check `globals.css` is imported in layout
3. Test responsive breakpoints
4. Use browser dev tools to inspect

### WordPress Errors

1. Check all required plugins are installed
2. Verify theme has `blocks/` directory
3. Check PHP error logs
4. Test block in WordPress editor first

## 📊 Performance

### Optimization Tips

1. **Use ISR (Incremental Static Regeneration)**
```typescript
export const revalidate = 3600; // Revalidate every hour
```

2. **Optimize Images**
```typescript
import Image from 'next/image';
// Next.js Image component is already used in blocks
```

3. **Cache GraphQL Queries**
```typescript
const data = await fetchGraphQL(query, variables, {
  next: { revalidate: 3600 }
});
```

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repo
2. Set environment variables
3. Deploy

### Other Platforms

Ensure these environment variables are set:
- `WORDPRESS_API_URL`
- `WORDPRESS_REST_API_URL`
- `NEXT_PUBLIC_WORDPRESS_URL`

## 🤝 Contributing

Want to add more blocks? Follow the custom block creation guide above and submit a PR!

## 📝 License

MIT

## 🆘 Support

- Check documentation files in this directory
- Review WordPress plugin documentation
- Test in WordPress GraphQL IDE
- Check browser console for errors

---

**Ready to build?** Start with `ACF_BLOCKS_QUICKSTART.md` for a 5-minute setup!
