# Project Structure

```
nextjs-wordpress/
├── public/                          # Static assets
│   └── site.webmanifest            # PWA manifest
│
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── layout.tsx             # Root layout with SEO
│   │   ├── page.tsx               # Homepage
│   │   ├── globals.css            # Global styles
│   │   ├── not-found.tsx          # 404 page
│   │   ├── robots.ts              # Robots.txt generator
│   │   ├── sitemap.ts             # Sitemap generator
│   │   │
│   │   ├── about/                 # About page
│   │   │   └── page.tsx
│   │   │
│   │   ├── posts/                 # Posts section
│   │   │   ├── page.tsx           # Posts listing
│   │   │   └── [slug]/            # Dynamic post pages
│   │   │       └── page.tsx       # Single post with SSG/ISR
│   │   │
│   │   ├── category/              # Category pages
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   │
│   │   └── api/                   # API routes
│   │       └── revalidate/        # Webhook for ISR
│   │           └── route.ts
│   │
│   ├── components/                # React components
│   │   ├── Header.tsx             # Site header
│   │   ├── Footer.tsx             # Site footer
│   │   ├── PostCard.tsx           # Post card component
│   │   └── JsonLd.tsx             # JSON-LD structured data
│   │
│   └── lib/                       # Utilities and helpers
│       ├── wordpress.ts           # GraphQL client
│       ├── queries.ts             # GraphQL queries
│       ├── types.ts               # TypeScript types
│       ├── seo.ts                 # SEO utilities
│       └── constants.ts           # App constants
│
├── .env                           # Environment variables (local)
├── .env.example                   # Environment template
├── .gitignore                     # Git ignore rules
├── .eslintrc.json                 # ESLint configuration
├── next.config.js                 # Next.js configuration
├── tsconfig.json                  # TypeScript configuration
├── package.json                   # Dependencies
├── vercel.json                    # Vercel deployment config
│
├── README.md                      # Main documentation
├── SETUP.md                       # Quick setup guide
├── WORDPRESS_SETUP.md             # WordPress configuration
├── DEPLOYMENT.md                  # Deployment guide
├── PROJECT_STRUCTURE.md           # This file
│
├── install.bat                    # Windows install script
└── build.bat                      # Windows build script
```

## Key Files Explained

### Configuration Files

- **next.config.js**: Next.js configuration including image domains
- **tsconfig.json**: TypeScript compiler options
- **.env**: Environment variables (not in git)
- **vercel.json**: Vercel deployment settings and headers

### App Router Structure

- **app/layout.tsx**: Root layout, wraps all pages, includes global SEO
- **app/page.tsx**: Homepage with recent posts
- **app/posts/[slug]/page.tsx**: Dynamic post pages with SSG and ISR
- **app/sitemap.ts**: Generates XML sitemap automatically
- **app/robots.ts**: Generates robots.txt automatically

### Library Files

- **lib/wordpress.ts**: GraphQL client setup and fetch functions
- **lib/queries.ts**: All GraphQL queries for posts, categories, etc.
- **lib/types.ts**: TypeScript interfaces for WordPress data
- **lib/seo.ts**: SEO metadata generation utilities
- **lib/constants.ts**: App-wide constants

### Components

- **Header.tsx**: Site navigation
- **Footer.tsx**: Site footer
- **PostCard.tsx**: Reusable post card for listings
- **JsonLd.tsx**: Structured data component for SEO

## Data Flow

1. **Build Time (SSG)**:
   - `generateStaticParams()` fetches all post slugs
   - Next.js pre-renders all post pages
   - Sitemap is generated with all URLs

2. **Runtime (ISR)**:
   - Pages revalidate after `REVALIDATE_TIME` seconds
   - Fresh data is fetched from WordPress
   - Updated pages are cached

3. **On-Demand Revalidation**:
   - WordPress webhook triggers `/api/revalidate`
   - Specific paths are revalidated immediately
   - No need to wait for ISR timer

## SEO Implementation

### Meta Tags (layout.tsx, page.tsx)
- Title and description
- Open Graph tags
- Twitter Card tags
- Canonical URLs

### Structured Data (JsonLd.tsx)
- Article schema for posts
- Organization schema
- WebSite schema with search action

### Automatic Generation
- Sitemap.xml with all pages
- Robots.txt with sitemap reference

## Styling Approach

- **Global CSS**: `app/globals.css`
- **CSS Variables**: Defined in `:root` for theming
- **Responsive Design**: Mobile-first approach
- **Accessibility**: Focus states, semantic HTML

## Performance Features

- **Image Optimization**: Next.js Image component with WebP/AVIF
- **Code Splitting**: Automatic with App Router
- **Static Generation**: Pre-rendered at build time
- **ISR**: Incremental updates without full rebuild
- **Font Optimization**: Next.js font optimization

## Type Safety

- **Full TypeScript**: All files use TypeScript
- **Type Definitions**: Complete types for WordPress data
- **Type Checking**: Run `npm run type-check` before deploy

## Development Workflow

1. Edit files in `src/`
2. Changes hot-reload automatically
3. Test locally at http://localhost:3000
4. Run type check: `npm run type-check`
5. Run lint: `npm run lint`
6. Build: `npm run build`
7. Commit and push to deploy

## Adding New Features

### New Page
1. Create `src/app/your-page/page.tsx`
2. Add metadata export
3. Update navigation in Header.tsx
4. Add to sitemap.ts

### New Component
1. Create in `src/components/YourComponent.tsx`
2. Import and use in pages
3. Add TypeScript types

### New GraphQL Query
1. Add to `src/lib/queries.ts`
2. Add response type to `src/lib/types.ts`
3. Use with `fetchGraphQL()` function

### New API Route
1. Create in `src/app/api/your-route/route.ts`
2. Export GET/POST functions
3. Return NextResponse

## Best Practices

- Keep components small and focused
- Use TypeScript for type safety
- Add proper SEO metadata to all pages
- Optimize images before upload to WordPress
- Test on mobile devices
- Run type-check before committing
- Use semantic HTML
- Add alt text to all images
- Test accessibility with keyboard navigation
