# Dynamic Yoast SEO Implementation Guide

This guide explains how to implement dynamic SEO metadata using Yoast SEO for all pages in the Next.js application.

## Overview

All pages now fetch their metadata dynamically from WordPress using Yoast SEO plugin via GraphQL. This means when you update SEO details in WordPress admin, the changes automatically reflect on your Next.js frontend.

## How It Works

1. **Yoast SEO** is configured in WordPress for each page
2. **WPGraphQL Yoast SEO plugin** exposes SEO data via GraphQL API
3. **generatePageMetadata()** function in Next.js fetches this data
4. Next.js uses the data to populate meta tags, Open Graph, Twitter Cards, etc.

## Implementation for Existing Pages

All existing pages have been updated to use dynamic metadata. Here's the pattern:

### Before (Static Metadata)
```typescript
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title | MoreYeahs',
  description: 'Static description here',
};
```

### After (Dynamic Metadata from Yoast SEO)
```typescript
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('page-slug');
}
```

## Adding Dynamic SEO to New Pages

When creating a new page, follow these steps:

### Step 1: Import Required Functions
```typescript
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';
```

### Step 2: Add generateMetadata Function
```typescript
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('your-page-slug');
}
```

**Important:** The slug passed to `generatePageMetadata()` must match the page slug in WordPress.

### Step 3: Create the Page in WordPress

1. Go to WordPress Admin → Pages → Add New
2. Create a page with the same slug as your Next.js route
3. Configure Yoast SEO settings:
   - SEO Title
   - Meta Description
   - Open Graph settings
   - Twitter Card settings
   - Focus Keyword
   - etc.

### Example: Creating a New "Contact" Page

**Next.js File:** `src/app/contact/page.tsx`
```typescript
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('contact'); // WordPress page slug
}

export default function ContactPage() {
  return (
    <div>
      <h1>Contact Us</h1>
      {/* Your page content */}
    </div>
  );
}
```

**WordPress Setup:**
1. Create page with slug: `contact`
2. Fill in Yoast SEO fields as desired
3. Publish the page

That's it! The metadata will automatically be fetched from WordPress.

## Nested Routes

For nested routes, use the final segment of the URL as the slug:

```typescript
// For: /microsoft-services/power-bi/
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('power-bi');
}

// For: /salesforce-services/sales-cloud/
export async function generateMetadata(): Promise<Metadata> {
  return generatePageMetadata('sales-cloud');
}
```

## What Gets Fetched

The `generatePageMetadata()` function automatically fetches and includes:

- **Title** - SEO title from Yoast
- **Description** - Meta description
- **Canonical URL** - Preferred URL for the page
- **Open Graph** - Title, description, image for social sharing
- **Twitter Card** - Twitter-specific metadata
- **Robots** - Index/noindex, follow/nofollow directives
- **Schema.org** - Structured data (JSON-LD)

## Fallback Behavior

If Yoast SEO data is not found for a page, the system automatically generates fallback metadata:
- Title is formatted from the slug
- Description uses a generic template
- Canonical URL is generated from the route

## Updating SEO Content

To update SEO metadata for any page:

1. Go to WordPress Admin
2. Edit the page
3. Scroll to Yoast SEO section
4. Update the desired fields
5. Save/Update the page
6. Changes will reflect on the Next.js site (respecting cache revalidation settings)

## Cache Revalidation

The GraphQL queries use Next.js revalidation:
- Default: 3600 seconds (1 hour)
- Can be adjusted in `src/lib/wordpress.ts`

To see changes immediately during development, you can:
- Clear the Next.js cache
- Restart the dev server
- Use ISR with shorter revalidation times

## Troubleshooting

### Metadata not updating
- Check if the WordPress page slug matches the slug passed to `generatePageMetadata()`
- Verify Yoast SEO is installed and activated
- Ensure WPGraphQL Yoast SEO plugin is active
- Check WordPress GraphQL endpoint is accessible

### 404 or null data
- Verify the page exists in WordPress with the correct slug
- Check WordPress page is published (not draft)
- Test GraphQL query in WordPress GraphQL IDE

### Testing GraphQL Queries

You can test the query in WordPress:
1. Go to: `http://your-wordpress-site/graphql`
2. Use this query:
```graphql
query GetPageSEO($slug: ID!) {
  page(id: $slug, idType: SLUG) {
    id
    title
    slug
    seo {
      title
      metaDesc
      canonical
      opengraphTitle
      opengraphDescription
      opengraphImage {
        sourceUrl
      }
    }
  }
}
```
3. Query Variables:
```json
{
  "slug": "your-page-slug"
}
```

## Pages Updated

All the following pages now use dynamic Yoast SEO metadata:
- ✅ /about
- ✅ /services
- ✅ /testimonials
- ✅ /posts
- ✅ /salesforce-services
- ✅ /salesforce-services/sales-cloud
- ✅ /salesforce-services/power-bi
- ✅ /salesforce-services/application-support-management
- ✅ /microsoft-services
- ✅ /microsoft-services/azure
- ✅ /microsoft-services/power-bi
- ✅ /microsoft-services/power-automate
- ✅ /microsoft-services/business-central
- ✅ /microsoft-services/dynamics-365
- ✅ /microsoft-services/sharepoint
- ✅ /services/devops
- ✅ /services/dynamics-365
- ✅ /services/data-science
- ✅ /services/data-engineering
- ✅ /services/artificial-intelligence
- ✅ /data-science/artificial-intelligence
- ✅ /data-science/data-engineering
- ✅ /data-science/ai-ml
- ✅ /data-science/computer-vision
- ✅ /data-science/iot
- ✅ /cloud-infrastructure/aws
- ✅ /cloud-infrastructure/gcp
- ✅ /cloud-infrastructure/devops
- ✅ /cloud-infrastructure/ci-cd
- ✅ /case-study
- ✅ /case-studies

## Related Files

- **SEO Library:** `src/lib/seo.ts` - Contains `generatePageMetadata()` function
- **WordPress GraphQL:** `src/lib/wordpress.ts` - GraphQL client
- **Queries:** `src/lib/queries.ts` - GraphQL queries including SEO fields
- **Types:** `src/lib/types.ts` - TypeScript interfaces for SEO data

## Benefits

✅ **Centralized Management** - Update SEO from WordPress admin
✅ **No Code Changes** - SEO updates don't require code deployment
✅ **Consistency** - All pages follow the same SEO pattern
✅ **Automatic** - New pages automatically inherit SEO from WordPress
✅ **Future-Proof** - New pages created in WordPress automatically work
✅ **Full Control** - All Yoast SEO features available (Focus Keyword, Readability, etc.)
