# Menu Quick Start

## 1. WordPress Setup (5 minutes)

### Add to functions.php
Copy the menu code from `wordpress-theme-files/functions.php` to your theme's functions.php

### Create Menu
1. WordPress Admin → **Appearance → Menus**
2. Click **Create a new menu**
3. Name: "Main Menu"
4. Add pages/links
5. Assign to **Primary Menu** location
6. Save

## 2. Test Menu API

Visit in browser:
```
https://your-wordpress-site.com/wp-json/wp/v2/menus/primary
```

Should return JSON with menu items.

## 3. Environment Variables

Check `.env` file has:
```
WORDPRESS_REST_API_URL=https://your-wordpress-site.com/wp-json/wp/v2
```

## 4. Run Next.js

```bash
cd nextjs-wordpress
npm run dev
```

Visit `http://localhost:3000` - your WordPress menu should appear in the header!

## Menu Structure Example

```
Home
About
  └─ Our Team
  └─ Our Story
Services
  └─ Web Development
     └─ Frontend
     └─ Backend
  └─ Design
Blog
Contact
```

## Troubleshooting

**Menu not showing?**
- Check REST API URL in browser
- Verify menu assigned to "Primary Menu" location
- Check console for errors

**Styling issues?**
- Edit `src/app/globals.css`
- Look for `.header__menu` styles

## Next Steps

See `MENU_SETUP.md` for detailed documentation.
