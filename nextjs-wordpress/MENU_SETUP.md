# WordPress Menu Setup Guide

This guide explains how to set up and use dynamic menus in your Next.js + WordPress application.

## Features

- ✅ Dynamic menus fetched from WordPress
- ✅ Support for nested submenus (unlimited depth)
- ✅ Multiple menu locations (Primary, Footer)
- ✅ REST API endpoints for menu data
- ✅ Responsive design with mobile support
- ✅ Automatic caching (1 hour)

## WordPress Setup

### 1. Add Functions to WordPress

Copy the menu-related code from `wordpress-theme-files/functions.php` to your WordPress theme's `functions.php` file. This includes:

- Menu registration (Primary and Footer locations)
- REST API endpoints for menus
- Menu formatting functions

### 2. Create Menus in WordPress

1. Go to **Appearance → Menus** in WordPress admin
2. Click **Create a new menu**
3. Name it (e.g., "Main Menu")
4. Add menu items:
   - Pages
   - Posts
   - Custom Links
   - Categories
5. Drag items to create hierarchy (submenus)
6. Assign to **Primary Menu** location
7. Click **Save Menu**

### 3. Menu Structure Example

```
Home
About
  - Our Team
  - Our Story
Services
  - Web Development
    - Frontend
    - Backend
  - Design
Blog
Contact
```

## REST API Endpoints

### Get Menu by Location
```
GET /wp-json/wp/v2/menus/primary
GET /wp-json/wp/v2/menus/footer
```

### Get All Menus
```
GET /wp-json/wp/v2/menus
```

### Response Format
```json
{
  "id": 2,
  "name": "Main Menu",
  "slug": "main-menu",
  "location": "primary",
  "items": [
    {
      "id": 123,
      "title": "Home",
      "url": "https://yoursite.com",
      "target": "_self",
      "parent": 0,
      "order": 1,
      "classes": "menu-item",
      "children": []
    }
  ]
}
```

## Next.js Implementation

### Header Component

The Header component automatically fetches and displays the primary menu:

```tsx
import Header from '@/components/Header';

// In your layout
<Header />
```

### Custom Menu Usage

To use a different menu location:

```tsx
import { getMenuByLocation } from '@/lib/wordpress';

export default async function CustomNav() {
  const menu = await getMenuByLocation('footer');
  
  return (
    <nav>
      {menu?.items.map(item => (
        <a key={item.id} href={item.url}>
          {item.title}
        </a>
      ))}
    </nav>
  );
}
```

## Styling

Menu styles are in `src/app/globals.css`:

- `.header__menu` - Main menu container
- `.header__submenu` - Dropdown submenu
- `.has-children` - Items with submenus
- Responsive styles for mobile

### Customization

To customize menu appearance, edit the CSS variables:

```css
:root {
  --color-primary: #0070f3;
  --color-text: #333;
  --color-border: #e5e5e5;
}
```

## Menu Features

### Dropdown Menus
- Hover to show submenus on desktop
- Click/tap to expand on mobile
- Unlimited nesting levels

### Link Targets
- `_self` - Open in same window (default)
- `_blank` - Open in new tab

### Custom Classes
Add custom CSS classes in WordPress menu editor:
1. Click **Screen Options** (top right)
2. Enable **CSS Classes**
3. Add classes to menu items

## Troubleshooting

### Menu Not Showing

1. Check WordPress REST API is accessible:
   ```
   https://your-wordpress-site.com/wp-json/wp/v2/menus/primary
   ```

2. Verify environment variables in `.env`:
   ```
   WORDPRESS_REST_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
   ```

3. Check menu is assigned to location in WordPress

### CORS Issues

The functions.php includes CORS headers. If issues persist:

1. Check WordPress is allowing REST API access
2. Verify CORS headers in functions.php
3. Check server configuration

### Cache Issues

Menus are cached for 1 hour. To clear:

```bash
# Development
npm run dev

# Production - rebuild
npm run build
```

## Adding More Menu Locations

### 1. Register in WordPress

Edit `functions.php`:

```php
register_nav_menus(array(
    'primary' => __('Primary Menu'),
    'footer' => __('Footer Menu'),
    'mobile' => __('Mobile Menu'), // New location
));
```

### 2. Use in Next.js

```tsx
const mobileMenu = await getMenuByLocation('mobile');
```

## Best Practices

1. **Keep menus simple** - 5-7 top-level items max
2. **Limit nesting** - 2-3 levels deep maximum
3. **Use descriptive labels** - Clear, concise menu text
4. **Test mobile** - Ensure menus work on small screens
5. **Monitor performance** - Check API response times

## Next Steps

- Create a Footer menu
- Add menu icons
- Implement mobile hamburger menu
- Add mega menu support
- Create menu widgets
