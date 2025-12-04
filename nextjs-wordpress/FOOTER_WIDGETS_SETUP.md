# Dynamic Footer Widgets Setup Guide

This guide will help you set up dynamic footer widgets that can be managed from WordPress admin.

## Features

- **5 Footer Columns**: Manage up to 5 widget areas (Footer Column 1-5)
- **Dynamic Content**: Update footer content from WordPress without code changes
- **Copyright Split**: 50/50 split copyright section with left and right text
- **Responsive Design**: Mobile-friendly layout that stacks on smaller screens

## Installation Steps

### 1. Add PHP Code to WordPress

Copy the code from `wordpress-theme-files/footer-widgets-api.php` to your WordPress theme's `functions.php` file:

```bash
# Location: wp-content/themes/your-theme/functions.php
```

Or create it as a custom plugin.

### 2. Configure Footer Widgets in WordPress Admin

1. Go to **Appearance → Widgets** in WordPress admin
2. You'll see 5 new widget areas:
   - Footer Column 1
   - Footer Column 2
   - Footer Column 3
   - Footer Column 4
   - Footer Column 5

3. Add widgets to each column:
   - **Text Widget**: For company info, descriptions
   - **Navigation Menu Widget**: For links
   - **Custom HTML Widget**: For custom content
   - **Social Icons Widget**: If you have a social media plugin

### 3. Configure Copyright Text

1. Go to **Settings → General** in WordPress admin
2. Scroll down to **Footer Copyright Settings**
3. Configure:
   - **Copyright Left Text**: Text for left side (e.g., `© {year} Your Company. All rights reserved.`)
   - **Copyright Right Text**: Text for right side (e.g., `Powered by Next.js & WordPress`)
4. Use `{year}` placeholder for automatic current year

### 4. Example Widget Configuration

#### Footer Column 1 - Company Info
```
Widget: Text
Title: Next.js WordPress Headless
Content: Building modern web experiences with Next.js and WordPress.
```

#### Footer Column 2 - Quick Links
```
Widget: Navigation Menu
Title: Quick Links
Menu: Footer Menu 1 (create menu with: Home, About, Blog, Contact)
```

#### Footer Column 3 - Resources
```
Widget: Navigation Menu
Title: Resources
Menu: Footer Menu 2 (create menu with: Privacy Policy, Terms, Sitemap)
```

#### Footer Column 4 - Follow Us
```
Widget: Custom HTML
Title: Follow Us
Content:
<div class="social-links">
  <a href="https://facebook.com/yourpage">Facebook</a>
  <a href="https://twitter.com/yourhandle">Twitter</a>
  <a href="https://linkedin.com/company/yourcompany">LinkedIn</a>
</div>
```

#### Footer Column 5 - Newsletter (Optional)
```
Widget: Custom HTML
Title: Newsletter
Content: Subscribe to our newsletter for updates
```

### 5. Test the API Endpoint

Visit this URL to verify the API is working:
```
https://your-wordpress-site.com/wp-json/wp/v2/footer-widgets
```

You should see JSON data with your widget content.

## Customization

### Hide Empty Columns

The footer automatically hides columns that don't have any widgets. Just leave a widget area empty in WordPress admin.

### Styling

Edit `src/app/globals.css` to customize:
- Colors
- Spacing
- Typography
- Grid layout

### Widget Content

You can use HTML in widgets for:
- Links
- Images
- Icons
- Custom formatting

## Troubleshooting

### Widgets Not Showing

1. Check if widgets are added in WordPress admin
2. Verify the REST API endpoint returns data
3. Check browser console for errors
4. Ensure `WORDPRESS_REST_API_URL` is set in `.env`

### Copyright Not Updating

1. Go to Settings → General in WordPress
2. Save the copyright settings
3. Clear Next.js cache: `npm run build`

### Styling Issues

1. Check `globals.css` for footer styles
2. Inspect element in browser to see applied styles
3. Verify CSS classes match component structure

## API Response Format

```json
{
  "column1": {
    "id": "footer-column-1",
    "title": "Company Name",
    "content": "<p>Description text</p>",
    "links": []
  },
  "column2": {
    "id": "footer-column-2",
    "title": "Quick Links",
    "content": "",
    "links": [
      { "url": "/", "label": "Home" },
      { "url": "/about", "label": "About" }
    ]
  },
  "copyrightLeft": "© 2025 Your Company. All rights reserved.",
  "copyrightRight": "Powered by Next.js & WordPress"
}
```

## Next Steps

1. Add footer widgets in WordPress admin
2. Configure copyright text
3. Test the footer on your Next.js site
4. Customize styling as needed
5. Add social media icons or newsletter signup
