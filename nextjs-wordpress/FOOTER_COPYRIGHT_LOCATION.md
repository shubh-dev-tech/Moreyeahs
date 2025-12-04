# Where to Find Footer Copyright Settings

## ✅ Code Added Successfully!

The footer widgets API code has been added to your WordPress theme's `functions.php` file.

## 📍 How to Access Copyright Settings

### Step 1: Go to WordPress Admin
1. Log in to your WordPress admin dashboard
2. Look at the left sidebar menu

### Step 2: Navigate to Settings > General
1. Click on **Settings** in the left sidebar
2. Click on **General** (first option under Settings)

### Step 3: Scroll Down to Footer Copyright Settings
1. Scroll down the General Settings page
2. You'll see a new section called **"Footer Copyright Settings"**
3. This section has two text areas:
   - **Copyright Left Text** (displays on the left side of footer)
   - **Copyright Right Text** (displays on the right side of footer)

## 📝 Example Copyright Text

### Left Side Example:
```html
© {year} All rights reserved.
```

### Right Side Example:
```html
Powered by <a href="https://nextjs.org">Next.js</a> & <a href="https://wordpress.org">WordPress</a>
```

## 🔄 After Saving

1. Click **"Save Changes"** at the bottom of the General Settings page
2. Go back to your Next.js frontend
3. Refresh the page to see the copyright text appear

## 🐛 If You Don't See the Settings

If the "Footer Copyright Settings" section doesn't appear:

1. **Clear WordPress cache** (if you have a caching plugin)
2. **Refresh the Settings page** (Ctrl+F5 or Cmd+Shift+R)
3. **Check that the code was added** to `wp-content/themes/twentytwentyfive/functions.php`
4. **Make sure you're using the Twenty Twenty-Five theme**

## 📸 What You Should See

The settings will appear on the **Settings > General** page, NOT in the Widgets area.

You should see:
- A section titled "Footer Copyright Settings"
- Two text areas for left and right copyright text
- Description text explaining HTML support and {year} placeholder

## 🎯 Widget Areas vs Copyright Settings

**Important:** 
- **Footer Columns 1-5** = Widget areas (Appearance > Widgets)
- **Copyright Left/Right** = General Settings (Settings > General)

They are in different locations!
