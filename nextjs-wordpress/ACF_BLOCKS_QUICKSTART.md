# ACF Blocks Quick Start Guide

## What You Have Now

Your Next.js site is ready to render ACF blocks from WordPress! Here's what's been set up:

### Next.js Components ✅
- **Block Parser** (`src/lib/blocks.ts`) - Parses WordPress block content
- **ACF Integration** (`src/lib/acf.ts`) - Fetches ACF field data
- **Block Renderer** (`src/components/blocks/BlockRenderer.tsx`) - Renders blocks dynamically
- **4 Ready-to-Use Blocks**:
  - Hero Block (full-width hero with CTA)
  - Content Block (heading + rich text)
  - Image + Text Block (two-column layout)
  - CTA Block (call-to-action section)
- **Core Gutenberg Blocks** (paragraph, heading, image)

### WordPress Files 📁
All WordPress theme files are in `wordpress-theme-files/`:
- Block templates (PHP files)
- Functions.php code
- ACF field group definitions (JSON)

## Setup Steps

### 1. Install WordPress Plugins

Install these plugins in your WordPress admin:

1. **ACF Pro** (required) - https://www.advancedcustomfields.com/pro/
2. **WPGraphQL** - https://wordpress.org/plugins/wp-graphql/
3. **WPGraphQL for ACF** - https://github.com/wp-graphql/wpgraphql-acf

### 2. Add WordPress Theme Files

Copy files from `wordpress-theme-files/` to your WordPress theme:

```bash
# Copy block templates
wordpress-theme-files/blocks/ → your-theme/blocks/

# Add functions.php code
wordpress-theme-files/functions.php → your-theme/functions.php (append)
```

### 3. Import ACF Field Groups

Two options:

**Option A: Manual Import**
1. Go to WordPress Admin → Custom Fields → Tools
2. Click "Import Field Groups"
3. Upload `wordpress-theme-files/ACF_FIELD_GROUPS.json`

**Option B: Create Manually**
Follow the detailed instructions in `ACF_BLOCKS_SETUP.md`

### 4. Configure Next.js Environment

Update your `.env.local`:

```env
WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
WORDPRESS_REST_API_URL=https://your-wordpress-site.com/wp-json
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
```

### 5. Test It Out!

**In WordPress:**
1. Create a new page
2. Add blocks using the block editor:
   - Search for "Hero", "CTA", "Image + Text", or "Content"
3. Fill in the ACF fields
4. Publish the page

**In Next.js:**
1. Run `npm run dev`
2. Visit your page
3. Blocks render automatically!

## Usage Example

### Create a Landing Page

In WordPress, create a page with this structure:

```
1. Hero Block
   - Title: "Welcome to Our Site"
   - Subtitle: "Build amazing things"
   - Background Image: [upload image]
   - CTA: "Get Started" → /contact

2. Content Block
   - Heading: "About Us"
   - Content: [your content]

3. Image + Text Block
   - Image: [upload]
   - Heading: "Our Features"
   - Text: [feature description]
   - Position: Left

4. CTA Block
   - Heading: "Ready to Start?"
   - Description: "Join thousands of users"
   - Button: "Sign Up" → /signup
   - Background: #2563eb
```

### In Your Next.js Code

```typescript
// app/[slug]/page.tsx
import { fetchGraphQL } from '@/lib/wordpress';
import { parseBlocks } from '@/lib/blocks';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

export default async function Page({ params }) {
  const query = `
    query GetPage($slug: ID!) {
      page(id: $slug, idType: URI) {
        title
        content
      }
    }
  `;
  
  const data = await fetchGraphQL(query, { slug: params.slug });
  const blocks = parseBlocks(data.page.content);
  
  return (
    <main>
      <BlockRenderer blocks={blocks} />
    </main>
  );
}
```

That's it! The blocks render automatically.

## Creating Custom Blocks

### 1. Create React Component

```typescript
// src/components/blocks/TestimonialBlock.tsx
interface TestimonialBlockProps {
  data: {
    quote?: string;
    author?: string;
    company?: string;
  };
}

export function TestimonialBlock({ data }: TestimonialBlockProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <blockquote className="text-2xl italic">
          "{data.quote}"
        </blockquote>
        <p className="mt-4 font-bold">{data.author}</p>
        <p className="text-gray-600">{data.company}</p>
      </div>
    </section>
  );
}
```

### 2. Register in BlockRenderer

```typescript
// src/components/blocks/BlockRenderer.tsx
import { TestimonialBlock } from './TestimonialBlock';

const BLOCK_COMPONENTS = {
  // ... existing blocks
  'acf/testimonial': TestimonialBlock,
};
```

### 3. Register in WordPress

```php
// functions.php
acf_register_block_type(array(
    'name'              => 'testimonial',
    'title'             => __('Testimonial'),
    'render_template'   => 'blocks/testimonial.php',
    'category'          => 'formatting',
    'icon'              => 'format-quote',
));
```

### 4. Create ACF Fields

In WordPress Admin → Custom Fields:
- Create field group "Testimonial Block"
- Add fields: quote, author, company
- Location: Block is equal to "Testimonial"
- Enable "Show in GraphQL"

Done! Your custom block is ready.

## Common Tasks

### Fetch ACF Data for a Post

```typescript
import { getPostACFFields } from '@/lib/acf';

const acfData = await getPostACFFields('post-slug');
```

### Use ACF Options Page

```typescript
import { getACFOptions } from '@/lib/acf';

const siteSettings = await getACFOptions('site-settings');
```

### Add More Core Blocks

Create component in `src/components/blocks/core/`:

```typescript
// src/components/blocks/core/Button.tsx
export function CoreButton({ innerHTML, data }) {
  return <div dangerouslySetInnerHTML={{ __html: innerHTML }} />;
}
```

Register in BlockRenderer:

```typescript
'core/button': CoreButton,
```

## Troubleshooting

### Blocks Not Showing
- Check WordPress plugins are activated
- Verify blocks are registered in functions.php
- Check BlockRenderer has the block component

### No ACF Data
- Ensure ACF Pro is installed
- Check field groups are assigned to blocks
- Verify "Show in GraphQL" is enabled

### Styling Issues
- Update Tailwind classes in components
- Add custom CSS to `globals.css`
- Check responsive breakpoints

## Next Steps

1. ✅ Set up WordPress plugins
2. ✅ Copy theme files
3. ✅ Import ACF field groups
4. ✅ Create test page with blocks
5. ✅ Run Next.js dev server
6. 🎉 Start building!

## Resources

- Full setup guide: `ACF_BLOCKS_SETUP.md`
- Usage examples: `BLOCKS_USAGE.md`
- ACF Docs: https://www.advancedcustomfields.com/resources/blocks/
- WPGraphQL Docs: https://www.wpgraphql.com/

Need help? Check the detailed guides or create custom blocks following the examples above.
