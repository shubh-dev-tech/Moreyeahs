# Quick Guide: Second Menu (Side Burger Menu)

## ✅ What's Done
Your burger menu is now set up to use a **completely separate menu** from your header menu!

## 🎯 Menu Locations

| Location | Where It Shows | Menu Name in WordPress |
|----------|---------------|------------------------|
| **Primary Menu** | Desktop header (top navigation) | "Primary Menu" |
| **Second Menu** | Burger/Side menu (slides from right) | "Second Menu (Side Burger Menu)" |

## 📝 How to Set Up in WordPress

### Step 1: Go to Menus
1. Login to WordPress Admin
2. Go to **Appearance → Menus**

### Step 2: Create Second Menu
1. Click **"create a new menu"** at the top
2. Give it a name like "Side Menu" or "Burger Menu"
3. **Important:** Check the box for **"Second Menu (Side Burger Menu)"**
4. Click **"Create Menu"**

### Step 3: Add Different Pages
1. Add pages from the left sidebar (different from your Primary Menu!)
2. You can add:
   - Pages
   - Custom Links
   - Categories
   - Posts
3. Drag to reorder
4. Indent items (drag right) to create submenus
5. Click **"Save Menu"**

## 🎨 Example Setup

**Primary Menu (Header):**
- Home
- About
- Services
- Contact

**Second Menu (Burger):**
- Products
- Portfolio
- Blog
- Careers
- Support

## 🔧 Features
- ✅ 100vh height (full screen)
- ✅ 35% width on desktop
- ✅ Slides from right to left
- ✅ Dark overlay background
- ✅ Supports submenus with toggle buttons
- ✅ Completely independent from header menu

## 🚀 Testing
1. Create your "Second Menu" in WordPress
2. Add some pages (different from Primary Menu)
3. Visit your Next.js site
4. Click the burger icon
5. You should see your Second Menu items!

## ❓ Troubleshooting

**Q: I still see the same menu as my header?**
A: Make sure you've:
1. Created a NEW menu in WordPress
2. Checked the "Second Menu (Side Burger Menu)" location
3. Saved the menu
4. Cleared your Next.js cache (restart dev server)

**Q: The burger menu is empty?**
A: You need to create and assign a menu to the "Second Menu" location in WordPress.

**Q: How do I change which menu shows in the burger?**
A: Go to Appearance → Menus, and check/uncheck the "Second Menu (Side Burger Menu)" location for different menus.

## 📁 Files Updated
- ✅ `wordpress-theme-files/functions.php` - Added "second-menu" location
- ✅ `wp-content/themes/twentytwentyfive/functions.php` - Added "second-menu" location
- ✅ `src/components/Header.tsx` - Fetches second-menu
- ✅ `src/components/MobileMenu.tsx` - Renders dynamic menu
- ✅ `src/app/globals.css` - Styling for 100vh, 35% width

## 🎉 You're All Set!
Your burger menu now uses its own separate menu location. Just create the menu in WordPress and it will automatically appear!
