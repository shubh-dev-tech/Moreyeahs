# Second Menu (Side Burger Menu) Setup Guide

## Overview
Your burger menu now uses a completely separate "Second Menu" location in WordPress. This menu is INDEPENDENT from your header menu.

## Features
- ✅ 100vh height (full viewport)
- ✅ 35% width on desktop (responsive on mobile/tablet)
- ✅ Slides from right to left
- ✅ Dynamic menu from WordPress
- ✅ Completely separate from header menu
- ✅ Supports submenus with toggle buttons
- ✅ Dark overlay background

## WordPress Setup

### Step 1: Upload Updated functions.php
Upload the updated `wordpress-theme-files/functions.php` to your WordPress theme directory:
```
wp-content/themes/your-theme/functions.php
```

### Step 2: Create Second Menu in WordPress
1. Go to **WordPress Admin → Appearance → Menus**
2. Click **"Create a new menu"**
3. Name it something like "Side Menu" or "Burger Menu"
4. Check the **"Second Menu (Side Burger Menu)"** location checkbox
5. Click **Create Menu**

### Step 3: Add Pages to Your Second Menu
1. In the menu editor, add pages from the left sidebar (Pages, Custom Links, etc.)
2. Drag and drop to reorder items
3. Indent items to create submenus (drag slightly to the right)
4. Click **Save Menu**

## Important Notes
- **Header Menu** = Uses "Primary Menu" location (shows in desktop header)
- **Burger Menu** = Uses "Second Menu" location (shows in side burger menu)
- These are COMPLETELY SEPARATE menus
- You can have different items in each menu

## Customization

### Change Menu Width
Edit `nextjs-wordpress/src/app/globals.css`:

```css
.mobile-menu__nav {
  width: 35%; /* Change this value */
}
```

### Change Colors
```css
.mobile-menu__link {
  color: #333; /* Menu item color */
}

.mobile-menu__link:hover {
  color: #0066cc; /* Hover color */
}
```

### Change Font Size
```css
.mobile-menu__link {
  font-size: 1.5rem; /* Main menu items */
}

.mobile-menu__submenu .mobile-menu__link {
  font-size: 1rem; /* Submenu items */
}
```

## Testing
1. Create a menu in WordPress with the "Side Menu" location
2. Add some pages and subpages
3. Visit your Next.js site
4. Click the burger menu icon
5. Menu should slide in from the right with your WordPress pages

## Troubleshooting

### Menu not showing?
- Make sure you've assigned a menu to the "Side Menu" location in WordPress
- Check that the menu has items
- Verify the WordPress REST API is accessible

### Submenus not working?
- Make sure child items are properly indented in WordPress menu editor
- Check browser console for errors

### Width issues on mobile?
The menu automatically adjusts:
- Desktop (>1024px): 35% width
- Tablet (769-1024px): 50% width
- Mobile (≤768px): 80% width

## Files Modified
- `nextjs-wordpress/wordpress-theme-files/functions.php` - Added "side" menu location
- `nextjs-wordpress/src/components/Header.tsx` - Fetches side menu
- `nextjs-wordpress/src/components/MobileMenu.tsx` - Dynamic menu rendering
- `nextjs-wordpress/src/app/globals.css` - Styling updates
