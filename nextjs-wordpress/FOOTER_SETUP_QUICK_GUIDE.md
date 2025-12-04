# Quick Guide: See Footer Widget Options in WordPress

## ✅ Code Installation Complete!

The footer widgets code has been successfully added to your WordPress theme at:
`wp-content/themes/twentytwentyfive/functions.php`

## 🔄 Next Steps to See Footer Options

### Step 1: Refresh WordPress Admin

1. **Log out and log back in** to WordPress admin, OR
2. Simply **refresh your browser** on any WordPress admin page

This ensures WordPress loads the new functions.

### Step 2: Access Footer Widgets

Go to: **Appearance → Widgets**

You should now see **5 new widget areas**:
- Footer Column 1
- Footer Column 2
- Footer Column 3
- Footer Column 4
- Footer Column 5

### Step 3: Configure Copyright Text

Go to: **Settings → General**

Scroll down to find the new section: **Footer Copyright Settings**

You'll see two fields:
- **Copyright Left Text** (left side of footer)
- **Copyright Right Text** (right side of footer)

**Example values:**
```
Left: © {year} Your Company Name. All rights reserved.
Right: Powered by <a href="https://nextjs.org">Next.js</a> & WordPress
```

The `{year}` placeholder will automatically show the current year.

## 🎨 Adding Widgets to Footer Columns

### Example Setup:

#### Footer Column 1 - Company Info
1. Drag **Text** widget to "Footer Column 1"
2. Title: `Next.js WordPress Headless`
3. Content: `Building modern web experiences with Next.js and WordPress.`

#### Footer Column 2 - Quick Links
1. First create a menu: **Appearance → Menus**
   - Name it "Footer Menu 1"
   - Add pages: Home, About, Blog, Contact
2. Drag **Navigation Menu** widget to "Footer Column 2"
3. Title: `Quick Links`
4. Select Menu: `Footer Menu 1`

#### Footer Column 3 - Resources
1. Create another menu: **Appearance → Menus**
   - Name it "Footer Menu 2"
   - Add pages: Privacy Policy, Terms, Sitemap
2. Drag **Navigation Menu** widget to "Footer Column 3"
3. Title: `Resources`
4. Select Menu: `Footer Menu 2`

#### Footer Column 4 - Social Media
1. Drag **Custom HTML** widget to "Footer Column 4"
2. Title: `Follow Us`
3. Content:
```html
<div class="social-links">
  <a href="https://facebook.com/yourpage">Facebook</a>
  <a href="https://twitter.com/yourhandle">Twitter</a>
  <a href="https://linkedin.com/company/yourcompany">LinkedIn</a>
</div>
```

#### Footer Column 5 - Newsletter (Optional)
Leave empty or add a newsletter signup widget

## 🧪 Test the API

Visit this URL in your browser:
```
http://localhost/moreyeahs-new/wp-json/wp/v2/footer-widgets
```

You should see JSON data with your footer content.

## ❓ Troubleshooting

### "I don't see the widget areas"

1. Make sure you saved the functions.php file
2. Log out and log back in to WordPress
3. Clear your browser cache
4. Check if you're using the Twenty Twenty-Five theme

### "I see the widgets but they don't appear on the site"

1. Make sure you've added widgets to the columns
2. Check the API endpoint shows data
3. Rebuild your Next.js site: `npm run build`
4. Restart the Next.js dev server

### "Copyright settings not showing"

1. Go to **Settings → General**
2. Scroll all the way down
3. Look for "Footer Copyright Settings" section
4. If not there, check functions.php was saved correctly

## 📱 How It Works

1. **WordPress Admin**: You manage footer content via widgets
2. **REST API**: WordPress exposes footer data at `/wp-json/wp/v2/footer-widgets`
3. **Next.js**: Footer component fetches data and displays it
4. **Responsive**: Automatically adjusts for mobile (stacks columns)
5. **50/50 Copyright**: Left and right text split evenly on desktop

## 🎯 Current Setup

Your WordPress URL: `http://localhost/moreyeahs-new`
Your Next.js URL: `http://localhost:3000/moreyeahs-new`
API Endpoint: `http://localhost/moreyeahs-new/wp-json/wp/v2/footer-widgets`

## 🚀 Ready to Go!

Once you add widgets and configure copyright text, your dynamic footer will automatically appear on your Next.js site!
