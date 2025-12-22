# Vercel Deployment Setup

## Required Environment Variables

To deploy this Next.js + WordPress headless site on Vercel, you need to configure the following environment variables in your Vercel project settings:

### 1. Go to Vercel Project Settings
- Navigate to your project on Vercel
- Go to **Settings** → **Environment Variables**

### 2. Add Required Variables

#### WordPress Configuration (Required)
```
WORDPRESS_API_URL=https://your-wordpress-site.com/graphql
NEXT_PUBLIC_WORDPRESS_URL=https://your-wordpress-site.com
WORDPRESS_REST_API_URL=https://your-wordpress-site.com/wp-json
```

#### Site Configuration
```
NEXT_PUBLIC_SITE_URL=https://your-vercel-app.vercel.app
NEXT_PUBLIC_SITE_NAME=Your Site Name
NEXT_PUBLIC_SITE_DESCRIPTION=Your site description
```

#### Optional Settings
```
REVALIDATE_TIME=3600
ENABLE_AUTH_MIDDLEWARE=false
```

### 3. Important Notes

- **WORDPRESS_API_URL**: Must point to your WordPress GraphQL endpoint (requires WPGraphQL plugin)
- **NEXT_PUBLIC_WORDPRESS_URL**: Your WordPress site base URL
- **WORDPRESS_REST_API_URL**: Your WordPress REST API endpoint
- All `NEXT_PUBLIC_*` variables are exposed to the browser
- After adding variables, redeploy your application

### 4. WordPress Requirements

Make sure your WordPress site has:
- WPGraphQL plugin installed and activated
- CORS properly configured to allow requests from your Vercel domain
- Custom REST API endpoints registered (if using custom post types)

### 5. Redeploy

After setting environment variables:
```bash
git push origin main
```

Or trigger a manual redeploy from Vercel dashboard.
