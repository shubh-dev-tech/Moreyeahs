# Getting Started - Next.js WordPress Headless CMS

## 🚀 Quick Start (5 Minutes)

### Step 1: Fix PowerShell (Windows Users)

If you get "scripts disabled" error, open PowerShell as Administrator:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**OR** use Command Prompt (cmd) instead of PowerShell.

### Step 2: Install Dependencies

```bash
cd nextjs-wordpress
npm install
```

Or use the batch file:
```bash
install.bat
```

### Step 3: Configure Environment

1. Copy `.env.example` to `.env`
2. Edit `.env` and update these values:

```env
WORDPRESS_API_URL=http://localhost/graphql
NEXT_PUBLIC_WORDPRESS_URL=http://localhost
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SITE_NAME=My Awesome Site
NEXT_PUBLIC_SITE_DESCRIPTION=My site description
```

### Step 4: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📋 WordPress Setup (10 Minutes)

### Required Plugins

Install these WordPress plugins:

1. **WPGraphQL** - https://wordpress.org/plugins/wp-graphql/
2. **Yoast SEO** - https://wordpress.org/plugins/wordpress-seo/
3. **WPGraphQL for Yoast SEO** - https://github.com/ashhitch/wp-graphql-yoast-seo

### Quick WordPress Configuration

1. **Permalinks**: Settings → Permalinks → Select "Post name" → Save
2. **GraphQL**: Verify endpoint works at `http://localhost/graphql`
3. **Create Posts**: Add 2-3 sample posts with featured images
4. **Add SEO Data**: Fill in Yoast SEO fields for each post

**Full WordPress setup guide**: See `WORDPRESS_SETUP.md`

## 🧪 Test Your Setup

### 1. Test WordPress GraphQL

Visit: `http://localhost/graphql`

Run this query:
```graphql
{
  posts(first: 5) {
    nodes {
      title
      slug
    }
  }
}
```

You should see your posts!

### 2. Test Next.js

Visit: `http://localhost:3000`

You should see:
- Homepage with recent posts
- Post cards with images
- Working navigation

### 3. Test Single Post

Click on a post card. You should see:
- Full post content
- Featured image
- Author info
- Categories and tags

## 📦 What's Included

### ✅ Core Features
- Next.js 14 with App Router
- TypeScript
- WordPress integration via WPGraphQL
- Static Site Generation (SSG)
- Incremental Static Regeneration (ISR)

### ✅ SEO Features
- Meta tags (title, description)
- Open Graph tags
- Twitter Cards
- Canonical URLs
- JSON-LD structured data
- Automatic sitemap
- Automatic robots.txt

### ✅ Performance
- Image optimization (WebP/AVIF)
- Code splitting
- Lazy loading
- Font optimization

### ✅ Pages
- Homepage
- Posts listing
- Single post pages
- Category pages
- About page
- 404 page

## 🏗️ Project Structure

```
nextjs-wordpress/
├── src/
│   ├── app/              # Pages (App Router)
│   ├── components/       # React components
│   └── lib/             # Utilities & GraphQL
├── public/              # Static files
├── .env                 # Your config (not in git)
└── Documentation files
```

## 🛠️ Available Commands

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run type-check   # Check TypeScript types
```

## 📚 Documentation

- **README.md** - Complete documentation
- **SETUP.md** - Quick setup guide
- **WORDPRESS_SETUP.md** - WordPress configuration
- **DEPLOYMENT.md** - Deploy to production
- **PROJECT_STRUCTURE.md** - Architecture overview
- **CHECKLIST.md** - Production readiness checklist

## 🚢 Deploy to Production

### Vercel (Easiest - 5 Minutes)

1. Push code to GitHub
2. Go to https://vercel.com
3. Click "Import Project"
4. Select your repository
5. Add environment variables
6. Click "Deploy"

Done! Your site is live.

**Full deployment guide**: See `DEPLOYMENT.md`

## 🐛 Troubleshooting

### "Cannot find module" errors
```bash
npm install
```

### GraphQL errors
- Check WordPress URL in `.env`
- Verify WPGraphQL plugin is active
- Test endpoint: `http://localhost/graphql`

### Images not loading
- Add WordPress domain to `next.config.js` under `remotePatterns`
- Check image URLs are accessible

### Build errors
```bash
npm run type-check  # Find TypeScript errors
npm run lint        # Find code issues
```

## 🎯 Next Steps

1. ✅ Install dependencies
2. ✅ Configure WordPress plugins
3. ✅ Update .env file
4. ✅ Create sample posts
5. ✅ Test locally
6. 📝 Customize design (edit `src/app/globals.css`)
7. 📝 Add your content
8. 🚀 Deploy to Vercel
9. 📊 Submit sitemap to Google Search Console

## 💡 Tips

- **Development**: Changes hot-reload automatically
- **Images**: Use 1200x630px for featured images
- **SEO**: Fill in Yoast SEO fields for all posts
- **Performance**: Run `npm run build` to test production build
- **Type Safety**: Run `npm run type-check` before deploying

## 🆘 Need Help?

1. Check the documentation files
2. Review error messages carefully
3. Test WordPress GraphQL endpoint
4. Verify environment variables
5. Check browser console for errors

## 📖 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [WPGraphQL Documentation](https://www.wpgraphql.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Vercel Documentation](https://vercel.com/docs)

## ✨ Features to Add (Optional)

- Search functionality
- Pagination for posts
- Comments system
- Newsletter signup
- Related posts
- Tag pages
- Author pages
- Dark mode toggle

## 🎉 You're Ready!

Your Next.js WordPress headless CMS is ready to use. Start by creating content in WordPress and watch it appear in your Next.js frontend automatically!

Happy coding! 🚀
