# Dynamic Environment Setup

This setup provides automatic environment detection and URL configuration for both Next.js and WordPress, ensuring your site works seamlessly across local, development, staging, and production environments.

## Features

- ✅ Automatic environment detection
- ✅ Dynamic WordPress and Next.js URL configuration
- ✅ Automatic image URL transformation
- ✅ Environment-specific database configuration
- ✅ CORS handling for API requests
- ✅ JWT authentication configuration
- ✅ Media URL transformation in WordPress content

## Environment Detection

The system automatically detects the current environment based on:

1. **Explicit environment variable**: `NEXT_PUBLIC_ENVIRONMENT`
2. **Vercel environment**: `VERCEL_ENV`
3. **Node environment**: `NODE_ENV`
4. **URL patterns**: Domain names and hostnames
5. **Client-side detection**: Browser hostname analysis

### Environment Types

- **Local**: `localhost`, `127.0.0.1`, `.local` domains
- **Development**: `dev.` subdomains, development URLs
- **Staging**: `staging.` subdomains, preview deployments
- **Production**: Production domains, main site

## Setup Instructions

### 1. WordPress Configuration

The WordPress configuration is now dynamic and automatically detects the environment.

#### WordPress Configuration Files

The setup includes two key files:

1. **`wp-config-dynamic.php`** - Included in your `wp-config.php`, handles:
   - Environment detection
   - Database configuration
   - WordPress URL configuration

2. **`wp-content/mu-plugins/moreyeahs-dynamic-config.php`** - Must-use plugin that handles:
   - CORS headers for Next.js integration
   - Media URL transformation
   - REST API response transformation
   - Environment debugging endpoint

#### Environment-Specific WordPress Settings

**Local Development:**
- WordPress URL: `http://localhost/moreyeahs-new`
- Database: `moreyeahs-new`
- Debug: Enabled

**Development:**
- WordPress URL: `https://dev.moreyeahs.com`
- Database: `moreyeahs_dev` (or from environment variables)
- Debug: Enabled (log only)

**Staging:**
- WordPress URL: `https://staging.moreyeahs.com`
- Database: `moreyeahs_staging` (or from environment variables)
- Debug: Log only

**Production:**
- WordPress URL: `https://moreyeahs.com`
- Database: `moreyeahs_prod` (or from environment variables)
- Debug: Disabled

### 2. Next.js Configuration

#### Environment Files

Create environment-specific files:

- `.env` - Local development (default)
- `.env.development` - Development environment
- `.env.staging` - Staging environment
- `.env.production` - Production environment

#### Key Environment Variables

```bash
# Explicit environment setting (optional)
NEXT_PUBLIC_ENVIRONMENT=local|development|staging|production

# WordPress URLs for different environments
NEXT_PUBLIC_WORDPRESS_URL=https://dev.moreyeahs.com
NEXT_PUBLIC_WORDPRESS_DEV_URL=https://dev.moreyeahs.com
NEXT_PUBLIC_WORDPRESS_STAGING_URL=https://staging.moreyeahs.com
NEXT_PUBLIC_WORDPRESS_PROD_URL=https://moreyeahs.com
NEXT_PUBLIC_WORDPRESS_FALLBACK_URL=http://localhost/moreyeahs-new

# Site configuration
NEXT_PUBLIC_SITE_URL=https://moreyeahsnew.vercel.app
```

### 3. Image Configuration

The system automatically transforms image URLs to use the current environment's WordPress URL.

#### Next.js Image Domains

The `next.config.js` is configured to allow images from all your environments:

- `localhost` (local development)
- `dev.moreyeahs.com` (development)
- `staging.moreyeahs.com` (staging)
- `moreyeahs.com` (production)

#### Automatic Image URL Transformation

All WordPress media URLs are automatically transformed:

```typescript
// Before: http://localhost/moreyeahs-new/wp-content/uploads/2025/12/image.png
// After: https://dev.moreyeahs.com/wp-content/uploads/2025/12/image.png (on dev environment)

import { transformMediaUrl } from '@/lib/wordpress';

const imageUrl = transformMediaUrl(originalUrl);
```

## Usage

### In Components

```typescript
import { transformMediaUrl, getWordPressUrl } from '@/lib/wordpress';
import { getEnvironmentConfig, isEnvironment } from '@/lib/environment';

// Transform image URLs
const imageUrl = transformMediaUrl(originalImageUrl);

// Get current WordPress URL
const wpUrl = getWordPressUrl();

// Check environment
if (isEnvironment('local')) {
  // Local-specific code
}

// Get full environment config
const config = getEnvironmentConfig();
console.log(config.environment); // 'local', 'development', 'staging', 'production'
```

### Environment Debug Component

Add the debug component to see current environment information:

```typescript
import { EnvironmentDebug } from '@/components/EnvironmentDebug';

export default function Layout({ children }) {
  return (
    <div>
      {children}
      <EnvironmentDebug />
    </div>
  );
}
```

## Deployment

### Vercel Deployment

1. **Production**: Deploy to main branch
   - Set `NEXT_PUBLIC_ENVIRONMENT=production`
   - Uses production WordPress URL

2. **Staging**: Deploy to staging branch or preview
   - Set `NEXT_PUBLIC_ENVIRONMENT=staging`
   - Uses staging WordPress URL

3. **Development**: Deploy to development branch
   - Set `NEXT_PUBLIC_ENVIRONMENT=development`
   - Uses development WordPress URL

### Environment Variables on Vercel

Set these in your Vercel project settings:

```bash
# Production
NEXT_PUBLIC_ENVIRONMENT=production
NEXT_PUBLIC_WORDPRESS_URL=https://moreyeahs.com

# Staging
NEXT_PUBLIC_ENVIRONMENT=staging
NEXT_PUBLIC_WORDPRESS_URL=https://staging.moreyeahs.com

# Development
NEXT_PUBLIC_ENVIRONMENT=development
NEXT_PUBLIC_WORDPRESS_URL=https://dev.moreyeahs.com
```

## WordPress Database Configuration

### Environment Variables for WordPress

Set these in your hosting environment or `.env` files:

```bash
# Development
DB_HOST=localhost
DB_NAME=moreyeahs_dev
DB_USER=your_user
DB_PASSWORD=your_password

# Staging
DB_HOST_STAGING=staging_host
DB_NAME_STAGING=moreyeahs_staging
DB_USER_STAGING=staging_user
DB_PASSWORD_STAGING=staging_password

# Production
DB_HOST_PROD=production_host
DB_NAME_PROD=moreyeahs_prod
DB_USER_PROD=production_user
DB_PASSWORD_PROD=production_password
```

## API Integration

### WordPress REST API

All API calls automatically use the correct environment URLs:

```typescript
import { fetchWordPressAPI, fetchRestAPI } from '@/lib/wordpress';

// Automatically uses correct environment URL
const posts = await fetchWordPressAPI('/wp/v2/posts');
const customData = await fetchRestAPI('/wp/v2/custom-endpoint');
```

### CORS Configuration

The WordPress configuration automatically handles CORS for your Next.js application across all environments.

## Testing Your Setup

### 1. **Test WordPress Load**
First, verify WordPress loads without errors:
- Open `test-wp-load.php` in your browser
- This will test if WordPress configuration is working

### 2. **Test WordPress Environment**
Open `test-wordpress-environment.html` in your browser to verify:
- WordPress environment detection works
- Media URL transformation is active
- REST API endpoints are accessible

### 3. **Test Next.js Application**
```bash
cd nextjs-wordpress
npm run dev
```

### 4. **Add Debug Component**
Add this to your Next.js layout to see environment info:
```typescript
import { EnvironmentDebug } from '@/components/EnvironmentDebug';
// Add <EnvironmentDebug /> to your layout
```

## Troubleshooting

### Debug Environment Detection

1. **WordPress Load Test**: Open `test-wp-load.php` to check for configuration errors
2. **Next.js Side**: Add the `EnvironmentDebug` component to see current configuration
3. **WordPress Side**: Visit `/wp-json/moreyeahs/v1/environment` to see WordPress environment info
4. **Test Page**: Open `test-wordpress-environment.html` in your browser to test WordPress functionality
5. Check browser console for environment logs
6. Verify environment variables are set correctly

### Common Issues

1. **WordPress Fatal Error**: 
   - Make sure `wp-content/mu-plugins/moreyeahs-dynamic-config.php` exists
   - The mu-plugins directory should be created automatically
   
2. **Images not loading**: Check Next.js image domains in `next.config.js`

3. **API calls failing**: 
   - Verify WordPress CORS configuration in the mu-plugin
   - Check `/wp-json/moreyeahs/v1/environment` endpoint
   
4. **Wrong environment detected**: Set `NEXT_PUBLIC_ENVIRONMENT` explicitly

5. **Database connection issues**: Check environment-specific database variables

6. **"regions.map is not a function" error**: 
   - This has been fixed in NavigationNextBlock component
   - Make sure to restart your Next.js development server

### Testing Different Environments

```bash
# Test local
npm run dev

# Test with development environment
NEXT_PUBLIC_ENVIRONMENT=development npm run dev

# Test with staging environment
NEXT_PUBLIC_ENVIRONMENT=staging npm run build && npm run start

# Test production build
npm run build && npm run start
```

## File Structure

```
├── nextjs-wordpress/
│   ├── src/
│   │   ├── lib/
│   │   │   ├── environment.ts          # Environment detection logic
│   │   │   └── wordpress.ts            # WordPress API with environment support
│   │   └── components/
│   │       └── EnvironmentDebug.tsx    # Debug component
│   ├── .env                           # Local development
│   ├── .env.development               # Development environment
│   ├── .env.staging                   # Staging environment
│   ├── .env.production                # Production environment
│   └── next.config.js                 # Next.js config with image domains
├── wp-config.php                      # WordPress config (includes dynamic config)
├── wp-config-dynamic.php              # Dynamic WordPress configuration
└── DYNAMIC-ENVIRONMENT-SETUP.md       # This documentation
```

## Benefits

1. **Zero Configuration**: Works automatically across environments
2. **Consistent URLs**: All images and API calls use correct environment URLs
3. **Easy Deployment**: No manual URL changes needed
4. **Development Friendly**: Easy to test different environments locally
5. **Production Ready**: Optimized for production deployments
6. **Scalable**: Easy to add new environments

Your site will now automatically adapt to any environment without manual configuration changes!