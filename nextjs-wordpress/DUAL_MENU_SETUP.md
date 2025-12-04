# Dual Menu Setup (Infosys Style)

## What You Get

Your header now has **TWO separate menus** just like the Infosys website:

### Desktop View:
```
[Logo]  [Menu Item 1] [Menu Item 2] [Menu Item 3] [Menu Item 4]  [🔍] [☰]
```

### Mobile View:
```
[Logo]                                                            [☰]
```

## Features

1. **Primary Menu** (Desktop only)
   - Horizontal navigation links
   - Visible next to the logo
   - Hides on mobile devices
   - Best for 3-5 main links

2. **Burger Menu** (All devices)
   - Hamburger icon (☰) always visible
   - Opens slide-in panel from right
   - Shows full navigation with submenus
   - Can be different from primary menu

3. **Search Button** (Desktop only)
   - Search icon (🔍) next to burger
   - Ready for search functionality

## WordPress Setup Steps

### Step 1: Update functions.php
Copy the updated `wordpress-theme-files/functions.php` to your WordPress theme folder.

This adds the "Secondary Menu" location.

### Step 2: Create Primary Menu
1. Go to WordPress Admin → **Appearance → Menus**
2. Create a new menu: "Primary Menu"
3. Add 3-5 main items (e.g., Navigate your next, Services, About, Contact)
4. **Do NOT add submenus** - keep it flat
5. Under "Menu Settings", check **Primary Menu**
6. Click **Save Menu**

### Step 3: Create Secondary Menu (Burger Menu)
1. Go to WordPress Admin → **Appearance → Menus**
2. Create a new menu: "Secondary Menu" or "Full Navigation"
3. Add ALL your navigation items
4. Create hierarchy by dragging items to the right
5. Under "Menu Settings", check **Secondary Menu (Burger Menu)**
6. Click **Save Menu**

### Example Structure

**Primary Menu** (Desktop horizontal):
```
- Navigate your next
- Infosys Knowledge Institute
- Investors
- Careers
```

**Secondary Menu** (Burger panel):
```
- Navigate your next
  - Industries
  - Services
  - Platforms
  - Infosys Knowledge Institute
  - About Us
    - Investors
    - Careers
    - Newsroom
    - Contact Us
```

## Customization

### Change Menu Colors
Edit `src/app/globals.css`:

```css
/* Desktop menu links */
.header__menu a {
  color: #ffffff; /* Change this */
}

/* Burger menu panel background */
.mobile-menu__nav {
  background-color: #f5f5f5; /* Change this */
}

/* Burger menu links */
.mobile-menu__link {
  color: #333; /* Change this */
}
```

### Hide Search Button
In `src/components/Header.tsx`, remove or comment out:
```tsx
<button className="header__search-btn" aria-label="Search">
  ...
</button>
```

### Use Same Menu for Both
If you want the burger menu to show the same items as the primary menu, just don't create a secondary menu. The system will automatically use the primary menu for both.

## How It Works

1. **Desktop**: Shows primary menu + search + burger
2. **Mobile**: Shows only burger (primary menu hidden)
3. **Burger Menu Content**: 
   - Uses secondary menu if it exists
   - Falls back to primary menu if no secondary menu

## Testing

1. Create both menus in WordPress
2. Refresh your Next.js site
3. Desktop: You should see horizontal links + burger button
4. Click burger: Slide-in panel opens from right
5. Mobile: Only burger button visible
6. Click menu items: Panel closes automatically

## Troubleshooting

**Primary menu not showing?**
- Check that menu is assigned to "Primary Menu" location
- Verify menu has items
- Clear Next.js cache: `npm run build`

**Burger menu empty?**
- Check that menu is assigned to "Secondary Menu" location
- If no secondary menu, check primary menu exists
- Verify WordPress REST API is accessible

**Submenus not working?**
- Make sure items are indented in WordPress menu editor
- Check that parent items have the + icon
- Click + to expand submenus
