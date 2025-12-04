# Quick Reference Card

## 🚀 Commands

```bash
# Installation
npm install                    # Install dependencies
install.bat                    # Windows: Install dependencies

# Development
npm run dev                    # Start dev server (http://localhost:3000)
npm run build                  # Build for production
npm start                      # Start production server

# Quality Checks
npm run type-check             # Check TypeScript types
npm run lint                   # Run ESLint

# Windows Scripts
install.bat                    # Install dependencies
build.bat                      # Build with error checking
```

## 📁 Key Files

```
src/app/page.tsx              # Homepage
src/app/posts/[slug]/page.tsx # Single post page
src/app/layout.tsx            # Root layout
src/components/PostCard.tsx   # Post card component
src/lib/wordpress.ts          # GraphQL client
src/lib/queries.ts            # GraphQL queries
src/lib/types.ts              # TypeScript types
src/lib/seo.ts                # SEO utilities
.env                          # Your configuration
next.config.js                # Next.js config
```

## ⚙️ Environment Variables

```env
WORDPRESS_API_URL=https://your-site.com/graphql
NEXT_PUBLIC_WORDPRESS_URL=https://your-site.com
NEXT_PUBLIC_SITE_URL=https://your-nextjs-site.com
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_SITE_DESCRIPTION=Your description
REVALIDATE_TIME=3600
REVALIDATE_SECRET=your-secret
```

## 🔌 WordPress Plugins Required

1. **WPGraphQL** - https://wordpress.org/plugins/wp-graphql/
2. **Yoast SEO** - https://wordpress.org/plugins/wordpress-seo/
3. **WPGraphQL for Yoast SEO** - https://github.com/ashhitch/wp-graphql-yoast-seo

## 📖 Documentation Quick Links

| Need | File |
|------|------|
| Quick start | GETTING_STARTED.md |
| Fix npm errors | FIX_POWERSHELL.md |
| WordPress setup | WORDPRESS_SETUP.md |
| Deploy | DEPLOYMENT.md |
| Complete docs | README.md |
| Architecture | PROJECT_STRUCTURE.md |
| Features list | FEATURES.md |
| Checklist | CHECKLIST.md |

## 🐛 Common Issues

### PowerShell Error
```powershell
# Fix: Run as Administrator
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Or use Command Prompt (cmd) instead
```

### GraphQL Error
```bash
# Check WordPress URL in .env
# Verify WPGraphQL plugin is active
# Test: https://your-site.com/graphql
```

### Images Not Loading
```javascript
// Add domain to next.config.js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'your-wordpress-site.com',
    },
  ],
}
```

### Build Error
```bash
# Check for TypeScript errors
npm run type-check

# Check for lint errors
npm run lint
```

## 🚀 Deploy to Vercel

```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/user/repo.git
git push -u origin main

# 2. Import in Vercel
# - Go to https://vercel.com
# - Click "Import Project"
# - Select repository
# - Add environment variables
# - Deploy
```

## 📊 URLs After Deployment

```
Homepage:        https://your-site.com
Posts:           https://your-site.com/posts
Single Post:     https://your-site.com/posts/post-slug
Category:        https://your-site.com/category/category-slug
About:           https://your-site.com/about
Sitemap:         https://your-site.com/sitemap.xml
Robots:          https://your-site.com/robots.txt
Revalidate API:  https://your-site.com/api/revalidate?secret=xxx
```

## 🎨 Customization Quick Tips

### Change Colors
Edit `src/app/globals.css`:
```css
:root {
  --color-primary: #0070f3;    /* Change this */
  --color-text: #333;
  --color-bg: #ffffff;
}
```

### Add New Page
1. Create `src/app/your-page/page.tsx`
2. Add to `src/components/Header.tsx` navigation
3. Add to `src/app/sitemap.ts`

### Add New Component
1. Create `src/components/YourComponent.tsx`
2. Import and use in pages

### Add GraphQL Query
1. Add to `src/lib/queries.ts`
2. Add type to `src/lib/types.ts`
3. Use with `fetchGraphQL()`

## 🔍 SEO Testing

```bash
# Test URLs
Sitemap:         /sitemap.xml
Robots:          /robots.txt

# External Tools
Google Rich Results:  https://search.google.com/test/rich-results
Facebook Debugger:    https://developers.facebook.com/tools/debug/
Twitter Validator:    https://cards-dev.twitter.com/validator
PageSpeed Insights:   https://pagespeed.web.dev/
```

## 📈 Performance Targets

- Lighthouse Performance: 90+
- Lighthouse Accessibility: 100
- Lighthouse Best Practices: 100
- Lighthouse SEO: 100
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1

## ✅ Pre-Deployment Checklist

- [ ] WordPress plugins installed
- [ ] Sample posts created
- [ ] .env configured
- [ ] Images added to posts
- [ ] SEO fields filled
- [ ] `npm run build` succeeds
- [ ] `npm run type-check` passes
- [ ] `npm run lint` passes
- [ ] Test locally
- [ ] Push to GitHub
- [ ] Deploy to Vercel
- [ ] Test production site
- [ ] Submit sitemap to Google

## 🆘 Get Help

1. Check documentation in this folder
2. Review error messages
3. Test WordPress GraphQL endpoint
4. Verify environment variables
5. Check browser console

## 📞 Support Resources

- Next.js Docs: https://nextjs.org/docs
- WPGraphQL Docs: https://www.wpgraphql.com/docs
- Vercel Docs: https://vercel.com/docs
- TypeScript Docs: https://www.typescriptlang.org/docs

## 🎯 Quick Start (3 Steps)

```bash
# 1. Install
npm install

# 2. Configure
# Copy .env.example to .env
# Update WordPress URL

# 3. Run
npm run dev
# Open http://localhost:3000
```

## 💡 Pro Tips

- Use Command Prompt (cmd) on Windows, not PowerShell
- Fill Yoast SEO fields for all posts
- Use 1200x630px for featured images
- Test build before deploying
- Run type-check before committing
- Keep WordPress plugins updated
- Monitor performance after deployment

---

**Need more details?** See INDEX.md for complete documentation index.
