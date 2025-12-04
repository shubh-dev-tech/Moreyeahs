# Next.js WordPress Headless CMS

A production-ready Next.js 14 TypeScript frontend using WordPress with WPGraphQL as a headless CMS. Features full SEO optimization, static site generation with ISR, and modern web best practices.

## Features

- ✅ **Next.js 14** with App Router and TypeScript
- ✅ **WordPress Headless CMS** via WPGraphQL
- ✅ **Dynamic Appearance Settings**
  - Site title and description from WordPress
  - Custom logo support with automatic display
  - Favicon/Site icon management
  - Live updates from WordPress dashboard
- ✅ **WordPress Menu Integration**
  - Dynamic navigation menus
  - Multi-level menu support
  - Mobile-responsive menu
- ✅ **Static Site Generation (SSG)** with Incremental Static Regeneration (ISR)
- ✅ **Full SEO Optimization**
  - Meta tags (title, description)
  - Open Graph tags for social sharing
  - Twitter Card tags
  - Canonical URLs
  - JSON-LD structured data (Article, Organization, WebSite schemas)
- ✅ **Next.js Image Optimization** with automatic WebP/AVIF conversion
- ✅ **Automatic Sitemap Generation**
- ✅ **Robots.txt Generation**
- ✅ **Performance Optimized**
  - Code splitting
  - Image lazy loading
  - Font optimization
- ✅ **Accessibility Best Practices**
  - Semantic HTML
  - ARIA labels
  - Keyboard navigation support
  - Focus indicators
- ✅ **Vercel Deployment Ready**

## Prerequisites

### WordPress Setup

Your WordPress site needs the following plugins installed and activated:

1. **WPGraphQL** (Required)
   - Install from: https://wordpress.org/plugins/wp-graphql/
   - Or via WP-CLI: `wp plugin install wp-graphql --activate`

2. **Yoast SEO** (Recommended for advanced SEO)
   - Install from: https://wordpress.org/plugins/wordpress-seo/
   - Or via WP-CLI: `wp plugin install wordpress-seo --activate`

3. **WPGraphQL for Yoast SEO** (Required if using Yoast)
   - Install from: https://github.com/ashhitch/wp-graphql-yoast-seo
   - Download and upload to `/wp-content/plugins/`
   - Activate via WordPress admin or WP-CLI: `wp plugin activate wp-graphql-yoast-seo`

### WordPress Configuration

1. **Permalink Settings**
   - Go to Settings → Permalinks
   - Select "Post name" structure
   - Save changes

2. **WPGraphQL Settings**
   - Go to GraphQL → Settings
   - Enable "Public Introspection" (for development)
   - Note your GraphQL endpoint: `https://your-site.com/graphql`

3. **CORS Configuration** (if needed)
   Add to your WordPress `wp-config.php`:
   ```php
   header('Access-Control-Allow-Origin: *');
   header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
   header('Access-Control-Allow-Headers: Content-Type, Authorization');
   ```

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd nextjs-wordpress
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your WordPress details**
   ```env
   WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
   NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
   NEXT_PUBLIC_SITE_URL=https://your-nextjs-site.com
   NEXT_PUBLIC_SITE_NAME=Your Site Name
   NEXT_PUBLIC_SITE_DESCRIPTION=Your site description
   REVALIDATE_TIME=3600
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to http://localhost:3000

## Project Structure

```
nextjs-wordpress/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout with SEO
│   │   ├── page.tsx           # Homepage
│   │   ├── globals.css        # Global styles
│   │   ├── not-found.tsx      # 404 page
│   │   ├── robots.ts          # Robots.txt generator
│   │   ├── sitemap.ts         # Sitemap generator
│   │   ├── about/             # About page
│   │   └── posts/
│   │       ├── page.tsx       # Posts listing
│   │       └── [slug]/
│   │           └── page.tsx   # Single post (dynamic)
│   ├── components/            # React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── PostCard.tsx
│   │   └── JsonLd.tsx         # Structured data
│   └── lib/                   # Utilities and helpers
│       ├── wordpress.ts       # GraphQL client
│       ├── queries.ts         # GraphQL queries
│       ├── types.ts           # TypeScript types
│       └── seo.ts             # SEO utilities
├── public/                    # Static assets
├── .env.example              # Environment variables template
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
├── package.json              # Dependencies
└── vercel.json               # Vercel deployment config
```

## Managing Site Appearance

Your site's appearance (logo, favicon, title) is managed directly from WordPress and automatically syncs to your Next.js site.

### Quick Setup (5 minutes)

1. **Access WordPress Customizer**
   - Go to **Appearance → Customize** in WordPress admin

2. **Update Site Identity**
   - Click **Site Identity**
   - Update **Site Title** and **Tagline**
   - Upload **Logo** (recommended: PNG with transparent background, max 400x100px)
   - Upload **Site Icon** (favicon, recommended: 512x512px PNG)
   - Click **Publish**

3. **Changes Go Live Automatically**
   - Logo appears in header navigation
   - Favicon shows in browser tabs
   - Title updates in SEO meta tags

### Test the API

Run the test script to verify your appearance settings:
```bash
cd nextjs-wordpress
node test-appearance-api.js
```

### Documentation

- **👉 Start Here**: [NEXT_STEPS.md](./NEXT_STEPS.md) - What to do now
- **Quick Start**: [APPEARANCE_QUICK_START.md](./APPEARANCE_QUICK_START.md)
- **Visual Guide**: [APPEARANCE_VISUAL_GUIDE.md](./APPEARANCE_VISUAL_GUIDE.md)
- **Detailed Guide**: [APPEARANCE_SETTINGS.md](./APPEARANCE_SETTINGS.md)
- **Technical Details**: [APPEARANCE_IMPLEMENTATION.md](./APPEARANCE_IMPLEMENTATION.md)

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## SEO Checklist

### WordPress Configuration

- [ ] Install and activate WPGraphQL plugin
- [ ] Install and activate Yoast SEO plugin
- [ ] Install and activate WPGraphQL for Yoast SEO plugin
- [ ] Configure permalink structure (Post name)
- [ ] Set site title and tagline in Settings → General
- [ ] **Upload logo in Appearance → Customize → Site Identity** ⭐ NEW
- [ ] **Upload favicon in Appearance → Customize → Site Identity → Site Icon** ⭐ NEW
- [ ] Configure Yoast SEO settings
- [ ] Add SEO title and meta description to all posts
- [ ] Add featured images to all posts (recommended: 1200x630px)
- [ ] Configure Open Graph settings in Yoast
- [ ] Configure Twitter Card settings in Yoast

### Next.js Configuration

- [ ] Update `.env` with correct WordPress URL
- [ ] Update `.env` with production site URL
- [ ] Update site name and description
- [ ] Add favicon.ico to `/public` folder
- [ ] Add apple-touch-icon.png to `/public` folder
- [ ] Add site.webmanifest to `/public` folder
- [ ] Update `next.config.js` with your WordPress domain
- [ ] Configure image domains in `next.config.js`
- [ ] Test sitemap at `/sitemap.xml`
- [ ] Test robots.txt at `/robots.txt`
- [ ] Verify JSON-LD structured data with Google Rich Results Test
- [ ] Test Open Graph tags with Facebook Sharing Debugger
- [ ] Test Twitter Cards with Twitter Card Validator

### Performance Optimization

- [ ] Enable image optimization in WordPress
- [ ] Use WebP format for images
- [ ] Optimize featured images (compress before upload)
- [ ] Configure ISR revalidation time (default: 3600 seconds)
- [ ] Enable caching on WordPress server
- [ ] Use CDN for WordPress media files (optional)
- [ ] Test Core Web Vitals with PageSpeed Insights
- [ ] Test mobile performance

### Accessibility

- [ ] Test keyboard navigation
- [ ] Verify focus indicators are visible
- [ ] Check color contrast ratios
- [ ] Add alt text to all images in WordPress
- [ ] Test with screen reader
- [ ] Validate HTML with W3C Validator

## Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import project in Vercel**
   - Go to https://vercel.com/new
   - Import your repository
   - Vercel will auto-detect Next.js

3. **Configure environment variables**
   Add all variables from `.env` in Vercel dashboard

4. **Deploy**
   - Click "Deploy"
   - Vercel will build and deploy automatically

5. **Configure custom domain** (optional)
   - Add your domain in Vercel dashboard
   - Update DNS records as instructed

### Revalidation & Webhooks

To trigger revalidation when WordPress content changes:

1. **Install WordPress Webhook Plugin**
   - Use "WP Webhooks" or similar

2. **Configure webhook in WordPress**
   - Trigger: Post Published/Updated
   - URL: `https://your-site.com/api/revalidate?secret=YOUR_SECRET`

3. **Create revalidation API route** (optional)
   Create `src/app/api/revalidate/route.ts`:
   ```typescript
   import { revalidatePath } from 'next/cache';
   import { NextRequest, NextResponse } from 'next/server';

   export async function POST(request: NextRequest) {
     const secret = request.nextUrl.searchParams.get('secret');
     
     if (secret !== process.env.REVALIDATE_SECRET) {
       return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
     }

     revalidatePath('/');
     revalidatePath('/posts');
     
     return NextResponse.json({ revalidated: true });
   }
   ```

## GraphQL Queries

The project includes pre-built queries for:

- `GET_ALL_POSTS_SLUGS` - Fetch all post slugs for static generation
- `GET_POST_BY_SLUG` - Fetch single post with SEO data
- `GET_RECENT_POSTS` - Fetch recent posts with pagination
- `GET_POSTS_BY_CATEGORY` - Fetch posts by category
- `GET_ALL_CATEGORIES` - Fetch all categories
- `GET_SITE_SETTINGS` - Fetch site settings

All queries include Yoast SEO fields for complete meta data.

## Customization

### Adding New Pages

1. Create a new file in `src/app/your-page/page.tsx`
2. Add metadata export for SEO
3. Update navigation in `Header.tsx`
4. Add to sitemap in `src/app/sitemap.ts`

### Styling

- Global styles: `src/app/globals.css`
- Component-specific: Add CSS modules or styled-components
- CSS variables are defined in `:root` for easy theming

### Adding Categories/Tags Pages

Create dynamic routes similar to posts:
- `src/app/category/[slug]/page.tsx`
- `src/app/tag/[slug]/page.tsx`

Use `GET_POSTS_BY_CATEGORY` query as reference.

## Troubleshooting

### GraphQL Errors

- Verify WPGraphQL plugin is activated
- Check GraphQL endpoint URL in `.env`
- Test endpoint in browser: `https://your-site.com/graphql`
- Enable GraphiQL IDE in WPGraphQL settings for debugging

### Image Loading Issues

- Verify domain is added to `next.config.js` `remotePatterns`
- Check image URLs are accessible
- Ensure WordPress media files are publicly accessible

### Build Errors

- Run `npm run type-check` to find TypeScript errors
- Verify all environment variables are set
- Check WordPress is accessible from build environment
- Review build logs for specific errors

### SEO Not Working

- Verify Yoast SEO plugin is installed
- Check WPGraphQL for Yoast SEO plugin is activated
- Test GraphQL query in GraphiQL to verify SEO fields
- Use browser dev tools to inspect meta tags

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [WPGraphQL Documentation](https://www.wpgraphql.com/docs/introduction)
- [Yoast SEO](https://yoast.com/wordpress/plugins/seo/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Vercel Deployment](https://vercel.com/docs)

## License

MIT

## Support

For issues and questions:
- Check the troubleshooting section above
- Review WordPress and Next.js documentation
- Check WPGraphQL documentation for query issues
