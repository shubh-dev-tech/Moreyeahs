# Vercel Deployment Setup

This configuration sets up a separate Vercel deployment that pulls data from `dev.moreyeahs.com`.

## Environment Configuration

The Vercel deployment uses a special `vercel` environment that:
- Pulls all content and data from `dev.moreyeahs.com`
- Uses optimized settings for static generation
- Has shorter revalidation times (30 minutes vs 1 hour)

## Files Created/Modified

1. **`.env.vercel`** - Environment variables specifically for Vercel
2. **`vercel.json`** - Updated with environment variables
3. **`src/lib/environment.ts`** - Added `vercel` environment type
4. **`deploy-vercel.bat`** - Helper script for deployment

## Deployment Options

### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Option 2: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Connect your GitHub repository
3. The `vercel.json` configuration will automatically apply

## Environment Variables in Vercel Dashboard

If you prefer to set environment variables in the Vercel dashboard instead of `vercel.json`, add these:

### Production Environment Variables:
- `NEXT_PUBLIC_ENVIRONMENT` = `vercel`
- `NEXT_PUBLIC_WORDPRESS_URL` = `https://dev.moreyeahs.com`
- `WORDPRESS_API_URL` = `https://dev.moreyeahs.com/graphql`
- `WORDPRESS_REST_API_URL` = `https://dev.moreyeahs.com/wp-json`
- `NEXT_PUBLIC_WORDPRESS_DEV_URL` = `https://dev.moreyeahs.com`
- `WORDPRESS_DEV_API_URL` = `https://dev.moreyeahs.com/wp-json`
- `ALLOW_BUILD_WITHOUT_WORDPRESS` = `true`
- `ENABLE_AUTH_MIDDLEWARE` = `false`
- `REVALIDATE_TIME` = `1800`

## How It Works

1. **Environment Detection**: The app detects it's running in the `vercel` environment
2. **Data Source**: All WordPress data is fetched from `dev.moreyeahs.com`
3. **Static Generation**: Pages are pre-built at deploy time
4. **Revalidation**: Content is revalidated every 30 minutes
5. **Media URLs**: All media URLs are automatically transformed to point to `dev.moreyeahs.com`

## Testing

After deployment, your Vercel app will:
- Display content from `dev.moreyeahs.com`
- Update when you make changes to the dev WordPress site
- Automatically handle media URL transformations
- Work independently of your local development environment

## Updating Content

To update content on your Vercel deployment:
1. Make changes in your WordPress admin at `dev.moreyeahs.com`
2. Wait for revalidation (30 minutes) or trigger manual revalidation
3. Changes will appear on your Vercel site

## Manual Revalidation

You can trigger manual revalidation by visiting:
```
https://your-vercel-app.vercel.app/api/revalidate?secret=your-secret-key
```

(You'll need to set up the revalidation API endpoint if not already configured)