# ACF Blocks File Structure

## Next.js Files (Already Created)

```
nextjs-wordpress/
├── src/
│   ├── app/
│   │   └── page.tsx                          # Updated homepage with BlockRenderer
│   ├── components/
│   │   └── blocks/
│   │       ├── BlockRenderer.tsx             # Main block renderer component
│   │       ├── HeroBlock.tsx                 # Hero block component
│   │       ├── ContentBlock.tsx              # Content block component
│   │       ├── ImageTextBlock.tsx            # Image + Text block component
│   │       ├── CTABlock.tsx                  # CTA block component
│   │       └── core/
│   │           ├── Paragraph.tsx             # Core paragraph block
│   │           ├── Heading.tsx               # Core heading block
│   │           └── Image.tsx                 # Core image block
│   └── lib/
│       ├── blocks.ts                         # Block parsing utilities
│       ├── acf.ts                            # ACF data fetching
│       └── queries/
│           └── blocks.ts                     # GraphQL queries for blocks
│
├── wordpress-theme-files/                    # Files to copy to WordPress
│   ├── blocks/
│   │   ├── hero.php                          # Hero block template
│   │   ├── content.php                       # Content block template
│   │   ├── image-text.php                    # Image + Text block template
│   │   └── cta.php                           # CTA block template
│   ├── functions.php                         # WordPress functions to add
│   └── ACF_FIELD_GROUPS.json                 # ACF field groups to import
│
└── Documentation/
    ├── README_ACF_BLOCKS.md                  # Main documentation
    ├── ACF_BLOCKS_QUICKSTART.md              # Quick start guide
    ├── ACF_BLOCKS_SETUP.md                   # Detailed setup guide
    └── BLOCKS_USAGE.md                       # Usage examples
```

## WordPress Theme Structure (After Setup)

```
your-wordpress-theme/
├── blocks/                                    # Copy from wordpress-theme-files/blocks/
│   ├── hero.php
│   ├── content.php
│   ├── image-text.php
│   └── cta.php
│
└── functions.php                              # Add code from wordpress-theme-files/functions.php
```

## Key Files Explained

### Next.js Core Files

**src/lib/blocks.ts**
- Parses WordPress block content
- Extracts block data and attributes
- Identifies ACF blocks
- Utility functions for block handling

**src/lib/acf.ts**
- Fetches ACF field data via GraphQL
- Fetches ACF options pages
- REST API fallback methods

**src/components/blocks/BlockRenderer.tsx**
- Maps block names to React components
- Dynamically renders blocks
- Handles unsupported blocks gracefully

**src/components/blocks/[BlockName].tsx**
- Individual block components
- TypeScript interfaces for props
- Tailwind CSS styling
- Next.js Image optimization

### WordPress Files

**wordpress-theme-files/functions.php**
- Registers ACF blocks
- Enables blocks in REST API
- Exposes blocks to GraphQL
- CORS headers for Next.js

**wordpress-theme-files/blocks/*.php**
- PHP templates for block preview in WordPress editor
- Renders blocks for WordPress admin
- Not used by Next.js (Next.js uses React components)

**wordpress-theme-files/ACF_FIELD_GROUPS.json**
- ACF field group definitions
- Import via WordPress Admin → Custom Fields → Tools
- Defines all fields for each block

## Data Flow

```
WordPress Dashboard
    ↓
User adds ACF block
    ↓
User fills in ACF fields
    ↓
User publishes page
    ↓
Content stored in WordPress database
    ↓
Next.js fetches via GraphQL
    ↓
parseBlocks() extracts block data
    ↓
BlockRenderer maps to React components
    ↓
Block components render with ACF data
    ↓
Page displayed to user
```

## Adding New Blocks Checklist

- [ ] Create React component in `src/components/blocks/`
- [ ] Add to `BlockRenderer.tsx` BLOCK_COMPONENTS map
- [ ] Create PHP template in WordPress theme `blocks/`
- [ ] Register block in WordPress `functions.php`
- [ ] Create ACF field group in WordPress Admin
- [ ] Set location rule to your block
- [ ] Enable "Show in GraphQL"
- [ ] Test in WordPress editor
- [ ] Test in Next.js frontend

## Environment Variables Required

```env
# .env.local
WORDPRESS_API_URL=https://your-site.com/graphql
WORDPRESS_REST_API_URL=https://your-site.com/wp-json
NEXT_PUBLIC_WORDPRESS_URL=https://your-site.com
```

## WordPress Plugins Required

1. **ACF Pro** (paid) - https://www.advancedcustomfields.com/pro/
2. **WPGraphQL** (free) - https://wordpress.org/plugins/wp-graphql/
3. **WPGraphQL for ACF** (free) - https://github.com/wp-graphql/wpgraphql-acf

## Optional Enhancements

### WPGraphQL Gutenberg
For native GraphQL block queries (alternative to parsing):
- https://github.com/wp-graphql/wp-graphql-gutenberg

### ACF Extended
Additional ACF features and block options:
- https://wordpress.org/plugins/acf-extended/

### Yoast SEO + WPGraphQL
SEO data in GraphQL:
- https://github.com/ashhitch/wp-graphql-yoast-seo

## Development Workflow

1. **Design Phase**
   - Plan block structure
   - Define ACF fields needed
   - Sketch layout

2. **WordPress Setup**
   - Register block in functions.php
   - Create PHP template
   - Create ACF field group
   - Test in WordPress editor

3. **Next.js Development**
   - Create React component
   - Add to BlockRenderer
   - Style with Tailwind
   - Test with sample data

4. **Integration Testing**
   - Create test page in WordPress
   - Add block with real data
   - Verify rendering in Next.js
   - Test responsive design

5. **Production**
   - Deploy Next.js to Vercel/hosting
   - Configure environment variables
   - Set up revalidation
   - Monitor performance

## Maintenance

### Updating Blocks
1. Modify React component for frontend changes
2. Modify PHP template for WordPress editor preview
3. Add/remove ACF fields as needed
4. Test both WordPress and Next.js

### Version Control
- Commit Next.js files to your repo
- Export ACF field groups regularly
- Document block changes
- Keep WordPress theme files in sync

## Performance Considerations

- Use Next.js Image component (already implemented)
- Enable ISR with revalidate
- Optimize GraphQL queries
- Cache ACF options data
- Lazy load images
- Minimize block complexity

## Security

- Sanitize ACF data in PHP templates
- Use dangerouslySetInnerHTML carefully
- Validate URLs and links
- Escape user input
- Keep plugins updated
- Use environment variables for sensitive data
